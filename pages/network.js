import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Award } from 'lucide-react';

const HUBSPOT_PORTAL_ID = '244430724';
const HUBSPOT_FORM_ID = '4d4e2afd-64de-4ed9-bd9b-57b6162ad4d0';

const INDUSTRIES = [
  'SaaS / Software', 'Healthcare / Life Sciences', 'Financial Services', 
  'Manufacturing', 'Retail / E-commerce', 'Professional Services',
  'Media / Entertainment', 'Real Estate', 'Education', 'Other'
];

const YEARS_OPTIONS = ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'];
const DEAL_SIZE_OPTIONS = ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K+', 'Not applicable'];
const HEARD_FROM_OPTIONS = ['LinkedIn', 'Referral from a friend', 'Google search', 'Revfinery website', 'Social media', 'Skills Assessment', 'Other'];

export default function TalentNetwork() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Assessment data from URL
  const [fromAssessment, setFromAssessment] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState('');
  const [assessmentTier, setAssessmentTier] = useState('');
  const [assessmentBlocker, setAssessmentBlocker] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    city: '',
    yearsInSales: '',
    currentRole: '',
    industries: [],
    typicalDealSize: '',
    workInterests: '',
    lookingFor: '',
    takenAssessment: '',
    assessmentScore: '',
    heardFrom: '',
    message: ''
  });

  // Read URL parameters on mount
  useEffect(() => {
    if (router.isReady) {
      const { score, tier, blocker, email, firstName, lastName } = router.query;
      if (score) {
        setFromAssessment(true);
        setAssessmentScore(score);
        setAssessmentTier(tier || '');
        setAssessmentBlocker(blocker || '');
        setFormData(prev => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: email || prev.email,
          takenAssessment: 'Yes',
          assessmentScore: score,
          heardFrom: 'Skills Assessment'
        }));
      }
    }
  }, [router.isReady, router.query]);

  const totalSteps = 4;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleIndustry = (industry) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.email.includes('@');
      case 2:
        return formData.yearsInSales && formData.industries.length > 0;
      case 3:
        return formData.typicalDealSize;
      case 4:
        return fromAssessment || formData.heardFrom;
      default:
        return false;
    }
  };

  const submitToHubSpot = async () => {
    setIsSubmitting(true);

    const data = {
      fields: [
        { name: 'firstname', value: formData.firstName },
        { name: 'lastname', value: formData.lastName },
        { name: 'email', value: formData.email },
        { name: 'linkedin_url', value: formData.linkedin },
        { name: 'city', value: formData.city },
        { name: 'years_in_sales_network', value: formData.yearsInSales },
        { name: 'current_role', value: formData.currentRole },
        { name: 'industries', value: formData.industries.join(', ') },
        { name: 'typical_deal_size', value: formData.typicalDealSize },
        { name: 'work_interests', value: formData.workInterests },
        { name: 'looking_for', value: formData.lookingFor },
        { name: 'taken_assessment', value: formData.takenAssessment },
        { name: 'assessment_score', value: formData.assessmentScore },
        { name: 'heard_from', value: formData.heardFrom },
        { name: 'message', value: formData.message }
      ],
      context: {
        pageUri: window.location.href,
        pageName: 'Talent Network Application'
      }
    };

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error('HubSpot error:', errorData);
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Application Submitted | Revfinery Talent Network</title>
        </Head>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fbf6f1 0%, #fff7e8 50%, #eaf6f7 100%)', padding: '24px'}}>
          <div style={{maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 32px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
            <div style={{width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%', backgroundColor: '#0c6b73', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CheckCircle style={{width: '40px', height: '40px', color: 'white'}} />
            </div>
            <h1 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', color: '#0e2a2d'}}>Application Received!</h1>
            <p style={{fontSize: '16px', color: '#4c5f62', marginBottom: '32px'}}>
              Thanks for applying to the Talent Network. We'll review your application and be in touch soon.
            </p>
            <a href="https://www.revfinery.com" style={{display: 'inline-block', padding: '14px 28px', backgroundColor: '#0c6b73', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '600'}}>
              Back to Revfinery
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Apply to the Talent Network | Revfinery</title>
      </Head>
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fbf6f1 0%, #fff7e8 50%, #eaf6f7 100%)'}}>
        {/* Header */}
        <div style={{padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <a href="https://www.revfinery.com" style={{display: 'flex', alignItems: 'center', color: '#4c5f62', textDecoration: 'none', fontWeight: '600', fontSize: '15px'}}>
            <ArrowLeft style={{width: '18px', height: '18px', marginRight: '8px'}} />
            Back to Revfinery
          </a>
          <span style={{fontWeight: 'bold', fontSize: '18px', color: '#0c6b73'}}>Revfinery</span>
        </div>

        <div style={{maxWidth: '640px', margin: '0 auto', padding: '40px 24px'}}>
          {/* Title Section */}
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <span style={{display: 'inline-block', padding: '8px 16px', marginBottom: '12px', fontWeight: 'bold', fontSize: '13px', backgroundColor: '#f25025', color: 'white', borderRadius: '20px'}}>
              TALENT NETWORK
            </span>
            <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#0e2a2d'}}>Join the Network</h1>
            <p style={{color: '#4c5f62'}}>Get matched to opportunities that fit your skills</p>
            
            {/* Show badge if from assessment */}
            {fromAssessment && assessmentScore && (
              <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 16px', backgroundColor: '#eaf6f7', borderRadius: '12px', border: '2px solid #0c6b73'}}>
                <Award style={{width: '20px', height: '20px', color: '#0c6b73'}} />
                <span style={{fontWeight: '600', color: '#0c6b73'}}>Assessment Score: {assessmentScore}%</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{marginBottom: '32px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '600'}}>
              <span style={{color: '#0e2a2d'}}>Step {currentStep} of {totalSteps}</span>
              <span style={{color: '#0c6b73'}}>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div style={{height: '8px', backgroundColor: '#eaf6f7', borderRadius: '8px', overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: '#f25025', borderRadius: '8px', transition: 'width 0.3s'}} />
            </div>
          </div>

          {/* Form Card */}
          <div style={{backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)'}}>
            
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Let's start with the basics</h2>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                </div>

                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>

                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g., Atlanta, GA"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {currentStep === 2 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Tell us about your experience</h2>
                
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Years in Sales *</label>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    {YEARS_OPTIONS.map(option => (
                      <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', border: formData.yearsInSales === option ? '2px solid #f25025' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.yearsInSales === option ? '#fff7e8' : 'white'}}>
                        <input
                          type="radio"
                          name="yearsInSales"
                          checked={formData.yearsInSales === option}
                          onChange={() => updateField('yearsInSales', option)}
                          style={{marginRight: '10px', accentColor: '#f25025'}}
                        />
                        <span style={{fontSize: '14px', color: '#0e2a2d'}}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Current Role</label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={(e) => updateField('currentRole', e.target.value)}
                    placeholder="e.g., Account Executive"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Industries you've sold in *</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {INDUSTRIES.map(industry => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleIndustry(industry)}
                        style={{padding: '10px 16px', border: formData.industries.includes(industry) ? '2px solid #f25025' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.industries.includes(industry) ? '#fff7e8' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d', display: 'flex', alignItems: 'center', gap: '6px'}}
                      >
                        {formData.industries.includes(industry) && <Check style={{width: '14px', height: '14px', color: '#f25025'}} />}
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>What are you looking for?</h2>
                
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Typical Deal Size *</label>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {DEAL_SIZE_OPTIONS.map(option => (
                      <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', border: formData.typicalDealSize === option ? '2px solid #f25025' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.typicalDealSize === option ? '#fff7e8' : 'white'}}>
                        <input
                          type="radio"
                          name="typicalDealSize"
                          checked={formData.typicalDealSize === option}
                          onChange={() => updateField('typicalDealSize', option)}
                          style={{marginRight: '10px', accentColor: '#f25025'}}
                        />
                        <span style={{fontSize: '14px', color: '#0e2a2d'}}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>What kind of work interests you?</label>
                  <textarea
                    value={formData.workInterests}
                    onChange={(e) => updateField('workInterests', e.target.value)}
                    placeholder="e.g., Fractional sales roles, project-based work, full-time opportunities..."
                    rows={3}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>What are you looking for from the network?</label>
                  <textarea
                    value={formData.lookingFor}
                    onChange={(e) => updateField('lookingFor', e.target.value)}
                    placeholder="e.g., Training, job opportunities, community, mentorship..."
                    rows={3}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Final */}
            {currentStep === 4 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Almost done!</h2>
                
                {/* Show verified score if from assessment */}
                {fromAssessment && assessmentScore ? (
                  <div style={{padding: '20px', marginBottom: '24px', backgroundColor: '#eaf6f7', borderRadius: '12px', border: '2px solid #0c6b73'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <Award style={{width: '24px', height: '24px', color: '#0c6b73'}} />
                      <div>
                        <p style={{fontWeight: '600', color: '#0e2a2d', marginBottom: '4px'}}>Skills Assessment Completed ✓</p>
                        <p style={{fontSize: '14px', color: '#4c5f62'}}>Your verified score: <strong>{assessmentScore}%</strong></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{marginBottom: '24px'}}>
                      <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Have you taken the Revfinery Skills Assessment?</label>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                        {['Yes', 'No', 'Not yet, but I plan to'].map(option => (
                          <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', border: formData.takenAssessment === option ? '2px solid #f25025' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.takenAssessment === option ? '#fff7e8' : 'white'}}>
                            <input
                              type="radio"
                              name="takenAssessment"
                              checked={formData.takenAssessment === option}
                              onChange={() => updateField('takenAssessment', option)}
                              style={{marginRight: '8px', accentColor: '#f25025'}}
                            />
                            <span style={{fontSize: '14px', color: '#0e2a2d'}}>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{marginBottom: '24px'}}>
                      <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>How did you hear about us? *</label>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                        {HEARD_FROM_OPTIONS.map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField('heardFrom', option)}
                            style={{padding: '10px 16px', border: formData.heardFrom === option ? '2px solid #f25025' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.heardFrom === option ? '#fff7e8' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d'}}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Anything else you'd like us to know?</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Optional..."
                    rows={4}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #eaf6f7'}}>
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'transparent', border: 'none', color: currentStep === 1 ? '#ccc' : '#4c5f62', cursor: currentStep === 1 ? 'default' : 'pointer', fontWeight: '600', fontSize: '15px'}}
              >
                <ArrowLeft style={{width: '18px', height: '18px'}} />
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: canProceed() ? '#f25025' : '#ccc', color: 'white', border: 'none', borderRadius: '12px', cursor: canProceed() ? 'pointer' : 'default', fontWeight: '600', fontSize: '15px'}}
                >
                  Continue
                  <ArrowRight style={{width: '18px', height: '18px'}} />
                </button>
              ) : (
                <button
                  onClick={submitToHubSpot}
                  disabled={!canProceed() || isSubmitting}
                  style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: canProceed() && !isSubmitting ? '#0c6b73' : '#ccc', color: 'white', border: 'none', borderRadius: '12px', cursor: canProceed() && !isSubmitting ? 'pointer' : 'default', fontWeight: '600', fontSize: '15px'}}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  {!isSubmitting && <CheckCircle style={{width: '18px', height: '18px'}} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

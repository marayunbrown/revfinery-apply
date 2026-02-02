import { useState } from 'react';
import Head from 'next/head';
import { ArrowLeft, ArrowRight, Check, CheckCircle, GraduationCap } from 'lucide-react';

const HUBSPOT_PORTAL_ID = '244430724';
const HUBSPOT_FORM_ID = '4d4e2afd-64de-4ed9-bd9b-57b6162ad4d0'; // Using network form, can change to cohort-specific

const GRADUATION_YEARS = ['2024', '2025', '2026', '2027', '2028', 'Already graduated', 'N/A - Career changer'];
const HEARD_FROM_OPTIONS = ['LinkedIn', 'University/Professor', 'Friend/Referral', 'Google search', 'Revfinery website', 'Social media', 'Other'];

export default function CohortApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    school: '',
    major: '',
    graduationYear: '',
    city: '',
    whySales: '',
    whatHoping: '',
    heardFrom: '',
    message: ''
  });

  const totalSteps = 3;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.email.includes('@');
      case 2:
        return formData.graduationYear && formData.whySales;
      case 3:
        return formData.heardFrom;
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
        { name: 'school', value: formData.school },
        { name: 'major', value: formData.major },
        { name: 'graduation_year', value: formData.graduationYear },
        { name: 'why_sales', value: formData.whySales },
        { name: 'what_hoping', value: formData.whatHoping },
        { name: 'heard_from', value: formData.heardFrom },
        { name: 'message', value: formData.message },
        { name: 'application_type', value: 'University Cohort' }
      ],
      context: {
        pageUri: window.location.href,
        pageName: 'University Cohort Application'
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
          <title>Application Submitted | Revfinery University Cohort</title>
        </Head>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff7e8 0%, #fbf6f1 50%, #eaf6f7 100%)', padding: '24px'}}>
          <div style={{maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 32px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
            <div style={{width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%', backgroundColor: '#ffd166', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <GraduationCap style={{width: '40px', height: '40px', color: '#0e2a2d'}} />
            </div>
            <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#0e2a2d'}}>Application Received!</h1>
            <p style={{color: '#4c5f62', marginBottom: '24px', lineHeight: '1.6'}}>
              Thanks for applying to the University Cohort. We review applications weekly and will reach out with next steps — including your cohort code if accepted.
            </p>
            <div style={{padding: '16px', backgroundColor: '#fff7e8', borderRadius: '12px', marginBottom: '24px'}}>
              <p style={{fontSize: '14px', color: '#5b3e2a', fontWeight: '600', marginBottom: '8px'}}>What happens next:</p>
              <ul style={{textAlign: 'left', fontSize: '14px', color: '#3a5052', margin: '0', paddingLeft: '20px'}}>
                <li style={{marginBottom: '4px'}}>We'll review your application</li>
                <li style={{marginBottom: '4px'}}>If accepted, you'll receive your cohort code via email</li>
                <li style={{marginBottom: '4px'}}>Sign up at trainer.revfinery.com with your code</li>
                <li>Join the cohort Slack and start training!</li>
              </ul>
            </div>
            <a 
              href="https://www.revfinery.com/talent-network" 
              style={{display: 'inline-block', padding: '12px 24px', backgroundColor: '#0c6b73', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '600'}}
            >
              Back to Talent Network
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Apply | Revfinery University Cohort</title>
        <meta name="description" content="Apply to the Revfinery University Cohort - 8 weeks of sales training for students and early-career professionals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://cdn.prod.website-files.com/68854e916991f33c6c47cd8c/69041aa4d9f017ce0c6842d8_ChatGPT%20Image%20Oct%2030%2C%202025%2C%2010_10_20%20PM.png" />
      </Head>

      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fff7e8 0%, #fbf6f1 50%, #eaf6f7 100%)', padding: '24px 16px'}}>
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          
          {/* Header */}
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <a href="https://www.revfinery.com/talent-network" style={{display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4c5f62', textDecoration: 'none', fontSize: '14px', marginBottom: '16px'}}>
              <ArrowLeft size={16} />
              Back to Talent Network
            </a>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffd166', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px'}}>
              <GraduationCap size={16} />
              <span style={{fontWeight: '700', fontSize: '13px', color: '#0e2a2d'}}>University Cohort</span>
            </div>
            <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#0e2a2d', margin: '0 0 8px'}}>Apply to the Next Cohort</h1>
            <p style={{color: '#4c5f62', margin: '0'}}>8 weeks of virtual sales training. Certificate + job matching.</p>
          </div>

          {/* Progress */}
          <div style={{display: 'flex', gap: '8px', marginBottom: '24px'}}>
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: step <= currentStep ? '#ffd166' : '#e5e7eb'
                }}
              />
            ))}
          </div>

          {/* Form Card */}
          <div style={{backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '32px'}}>
            
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Tell us about yourself</h2>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="Alex"
                      style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Johnson"
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
                    placeholder="alex@university.edu"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>

                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/alexjohnson"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Atlanta, GA"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Background */}
            {currentStep === 2 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Your background</h2>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>School/University</label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => updateField('school', e.target.value)}
                      placeholder="Georgia Tech"
                      style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Major/Field</label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => updateField('major', e.target.value)}
                      placeholder="Business, Communications..."
                      style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                    />
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Expected Graduation *</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {GRADUATION_YEARS.map(year => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => updateField('graduationYear', year)}
                        style={{
                          padding: '10px 16px',
                          border: formData.graduationYear === year ? '2px solid #ffd166' : '2px solid #eaf6f7',
                          borderRadius: '20px',
                          backgroundColor: formData.graduationYear === year ? '#fff7e8' : 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#0e2a2d',
                          fontWeight: formData.graduationYear === year ? '600' : '400'
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '16px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Why do you want to get into sales? *</label>
                  <textarea
                    value={formData.whySales}
                    onChange={(e) => updateField('whySales', e.target.value)}
                    placeholder="What draws you to a sales career? What do you hope to achieve?"
                    rows={4}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>What are you hoping to get from this program?</label>
                  <textarea
                    value={formData.whatHoping}
                    onChange={(e) => updateField('whatHoping', e.target.value)}
                    placeholder="Skills, confidence, job opportunities, networking..."
                    rows={3}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box'}}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Final */}
            {currentStep === 3 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Almost done!</h2>
                
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>How did you hear about us? *</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {HEARD_FROM_OPTIONS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('heardFrom', option)}
                        style={{
                          padding: '10px 16px',
                          border: formData.heardFrom === option ? '2px solid #ffd166' : '2px solid #eaf6f7',
                          borderRadius: '20px',
                          backgroundColor: formData.heardFrom === option ? '#fff7e8' : 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#0e2a2d'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

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

                {/* Program summary */}
                <div style={{marginTop: '24px', padding: '16px', backgroundColor: '#eaf6f7', borderRadius: '12px'}}>
                  <p style={{fontSize: '13px', color: '#0c6b73', fontWeight: '600', marginBottom: '8px'}}>What you're applying for:</p>
                  <ul style={{margin: '0', paddingLeft: '18px', fontSize: '13px', color: '#3a5052'}}>
                    <li>8-week virtual sales training cohort</li>
                    <li>Full access to AI Trainer platform</li>
                    <li>Live kickoff + graduation sessions</li>
                    <li>Private Slack community</li>
                    <li>Certificate + job matching upon completion</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #eaf6f7'}}>
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: currentStep === 1 ? '#ccc' : '#4c5f62',
                  cursor: currentStep === 1 ? 'default' : 'pointer',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                <ArrowLeft style={{width: '18px', height: '18px'}} />
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    backgroundColor: canProceed() ? '#ffd166' : '#ccc',
                    color: '#0e2a2d',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: canProceed() ? 'pointer' : 'default',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  Continue
                  <ArrowRight style={{width: '18px', height: '18px'}} />
                </button>
              ) : (
                <button
                  onClick={submitToHubSpot}
                  disabled={!canProceed() || isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    backgroundColor: canProceed() && !isSubmitting ? '#0c6b73' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: canProceed() && !isSubmitting ? 'pointer' : 'default',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  {!isSubmitting && <CheckCircle style={{width: '18px', height: '18px'}} />}
                </button>
              )}
            </div>
          </div>

          {/* Footer note */}
          <p style={{textAlign: 'center', fontSize: '13px', color: '#6b7d80', marginTop: '24px'}}>
            Already have a cohort code? <a href="https://trainer.revfinery.com/signup" style={{color: '#0c6b73', fontWeight: '600'}}>Sign up here</a>
          </p>
        </div>
      </div>
    </>
  );
}

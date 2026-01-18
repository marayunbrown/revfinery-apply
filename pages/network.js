import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle } from 'lucide-react';

const HUBSPOT_PORTAL_ID = '244430724';
const HUBSPOT_FORM_ID = 'NETWORK_FORM_ID_HERE'; // You'll need to create this form in HubSpot

const INDUSTRIES = [
  'SaaS / Software',
  'FinTech / Financial Services',
  'Healthcare / HealthTech',
  'E-commerce / Retail',
  'Manufacturing / Industrial',
  'Professional Services',
  'Real Estate',
  'EdTech / Education',
  'MarTech / Advertising',
  'Other'
];

const WORK_INTERESTS = [
  'Prospecting / Outbound',
  'Discovery & Qualification',
  'Running full-cycle deals',
  'Account Management'
];

const LOOKING_FOR = [
  'Part-time / Flexible work',
  'Full-time role',
  'Project-based engagements',
  'Training & skill development'
];

const HEARD_FROM = [
  'LinkedIn',
  'Referral from a friend',
  'Google search',
  'Revfinery website',
  'Social media',
  'Other'
];

export default function NetworkApplication() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    location: '',
    yearsExperience: '',
    currentRole: '',
    industries: [],
    dealSize: '',
    workInterests: [],
    lookingFor: [],
    takenAssessment: '',
    assessmentScore: '',
    heardFrom: '',
    anythingElse: ''
  });

  const totalSteps = 4;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const canProceed = () => {
    switch(step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.yearsExperience && formData.currentRole;
      case 3:
        return formData.workInterests.length > 0 && formData.lookingFor.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Prepare data for HubSpot
    const hubspotData = {
      fields: [
        { name: 'firstname', value: formData.firstName },
        { name: 'lastname', value: formData.lastName },
        { name: 'email', value: formData.email },
        { name: 'linkedin_url', value: formData.linkedin },
        { name: 'city', value: formData.location },
        { name: 'years_in_sales', value: formData.yearsExperience },
        { name: 'current_role', value: formData.currentRole },
        { name: 'industries', value: formData.industries.join('; ') },
        { name: 'typical_deal_size', value: formData.dealSize },
        { name: 'work_interests', value: formData.workInterests.join('; ') },
        { name: 'looking_for', value: formData.lookingFor.join('; ') },
        { name: 'taken_assessment', value: formData.takenAssessment },
        { name: 'assessment_score', value: formData.assessmentScore },
        { name: 'heard_from', value: formData.heardFrom },
        { name: 'message', value: formData.anythingElse }
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
          body: JSON.stringify(hubspotData)
        }
      );
      
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Still show success for now, log error
        console.log('HubSpot submission error');
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log('Network error:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Application Received | Revfinery Talent Network</title>
        </Head>
        <div className="form-container">
          <header className="form-header">
            <a href="https://www.revfinery.com/talent-network">
              <ArrowLeft size={16} />
              Back to Revfinery
            </a>
          </header>
          
          <div className="form-card">
            <div className="success-container">
              <div className="success-icon">
                <CheckCircle />
              </div>
              <h2>Application Received!</h2>
              <p>Thanks for applying to the Revfinery Talent Network. We review applications weekly and will be in touch soon.</p>
              
              <div className="next-steps">
                <h4>What happens next?</h4>
                <ul>
                  <li>We'll review your application within 5-7 business days</li>
                  <li>If there's a fit, we'll schedule a quick intro call</li>
                  <li>You'll get access to training resources and opportunities</li>
                </ul>
              </div>
              
              {formData.takenAssessment !== 'Yes' && (
                <a 
                  href="https://revfinery-assessment.vercel.app" 
                  className="btn btn-teal"
                  style={{ marginBottom: '12px' }}
                >
                  Take the Skills Assessment
                  <ArrowRight size={16} />
                </a>
              )}
              
              <br />
              <a href="https://www.revfinery.com" className="btn btn-secondary">
                Return to Revfinery
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Apply to the Talent Network | Revfinery</title>
        <meta name="description" content="Apply to join the Revfinery Talent Network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="form-container">
        <header className="form-header">
          <a href="https://www.revfinery.com/talent-network">
            <ArrowLeft size={16} />
            Back to Revfinery
          </a>
          <h1>Apply to the <span className="gradient-text">Talent Network</span></h1>
          <p>Build skills, get matched, grow your career.</p>
        </header>

        <div className="progress-container">
          <div className="progress-steps">
            {[1,2,3,4].map(s => (
              <div 
                key={s} 
                className={`progress-step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
              />
            ))}
          </div>
          <div className="progress-label">Step {step} of {totalSteps}</div>
        </div>

        <div className="form-card">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <h2>Let's start with the basics</h2>
              <p className="subtitle">Tell us a bit about yourself.</p>
              
              <div className="field-row">
                <div className="field-group">
                  <label>First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => updateField('firstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="field-group">
                  <label>Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => updateField('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div className="field-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
              
              <div className="field-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={e => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div className="field-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
            </>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <>
              <h2>Your experience</h2>
              <p className="subtitle">Help us understand your background.</p>
              
              <div className="field-group">
                <label>Years in Sales <span className="required">*</span></label>
                <select
                  value={formData.yearsExperience}
                  onChange={e => updateField('yearsExperience', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
              
              <div className="field-group">
                <label>Current or Most Recent Role <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={e => updateField('currentRole', e.target.value)}
                  placeholder="e.g., SDR at Acme Corp"
                />
              </div>
              
              <div className="field-group">
                <label>Industries you've sold in</label>
                <p className="helper-text">Select all that apply</p>
                <div className="checkbox-grid">
                  {INDUSTRIES.map(industry => (
                    <label 
                      key={industry} 
                      className={`checkbox-item ${formData.industries.includes(industry) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.industries.includes(industry)}
                        onChange={() => toggleArrayField('industries', industry)}
                      />
                      <span className="checkbox-box">
                        <Check />
                      </span>
                      <span className="checkbox-label">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="field-group">
                <label>Typical Deal Size</label>
                <select
                  value={formData.dealSize}
                  onChange={e => updateField('dealSize', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Under $10K">Under $10K</option>
                  <option value="$10K - $50K">$10K - $50K</option>
                  <option value="$50K - $100K">$50K - $100K</option>
                  <option value="$100K+">$100K+</option>
                  <option value="Not applicable">Not applicable</option>
                </select>
              </div>
            </>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <>
              <h2>What interests you?</h2>
              <p className="subtitle">Help us match you to the right opportunities.</p>
              
              <div className="field-group">
                <label>What type of work interests you? <span className="required">*</span></label>
                <p className="helper-text">Select all that apply</p>
                <div className="checkbox-grid">
                  {WORK_INTERESTS.map(interest => (
                    <label 
                      key={interest} 
                      className={`checkbox-item ${formData.workInterests.includes(interest) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.workInterests.includes(interest)}
                        onChange={() => toggleArrayField('workInterests', interest)}
                      />
                      <span className="checkbox-box">
                        <Check />
                      </span>
                      <span className="checkbox-label">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="field-group">
                <label>What are you looking for? <span className="required">*</span></label>
                <p className="helper-text">Select all that apply</p>
                <div className="checkbox-grid">
                  {LOOKING_FOR.map(item => (
                    <label 
                      key={item} 
                      className={`checkbox-item ${formData.lookingFor.includes(item) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.lookingFor.includes(item)}
                        onChange={() => toggleArrayField('lookingFor', item)}
                      />
                      <span className="checkbox-box">
                        <Check />
                      </span>
                      <span className="checkbox-label">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Wrap-up */}
          {step === 4 && (
            <>
              <h2>Almost done!</h2>
              <p className="subtitle">A few more questions to wrap up.</p>
              
              <div className="field-group">
                <label>Have you taken the Revfinery Skills Assessment?</label>
                <div className="radio-grid">
                  {['Yes', 'No', 'Not yet, but I plan to'].map(option => (
                    <label 
                      key={option}
                      className={`checkbox-item ${formData.takenAssessment === option ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="takenAssessment"
                        checked={formData.takenAssessment === option}
                        onChange={() => updateField('takenAssessment', option)}
                      />
                      <span className="checkbox-box">
                        <Check />
                      </span>
                      <span className="checkbox-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {formData.takenAssessment === 'Yes' && (
                <div className="field-group">
                  <label>What was your score?</label>
                  <input
                    type="text"
                    value={formData.assessmentScore}
                    onChange={e => updateField('assessmentScore', e.target.value)}
                    placeholder="e.g., 72%"
                  />
                </div>
              )}
              
              <div className="field-group">
                <label>How did you hear about Revfinery?</label>
                <select
                  value={formData.heardFrom}
                  onChange={e => updateField('heardFrom', e.target.value)}
                >
                  <option value="">Select...</option>
                  {HEARD_FROM.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              
              <div className="field-group">
                <label>Anything else you'd like us to know?</label>
                <textarea
                  value={formData.anythingElse}
                  onChange={e => updateField('anythingElse', e.target.value)}
                  placeholder="Tell us about your goals, availability, or anything else..."
                />
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="button-row">
            {step > 1 ? (
              <button 
                className="btn btn-secondary"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <Link href="/" className="btn btn-secondary">
                <ArrowLeft size={16} />
                Back
              </Link>
            )}
            
            {step < totalSteps ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

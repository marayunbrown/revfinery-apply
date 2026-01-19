import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Star } from 'lucide-react';

const HUBSPOT_PORTAL_ID = '244430724';
const HUBSPOT_FORM_ID = '2e3b1eeb-c6b9-47fe-b3a2-80123e82f4b0';

const INDUSTRIES = [
  'SaaS / Software', 'FinTech / Financial Services', 'Healthcare / HealthTech',
  'E-commerce / Retail', 'Manufacturing / Industrial', 'Professional Services',
  'Real Estate', 'EdTech / Education', 'MarTech / Advertising', 'Other'
];

const STRENGTHS = [
  'Running complex deals', 'Negotiation & closing', 'Pipeline management & forecasting',
  'Coaching / developing reps', 'Building sales processes', 'Sales strategy & planning',
  'Fractional leadership', 'Training delivery'
];

const ENGAGEMENT_TYPES = [
  'Fractional Sales Leadership', 'Deal coaching & strategy', 'Sales process consulting',
  'Training delivery', 'Interim / project-based roles'
];

const HEARD_FROM = [
  'LinkedIn', 'Referral from a friend', 'Google search',
  'Revfinery website', 'Social media', 'Skills Assessment', 'Other'
];

export default function BenchApplication() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', linkedin: '', location: '',
    yearsExperience: '', currentRole: '', industries: [], largestDeal: '',
    managedTeam: '', teamSize: '', strengths: [], engagementTypes: [],
    availability: '', hoursPerWeek: '', desiredRate: '', projectPricing: '',
    takenAssessment: '', assessmentScore: '', portfolioLink: '', heardFrom: '', anythingElse: ''
  });
  const totalSteps = 5;

  // Read URL parameters on mount (score, email, firstName, lastName from assessment)
  useEffect(() => {
    if (router.isReady) {
      const { score, email, firstName, lastName } = router.query;
      
      setFormData(prev => ({
        ...prev,
        firstName: firstName ? decodeURIComponent(firstName) : prev.firstName,
        lastName: lastName ? decodeURIComponent(lastName) : prev.lastName,
        email: email ? decodeURIComponent(email) : prev.email,
        assessmentScore: score ? `${score}%` : prev.assessmentScore,
        takenAssessment: score ? 'Yes' : prev.takenAssessment,
        heardFrom: score ? 'Skills Assessment' : prev.heardFrom
      }));
    }
  }, [router.isReady, router.query]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleArrayField = (field, value) => setFormData(prev => ({
    ...prev, [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
  }));

  const canProceed = () => {
    switch(step) {
      case 1: return formData.firstName && formData.lastName && formData.email;
      case 2: return formData.yearsExperience && formData.currentRole;
      case 3: return formData.strengths.length > 0 && formData.engagementTypes.length > 0;
      case 4: return formData.availability && formData.desiredRate;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
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
        { name: 'largest_deal_size', value: formData.largestDeal },
        { name: 'managed_team', value: formData.managedTeam },
        { name: 'team_size', value: formData.teamSize },
        { name: 'strengths', value: formData.strengths.join('; ') },
        { name: 'engagement_types', value: formData.engagementTypes.join('; ') },
        { name: 'availability', value: formData.availability },
        { name: 'hours_per_week', value: formData.hoursPerWeek },
        { name: 'desired_rate', value: formData.desiredRate },
        { name: 'project_pricing', value: formData.projectPricing },
        { name: 'taken_assessment', value: formData.takenAssessment },
        { name: 'assessment_score', value: formData.assessmentScore },
        { name: 'portfolio_link', value: formData.portfolioLink },
        { name: 'heard_from', value: formData.heardFrom },
        { name: 'message', value: formData.anythingElse }
      ],
      context: { pageUri: window.location.href, pageName: 'Revfinery Bench Application' }
    };
    try {
      await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hubspotData)
      });
      setIsSubmitted(true);
    } catch (error) { console.log('Error:', error); setIsSubmitted(true); }
    finally { setIsSubmitting(false); }
  };

  // Check if user came from assessment
  const cameFromAssessment = router.query.score;
  const assessmentScore = parseInt(router.query.score) || 0;

  if (isSubmitted) {
    return (
      <>
        <Head><title>Application Received | Revfinery Bench</title></Head>
        <div className="form-container">
          <header className="form-header">
            <a href="https://www.revfinery.com/talent-network"><ArrowLeft size={16} />Back to Revfinery</a>
          </header>
          <div className="form-card">
            <div className="success-container">
              <div className="success-icon" style={{ background: 'linear-gradient(135deg, #fff7e8, #ffe4c9)' }}>
                <Star style={{ stroke: '#f25025', fill: '#f25025' }} />
              </div>
              <h2>Application Received!</h2>
              <p>Thanks for applying to the Revfinery Bench. We review Bench applications personally and will be in touch soon.</p>
              <div className="next-steps">
                <h4>What happens next?</h4>
                <ul>
                  <li>We review your application within 3-5 business days</li>
                  <li>Qualified candidates receive a calendar link for a 30-min conversation</li>
                  <li>We discuss opportunities, fit, and how we work together</li>
                </ul>
              </div>
              <a href="https://www.revfinery.com" className="btn btn-primary">Return to Revfinery</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Apply to the Bench | Revfinery</title>
        <meta name="description" content="Apply to the Revfinery Bench" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="form-container">
        <header className="form-header">
          <a href="https://www.revfinery.com/talent-network"><ArrowLeft size={16} />Back to Revfinery</a>
          <h1>Apply to the <span className="gradient-text">Revfinery Bench</span></h1>
          <p>Consult on real client engagements alongside Revfinery.</p>
          
          {/* Show qualified badge if came from assessment with 75%+ */}
          {cameFromAssessment && assessmentScore >= 75 && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #ffd166, #f25025)',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '800',
              color: '#fff'
            }}>
              <Star size={16} fill="#fff" />
              Bench Qualified: {router.query.score}%
            </div>
          )}
        </header>
        <div className="progress-container">
          <div className="progress-steps">
            {[1,2,3,4,5].map(s => (<div key={s} className={`progress-step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`} />))}
          </div>
          <div className="progress-label">Step {step} of {totalSteps}</div>
        </div>
        <div className="form-card">
          {step === 1 && (
            <>
              <h2>Let's start with the basics</h2>
              <p className="subtitle">{cameFromAssessment ? "We've pre-filled some info from your assessment. Verify and continue." : "Tell us a bit about yourself."}</p>
              <div className="field-row">
                <div className="field-group">
                  <label>First Name <span className="required">*</span></label>
                  <input type="text" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="First name" />
                </div>
                <div className="field-group">
                  <label>Last Name <span className="required">*</span></label>
                  <input type="text" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Last name" />
                </div>
              </div>
              <div className="field-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="field-group">
                <label>LinkedIn Profile</label>
                <input type="url" value={formData.linkedin} onChange={e => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div className="field-group">
                <label>Location</label>
                <input type="text" value={formData.location} onChange={e => updateField('location', e.target.value)} placeholder="City, State" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Your experience</h2>
              <p className="subtitle">Help us understand your background and expertise.</p>
              <div className="field-group">
                <label>Years in Sales <span className="required">*</span></label>
                <select value={formData.yearsExperience} onChange={e => updateField('yearsExperience', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="5-7 years">5-7 years</option>
                  <option value="7-10 years">7-10 years</option>
                  <option value="10-15 years">10-15 years</option>
                  <option value="15+ years">15+ years</option>
                </select>
              </div>
              <div className="field-group">
                <label>Current or Most Recent Title <span className="required">*</span></label>
                <input type="text" value={formData.currentRole} onChange={e => updateField('currentRole', e.target.value)} placeholder="e.g., VP of Sales, Sales Director" />
              </div>
              <div className="field-group">
                <label>Industries you've sold in</label>
                <p className="helper-text">Select all that apply</p>
                <div className="checkbox-grid">
                  {INDUSTRIES.map(industry => (
                    <label key={industry} className={`checkbox-item ${formData.industries.includes(industry) ? 'selected' : ''}`}>
                      <input type="checkbox" checked={formData.industries.includes(industry)} onChange={() => toggleArrayField('industries', industry)} />
                      <span className="checkbox-box"><Check /></span>
                      <span className="checkbox-label">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field-group">
                <label>Largest Deal You've Closed</label>
                <select value={formData.largestDeal} onChange={e => updateField('largestDeal', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="$50K - $100K">$50K - $100K</option>
                  <option value="$100K - $250K">$100K - $250K</option>
                  <option value="$250K - $500K">$250K - $500K</option>
                  <option value="$500K - $1M">$500K - $1M</option>
                  <option value="$1M+">$1M+</option>
                </select>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Have you managed a sales team?</label>
                  <select value={formData.managedTeam} onChange={e => updateField('managedTeam', e.target.value)}>
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData.managedTeam === 'Yes' && (
                  <div className="field-group">
                    <label>Team Size</label>
                    <select value={formData.teamSize} onChange={e => updateField('teamSize', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1-3 people">1-3 people</option>
                      <option value="4-7 people">4-7 people</option>
                      <option value="8-15 people">8-15 people</option>
                      <option value="15+ people">15+ people</option>
                    </select>
                  </div>
                )}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>Strengths & Interests</h2>
              <p className="subtitle">What do you do best, and what kind of work excites you?</p>
              <div className="field-group">
                <label>Where do you feel strongest? <span className="required">*</span></label>
                <p className="helper-text">Select all that apply</p>
                <div className="checkbox-grid">
                  {STRENGTHS.map(strength => (
                    <label key={strength} className={`checkbox-item ${formData.strengths.includes(strength) ? 'selected' : ''}`}>
                      <input type="checkbox" checked={formData.strengths.includes(strength)} onChange={() => toggleArrayField('strengths', strength)} />
                      <span className="checkbox-box"><Check /></span>
                      <span className="checkbox-label">{strength}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field-group">
                <label>What type of engagements interest you? <span className="required">*</span></label>
                <p className="helper-text">Select all that apply</p>
                <div className="checkbox-grid">
                  {ENGAGEMENT_TYPES.map(type => (
                    <label key={type} className={`checkbox-item ${formData.engagementTypes.includes(type) ? 'selected' : ''}`}>
                      <input type="checkbox" checked={formData.engagementTypes.includes(type)} onChange={() => toggleArrayField('engagementTypes', type)} />
                      <span className="checkbox-box"><Check /></span>
                      <span className="checkbox-label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2>Availability & Rate</h2>
              <p className="subtitle">Help us understand your capacity and expectations.</p>
              <div className="field-group">
                <label>When are you available to start? <span className="required">*</span></label>
                <select value={formData.availability} onChange={e => updateField('availability', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Immediately">Immediately</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="Just exploring">Just exploring for now</option>
                </select>
              </div>
              <div className="field-group">
                <label>Hours per week available</label>
                <select value={formData.hoursPerWeek} onChange={e => updateField('hoursPerWeek', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="5-10 hours">5-10 hours</option>
                  <option value="10-20 hours">10-20 hours</option>
                  <option value="20-30 hours">20-30 hours</option>
                  <option value="30+ hours">30+ hours</option>
                  <option value="Flexible">Flexible / depends on project</option>
                </select>
              </div>
              <div className="field-group">
                <label>Desired Hourly Rate <span className="required">*</span></label>
                <select value={formData.desiredRate} onChange={e => updateField('desiredRate', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="$75-100/hr">$75-100/hr</option>
                  <option value="$100-150/hr">$100-150/hr</option>
                  <option value="$150-200/hr">$150-200/hr</option>
                  <option value="$200-250/hr">$200-250/hr</option>
                  <option value="$250+/hr">$250+/hr</option>
                </select>
              </div>
              <div className="field-group">
                <label>Open to project-based pricing?</label>
                <div className="checkbox-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {['Yes', 'No'].map(option => (
                    <label key={option} className={`checkbox-item ${formData.projectPricing === option ? 'selected' : ''}`}>
                      <input type="radio" name="projectPricing" checked={formData.projectPricing === option} onChange={() => updateField('projectPricing', option)} />
                      <span className="checkbox-box"><Check /></span>
                      <span className="checkbox-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h2>Almost done!</h2>
              <p className="subtitle">A few more questions to wrap up your application.</p>
              
              {/* Show pre-filled score if came from assessment */}
              {cameFromAssessment ? (
                <div className="field-group">
                  <label>Your Assessment Score</label>
                  <div style={{
                    padding: '16px',
                    background: assessmentScore >= 75 ? 'linear-gradient(135deg, #fff7e8, #ffe4c4)' : '#eaf6f7',
                    borderRadius: '12px',
                    border: assessmentScore >= 75 ? '2px solid #f25025' : '2px solid #0c6b73',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Star size={24} color={assessmentScore >= 75 ? '#f25025' : '#0c6b73'} fill={assessmentScore >= 75 ? '#f25025' : 'none'} />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '24px', color: assessmentScore >= 75 ? '#f25025' : '#0c6b73' }}>
                        {formData.assessmentScore}
                      </div>
                      <div style={{ fontSize: '13px', color: '#4c5f62' }}>
                        {assessmentScore >= 75 ? '🔥 Bench Qualified — Top 25%' : 'Verified from Skills Assessment'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="field-group">
                    <label>Have you taken the Revfinery Skills Assessment?</label>
                    <div className="checkbox-grid" style={{ gridTemplateColumns: '1fr' }}>
                      {['Yes', 'No', 'Not yet, but I plan to'].map(option => (
                        <label key={option} className={`checkbox-item ${formData.takenAssessment === option ? 'selected' : ''}`}>
                          <input type="radio" name="takenAssessment" checked={formData.takenAssessment === option} onChange={() => updateField('takenAssessment', option)} />
                          <span className="checkbox-box"><Check /></span>
                          <span className="checkbox-label">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.takenAssessment === 'Yes' && (
                    <div className="field-group">
                      <label>What was your score?</label>
                      <input type="text" value={formData.assessmentScore} onChange={e => updateField('assessmentScore', e.target.value)} placeholder="e.g., 82%" />
                      <p className="helper-text">Bench candidates typically score 75% or higher</p>
                    </div>
                  )}
                </>
              )}
              
              <div className="field-group">
                <label>Portfolio or Case Studies (optional)</label>
                <input type="url" value={formData.portfolioLink} onChange={e => updateField('portfolioLink', e.target.value)} placeholder="Link to portfolio, deck, or relevant work" />
              </div>
              
              {!cameFromAssessment && (
                <div className="field-group">
                  <label>How did you hear about Revfinery?</label>
                  <select value={formData.heardFrom} onChange={e => updateField('heardFrom', e.target.value)}>
                    <option value="">Select...</option>
                    {HEARD_FROM.map(source => (<option key={source} value={source}>{source}</option>))}
                  </select>
                </div>
              )}
              
              <div className="field-group">
                <label>Anything else you'd like us to know?</label>
                <textarea value={formData.anythingElse} onChange={e => updateField('anythingElse', e.target.value)} placeholder="Tell us about specific expertise, notable wins, or what excites you about Revfinery..." />
              </div>
            </>
          )}
          <div className="button-row">
            {step > 1 ? (
              <button className="btn btn-secondary" onClick={() => setStep(step - 1)}><ArrowLeft size={16} />Back</button>
            ) : (
              <Link href="/" className="btn btn-secondary"><ArrowLeft size={16} />Back</Link>
            )}
            {step < totalSteps ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>Continue<ArrowRight size={16} /></button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Application'}{!isSubmitting && <ArrowRight size={16} />}</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

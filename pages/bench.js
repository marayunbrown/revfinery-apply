import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Star } from 'lucide-react';

const HUBSPOT_PORTAL_ID = '244430724';
const HUBSPOT_FORM_ID = '2e3b1eeb-c6b9-47fe-b3a2-80123e82f4b0';

const INDUSTRIES = [
  'SaaS / Software', 'Healthcare / Life Sciences', 'Financial Services', 
  'Manufacturing', 'Retail / E-commerce', 'Professional Services',
  'Media / Entertainment', 'Real Estate', 'Education', 'Other'
];

const YEARS_OPTIONS = ['5-7 years', '7-10 years', '10-15 years', '15+ years'];
const DEAL_SIZE_OPTIONS = ['$50K - $100K', '$100K - $250K', '$250K - $500K', '$500K - $1M', '$1M+'];
const TEAM_SIZE_OPTIONS = ['1-3 people', '4-7 people', '8-15 people', '15+ people'];
const AVAILABILITY_OPTIONS = ['Immediately', '2-4 weeks', '1-2 months', 'Just exploring'];
const HOURS_OPTIONS = ['5-10 hours', '10-20 hours', '20-30 hours', '30+ hours', 'Flexible'];
const RATE_OPTIONS = ['$75-100/hr', '$100-150/hr', '$150-200/hr', '$200-250/hr', '$250+/hr'];
const HEARD_FROM_OPTIONS = ['LinkedIn', 'Referral from a friend', 'Google search', 'Revfinery website', 'Social media', 'Skills Assessment', 'Other'];

const ENGAGEMENT_TYPES = [
  'Fractional Sales Leadership',
  'Sales Training & Coaching', 
  'Pipeline Reviews',
  'Sales Process Design',
  'Team Building & Hiring',
  'CRM & Tech Stack',
  'Outbound Strategy',
  'Other'
];

const STRENGTHS = [
  'Discovery & Qualification',
  'Pipeline Management',
  'Deal Execution & Closing',
  'Messaging & Positioning',
  'Sales Process Design',
  'Team Leadership',
  'Coaching & Training',
  'Outbound / Prospecting',
  'Enterprise / Complex Sales',
  'SMB / Velocity Sales'
];

export default function RevfineryBench() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Check for URL parameters from assessment
  const [fromAssessment, setFromAssessment] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    city: '',
    yearsInSales: '',
    currentRole: '',
    industries: [],
    largestDealSize: '',
    managedTeam: '',
    teamSize: '',
    strengths: [],
    engagementTypes: [],
    availability: '',
    hoursPerWeek: '',
    desiredRate: '',
    projectPricing: '',
    takenAssessment: '',
    assessmentScore: '',
    portfolioLink: '',
    heardFrom: '',
    message: ''
  });

  // Read URL parameters on mount
  useEffect(() => {
    if (router.isReady) {
      const { score, email, firstName, lastName } = router.query;
      if (score) {
        setFromAssessment(true);
        setAssessmentScore(score);
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

  const totalSteps = 5;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(i => i !== value)
        : [...prev[field], value]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.email.includes('@');
      case 2:
        return formData.yearsInSales && formData.industries.length > 0;
      case 3:
        return formData.strengths.length > 0 && formData.engagementTypes.length > 0;
      case 4:
        return formData.availability && formData.desiredRate;
      case 5:
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
        { name: 'years_in_sales_bench', value: formData.yearsInSales },
        { name: 'current_role', value: formData.currentRole },
        { name: 'industries', value: formData.industries.join(', ') },
        { name: 'largest_deal_size', value: formData.largestDealSize },
        { name: 'managed_team', value: formData.managedTeam },
        { name: 'team_size', value: formData.teamSize },
        { name: 'strengths', value: formData.strengths.join(', ') },
        { name: 'engagement_types', value: formData.engagementTypes.join(', ') },
        { name: 'availability', value: formData.availability },
        { name: 'hours_per_week', value: formData.hoursPerWeek },
        { name: 'desired_rate', value: formData.desiredRate },
        { name: 'project_pricing', value: formData.projectPricing },
        { name: 'taken_assessment', value: formData.takenAssessment },
        { name: 'assessment_score', value: formData.assessmentScore },
        { name: 'portfolio_link', value: formData.portfolioLink },
        { name: 'heard_from', value: formData.heardFrom },
        { name: 'message', value: formData.message }
      ],
      context: {
        pageUri: window.location.href,
        pageName: 'Revfinery Bench Application'
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
          <title>Application Submitted | Revfinery Bench</title>
        </Head>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fbf6f1 0%, #fff7e8 50%, #eaf6f7 100%)', padding: '24px'}}>
          <div style={{maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 32px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
            <div style={{width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%', backgroundColor: '#0c6b73', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Star style={{width: '40px', height: '40px', color: 'white'}} />
            </div>
            <h1 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', color: '#0e2a2d'}}>Welcome to the Bench!</h1>
            <p style={{fontSize: '16px', color: '#4c5f62', marginBottom: '32px'}}>
              Thanks for applying. We'll review your application and reach out soon about next steps.
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
        <title>Apply to the Bench | Revfinery</title>
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
            <span style={{display: 'inline-block', padding: '8px 16px', marginBottom: '12px', fontWeight: 'bold', fontSize: '13px', backgroundColor: '#0c6b73', color: 'white', borderRadius: '20px'}}>
              THE BENCH
            </span>
            <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#0e2a2d'}}>Apply to the Bench</h1>
            <p style={{color: '#4c5f62'}}>Join our network of top sales consultants</p>
            
            {/* Show badge if from assessment with high score */}
            {fromAssessment && assessmentScore && parseInt(assessmentScore) >= 75 && (
              <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 16px', backgroundColor: '#ffd166', borderRadius: '12px'}}>
                <Star style={{width: '20px', height: '20px', color: '#0e2a2d'}} />
                <span style={{fontWeight: 'bold', color: '#0e2a2d'}}>BENCH QUALIFIED — Score: {assessmentScore}%</span>
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
              <div style={{height: '100%', width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: '#0c6b73', borderRadius: '8px', transition: 'width 0.3s'}} />
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
                      <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', border: formData.yearsInSales === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.yearsInSales === option ? '#eaf6f7' : 'white'}}>
                        <input
                          type="radio"
                          name="yearsInSales"
                          checked={formData.yearsInSales === option}
                          onChange={() => updateField('yearsInSales', option)}
                          style={{marginRight: '10px', accentColor: '#0c6b73'}}
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
                    placeholder="e.g., VP of Sales, Sales Director"
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Industries you've sold in *</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {INDUSTRIES.map(industry => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleArrayField('industries', industry)}
                        style={{padding: '10px 16px', border: formData.industries.includes(industry) ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.industries.includes(industry) ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d', display: 'flex', alignItems: 'center', gap: '6px'}}
                      >
                        {formData.industries.includes(industry) && <Check style={{width: '14px', height: '14px', color: '#0c6b73'}} />}
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Largest Deal You've Closed</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {DEAL_SIZE_OPTIONS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('largestDealSize', option)}
                        style={{padding: '10px 16px', border: formData.largestDealSize === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.largestDealSize === option ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d'}}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Have you managed a sales team?</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    {['Yes', 'No'].map(option => (
                      <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 24px', border: formData.managedTeam === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.managedTeam === option ? '#eaf6f7' : 'white'}}>
                        <input
                          type="radio"
                          name="managedTeam"
                          checked={formData.managedTeam === option}
                          onChange={() => updateField('managedTeam', option)}
                          style={{marginRight: '10px', accentColor: '#0c6b73'}}
                        />
                        <span style={{fontSize: '14px', color: '#0e2a2d'}}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.managedTeam === 'Yes' && (
                  <div>
                    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Team Size</label>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                      {TEAM_SIZE_OPTIONS.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField('teamSize', option)}
                          style={{padding: '10px 16px', border: formData.teamSize === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.teamSize === option ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d'}}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Strengths & Interests */}
            {currentStep === 3 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>What are your strengths?</h2>
                
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Core Strengths * (select all that apply)</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {STRENGTHS.map(strength => (
                      <button
                        key={strength}
                        type="button"
                        onClick={() => toggleArrayField('strengths', strength)}
                        style={{padding: '10px 16px', border: formData.strengths.includes(strength) ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.strengths.includes(strength) ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d', display: 'flex', alignItems: 'center', gap: '6px'}}
                      >
                        {formData.strengths.includes(strength) && <Check style={{width: '14px', height: '14px', color: '#0c6b73'}} />}
                        {strength}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Types of Engagements You're Interested In * (select all that apply)</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {ENGAGEMENT_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayField('engagementTypes', type)}
                        style={{padding: '10px 16px', border: formData.engagementTypes.includes(type) ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.engagementTypes.includes(type) ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d', display: 'flex', alignItems: 'center', gap: '6px'}}
                      >
                        {formData.engagementTypes.includes(type) && <Check style={{width: '14px', height: '14px', color: '#0c6b73'}} />}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Availability & Rate */}
            {currentStep === 4 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Availability & Rate</h2>
                
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>When could you start? *</label>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    {AVAILABILITY_OPTIONS.map(option => (
                      <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', border: formData.availability === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.availability === option ? '#eaf6f7' : 'white'}}>
                        <input
                          type="radio"
                          name="availability"
                          checked={formData.availability === option}
                          onChange={() => updateField('availability', option)}
                          style={{marginRight: '10px', accentColor: '#0c6b73'}}
                        />
                        <span style={{fontSize: '14px', color: '#0e2a2d'}}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Hours per week you could commit</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {HOURS_OPTIONS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('hoursPerWeek', option)}
                        style={{padding: '10px 16px', border: formData.hoursPerWeek === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.hoursPerWeek === option ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d'}}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Desired Hourly Rate *</label>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {RATE_OPTIONS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('desiredRate', option)}
                        style={{padding: '10px 16px', border: formData.desiredRate === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.desiredRate === option ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d'}}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Open to project-based pricing?</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    {['Yes', 'No'].map(option => (
                      <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 24px', border: formData.projectPricing === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.projectPricing === option ? '#eaf6f7' : 'white'}}>
                        <input
                          type="radio"
                          name="projectPricing"
                          checked={formData.projectPricing === option}
                          onChange={() => updateField('projectPricing', option)}
                          style={{marginRight: '10px', accentColor: '#0c6b73'}}
                        />
                        <span style={{fontSize: '14px', color: '#0e2a2d'}}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Final */}
            {currentStep === 5 && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#0e2a2d'}}>Almost done!</h2>
                
                {/* Show verified score if from assessment */}
                {fromAssessment && assessmentScore ? (
                  <div style={{padding: '20px', marginBottom: '24px', backgroundColor: '#ffd166', borderRadius: '12px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <Star style={{width: '24px', height: '24px', color: '#0e2a2d'}} />
                      <div>
                        <p style={{fontWeight: 'bold', color: '#0e2a2d', marginBottom: '4px'}}>Bench Qualified via Skills Assessment</p>
                        <p style={{fontSize: '14px', color: '#0e2a2d'}}>Your verified score: <strong>{assessmentScore}%</strong></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{marginBottom: '24px'}}>
                      <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Have you taken the Revfinery Skills Assessment?</label>
                      <div style={{display: 'flex', gap: '10px'}}>
                        {['Yes', 'No', 'Not yet, but I plan to'].map(option => (
                          <label key={option} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', border: formData.takenAssessment === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '12px', cursor: 'pointer', backgroundColor: formData.takenAssessment === option ? '#eaf6f7' : 'white', flex: 1, justifyContent: 'center'}}>
                            <input
                              type="radio"
                              name="takenAssessment"
                              checked={formData.takenAssessment === option}
                              onChange={() => updateField('takenAssessment', option)}
                              style={{marginRight: '8px', accentColor: '#0c6b73'}}
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
                            style={{padding: '10px 16px', border: formData.heardFrom === option ? '2px solid #0c6b73' : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: formData.heardFrom === option ? '#eaf6f7' : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d'}}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d'}}>Portfolio or Website Link</label>
                  <input
                    type="url"
                    value={formData.portfolioLink}
                    onChange={(e) => updateField('portfolioLink', e.target.value)}
                    placeholder="https://..."
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box'}}
                  />
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
                  style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: canProceed() ? '#0c6b73' : '#ccc', color: 'white', border: 'none', borderRadius: '12px', cursor: canProceed() ? 'pointer' : 'default', fontWeight: '600', fontSize: '15px'}}
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
                  {!isSubmitting && <Star style={{width: '18px', height: '18px'}} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

// One HubSpot form receives all three applications. The level is saved on every applicant.
const PORTAL_ID = '244430724';
const FORM_ID = '00fbf759-567b-4840-9222-7543849bbf80';
const JSON_HOSTS = ['api.hsforms.com', 'api-na2.hsforms.com'];
const UPLOAD_HOSTS = ['forms-na2.hubspot.com', 'forms.hubspot.com'];

const LEVEL = 'Cohort';
const ACCENT = '#ffd166';
const ACCENT_TEXT = '#0e2a2d';
const ACCENT_SOFT = '#fff7e8';
const LINKEDIN_REQUIRED = false;

const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Outside the US'];
const TIME_BLOCKS = ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekends'];
const WORK_OPTIONS = ['Booking meetings (BDR)', 'Closing deals (Account Executive)'];
const TYPE_TO_WORK = { 'BDR': 'Booking meetings (BDR)', 'Account Executive': 'Closing deals (Account Executive)', 'Sales Leader': 'Leading a team' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// The year list is built from today's date, so it never needs updating.
const THIS_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 13 }, (_, i) => String(THIS_YEAR - 6 + i));
const MAX_RESUME_MB = 5;

const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#0e2a2d' };
const inputStyle = { width: '100%', padding: '14px 16px', border: '2px solid #eaf6f7', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white', color: '#0e2a2d', fontFamily: 'inherit' };
const hintStyle = { fontSize: '13px', color: '#6b7d80', margin: '6px 0 0' };
const groupStyle = { marginBottom: '18px' };

const onlyNumber = (value) => String(value).replace(/[^0-9.]/g, '');

function Chips({ options, selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            style={{ padding: '10px 16px', border: active ? `2px solid ${ACCENT}` : '2px solid #eaf6f7', borderRadius: '20px', backgroundColor: active ? ACCENT_SOFT : 'white', cursor: 'pointer', fontSize: '14px', color: '#0e2a2d', fontWeight: active ? '700' : '500', fontFamily: 'inherit' }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function Application() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [roleType, setRoleType] = useState('');
  const [roleHours, setRoleHours] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [f, setF] = useState({
    firstName: '', lastName: '', email: '', phone: '', linkedin: '', state: '',
    hours: '', timeBlocks: [], workInterests: [],
    school: '', gradMonth: '', gradYear: '', recentJob: '', years: ''
  });

  const totalSteps = 3;
  const isPM = roleType === 'Project Manager';

  // The job board button passes the role in the link, for example ?role=...&type=BDR&hours=40
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || '';
    setRole(params.get('role') || '');
    setRoleType(type);
    setRoleHours(params.get('hours') || '');
    if (TYPE_TO_WORK[type] && WORK_OPTIONS.includes(TYPE_TO_WORK[type])) {
      setF((prev) => ({ ...prev, workInterests: [TYPE_TO_WORK[type]] }));
    }
  }, []);

  const set = (field, value) => setF((prev) => ({ ...prev, [field]: value }));
  const toggle = (field, value, max) => setF((prev) => {
    const list = prev[field];
    if (list.includes(value)) return { ...prev, [field]: list.filter((item) => item !== value) };
    if (max && list.length >= max) return prev;
    return { ...prev, [field]: [...list, value] };
  });

  const chooseResume = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setResume(null);
      setResumeError(`That file is larger than ${MAX_RESUME_MB} MB. Please choose a smaller one.`);
      return;
    }
    setResumeError('');
    setResume(file);
  };

  const canProceed = () => {
    if (step === 1) {
      return Boolean(f.firstName && f.lastName && f.email.includes('@') && f.phone && f.state && (!LINKEDIN_REQUIRED || f.linkedin));
    }
    if (step === 2) {
      return Boolean(f.school && f.recentJob && f.years !== '');
    }
    return Boolean(f.hours && f.timeBlocks.length > 0 && f.workInterests.length > 0 && resume);
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');

    const core = [
      ['firstname', f.firstName.trim()],
      ['lastname', f.lastName.trim()],
      ['email', f.email.trim()],
      ['phone', f.phone.trim()],
      ['hs_linkedin_url', f.linkedin.trim()],
      ['state', f.state],
      ['role_applied_for', role || `Talent Network, ${LEVEL} level`],
      ['application_level', LEVEL],
      ['role_type', roleType || 'Talent Network'],
      ['application_status', 'Reviewing'],
      ['weekday_availability', f.timeBlocks.join(', ')],
      ['work_interests', f.workInterests.join(', ')]
    ];
    const answers = [
      ['applicant_hours_per_week', f.hours],
      ['school', f.school.trim()],
      ['graduation_date', f.gradYear && f.gradMonth ? `${f.gradYear}-${f.gradMonth}` : ''],
      ['prior_jobs', f.recentJob.trim()],
      ['applicant_years_of_experience', f.years]
    ];

    const toFields = (pairs) => pairs
      .filter((pair) => pair[1] !== '' && pair[1] !== null && pair[1] !== undefined)
      .map((pair) => ({ name: pair[0], value: String(pair[1]) }));
    const context = { pageUri: window.location.href, pageName: `${LEVEL} Application` };
    const summary = toFields(answers).map((field) => `${field.name}: ${field.value}`).join(' | ');

    // First try sends every answer to its own property. If HubSpot rejects one,
    // the second try keeps the application by saving the answers in the message.
    const payloads = [
      { fields: toFields(core.concat(answers)), context },
      { fields: toFields(core.concat([['message', summary]])), context }
    ];

    let saved = false;
    for (const payload of payloads) {
      for (const host of JSON_HOSTS) {
        try {
          const response = await fetch(`https://${host}/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) { saved = true; break; }
          console.error('HubSpot error:', await response.text());
        } catch (err) {
          console.error('Submission error:', err);
        }
      }
      if (saved) break;
    }

    if (!saved) {
      setError('We could not send your application. Please check your connection and try again.');
      setSubmitting(false);
      return;
    }

    // The resume goes in a second call, because the first one cannot carry a file.
    if (resume) {
      for (const host of UPLOAD_HOSTS) {
        try {
          const body = new FormData();
          body.append('email', f.email.trim());
          body.append('resume', resume, resume.name);
          body.append('hs_context', JSON.stringify({ pageUrl: window.location.href, pageName: `${LEVEL} Application` }));
          await fetch(`https://${host}/uploads/form/v2/${PORTAL_ID}/${FORM_ID}`, { method: 'POST', mode: 'no-cors', body });
          break;
        } catch (err) {
          console.error('Resume upload error:', err);
        }
      }
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const pageStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #fff7e8 0%, #fbf6f1 50%, #eaf6f7 100%)', padding: '24px 16px', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif' };

  if (submitted) {
    return (
      <>
        <Head>
          <title>Application received | Revfinery Talent Network</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 28px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '72px', height: '72px', margin: '0 auto 20px', borderRadius: '50%', backgroundColor: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle style={{ width: '36px', height: '36px', color: ACCENT_TEXT }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px', color: '#0e2a2d' }}>Application received</h1>
            <p style={{ color: '#4c5f62', margin: '0 0 24px', lineHeight: '1.6' }}>
              Thanks for applying{role ? ` for ${role}` : ''}. We review applications every week and will email you about next steps.
            </p>
            <a href="/roles/" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#f25025', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', marginBottom: '12px' }}>See open roles</a>
            <br />
            <a href="https://www.revfinery.com/talent-network" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#0c6b73', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>Back to Talent Network</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Apply to the Cohort | Revfinery Talent Network</title>
        <meta name="description" content="For students, new graduates and career changers with under 3 years in sales." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://cdn.prod.website-files.com/68854e916991f33c6c47cd8c/69041aa4d9f017ce0c6842d8_ChatGPT%20Image%20Oct%2030%2C%202025%2C%2010_10_20%20PM.png" />
      </Head>

      <div style={pageStyle}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <a href="/roles/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4c5f62', textDecoration: 'none', fontSize: '14px', marginBottom: '16px' }}>
              <ArrowLeft size={16} />
              Back to open roles
            </a>
            <div>
              <span style={{ display: 'inline-block', backgroundColor: ACCENT, color: ACCENT_TEXT, padding: '6px 14px', borderRadius: '20px', marginBottom: '12px', fontWeight: '700', fontSize: '13px' }}>{LEVEL} level</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0e2a2d', margin: '0 0 8px' }}>Apply to the Cohort</h1>
            <p style={{ color: '#4c5f62', margin: '0' }}>For students, new graduates and career changers with under 3 years in sales.</p>
            {role && (
              <p style={{ display: 'inline-block', margin: '14px 0 0', padding: '8px 14px', backgroundColor: '#eaf6f7', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: '#0c6b73' }}>
                You're applying for: {role}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }} aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ flex: 1, height: '5px', borderRadius: '3px', backgroundColor: n <= step ? ACCENT : '#e5e7eb' }} />
            ))}
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '28px 22px' }}>

            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px', color: '#0e2a2d' }}>About you</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <label htmlFor="firstName" style={labelStyle}>First name *</label>
                    <input id="firstName" type="text" autoComplete="given-name" value={f.firstName} onChange={(e) => set('firstName', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label htmlFor="lastName" style={labelStyle}>Last name *</label>
                    <input id="lastName" type="text" autoComplete="family-name" value={f.lastName} onChange={(e) => set('lastName', e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div style={groupStyle}>
                  <label htmlFor="email" style={labelStyle}>Email *</label>
                  <input id="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} style={inputStyle} />
                </div>
                <div style={groupStyle}>
                  <label htmlFor="phone" style={labelStyle}>Phone *</label>
                  <input id="phone" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} style={inputStyle} />
                </div>
                <div style={groupStyle}>
                  <label htmlFor="linkedin" style={labelStyle}>LinkedIn URL{LINKEDIN_REQUIRED ? ' *' : ''}</label>
                  <input id="linkedin" type="url" value={f.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="state" style={labelStyle}>State *</label>
                  <select id="state" value={f.state} onChange={(e) => set('state', e.target.value)} style={inputStyle}>
                    <option value="">Choose your state</option>
                    {STATES.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px', color: '#0e2a2d' }}>Your experience</h2>
                <div style={groupStyle}>
                  <label htmlFor="school" style={labelStyle}>School *</label>
                  <input id="school" type="text" value={f.school} onChange={(e) => set('school', e.target.value)} placeholder="" style={inputStyle} />
                  <p style={hintStyle}>Write None if you did not attend one.</p>
                </div>
                <div style={groupStyle}>
                  <span style={labelStyle}>Graduation month and year</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select aria-label="Graduation month" value={f.gradMonth} onChange={(e) => set('gradMonth', e.target.value)} style={inputStyle}>
                      <option value="">Month</option>
                      {MONTHS.map((name, index) => <option key={name} value={String(index + 1).padStart(2, '0')}>{name}</option>)}
                    </select>
                    <select aria-label="Graduation year" value={f.gradYear} onChange={(e) => set('gradYear', e.target.value)} style={inputStyle}>
                      <option value="">Year</option>
                      {GRAD_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <p style={hintStyle}>Leave blank if this doesn't apply to you.</p>
                </div>
                <div style={groupStyle}>
                  <label htmlFor="recentJob" style={labelStyle}>Most recent job or internship *</label>
                  <input id="recentJob" type="text" value={f.recentJob} onChange={(e) => set('recentJob', e.target.value)} placeholder="Title and employer" style={inputStyle} />
                </div>
                <div style={groupStyle}>
                  <label htmlFor="years" style={labelStyle}>Years of sales or customer-facing experience *</label>
                  <input id="years" type="text" inputMode="decimal" value={f.years} onChange={(e) => set('years', onlyNumber(e.target.value))} placeholder="For example, 1" style={inputStyle} />
                  <p style={hintStyle}>Enter 0 if you have none yet.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px', color: '#0e2a2d' }}>Availability and resume</h2>
                <div style={groupStyle}>
                  <label htmlFor="hours" style={labelStyle}>Hours you can work a week *</label>
                  <input id="hours" type="text" inputMode="numeric" value={f.hours} onChange={(e) => set('hours', onlyNumber(e.target.value))} placeholder="For example, 20" style={inputStyle} />
                  {roleHours && <p style={hintStyle}>This role needs about {roleHours} hours a week.</p>}
                </div>
                <div style={groupStyle}>
                  <span style={labelStyle}>When can you work? Choose all that apply *</span>
                  <Chips options={TIME_BLOCKS} selected={f.timeBlocks} onToggle={(value) => toggle('timeBlocks', value)} />
                </div>
                <div style={groupStyle}>
                  <span style={labelStyle}>Work you want. Choose all that apply *</span>
                  <Chips options={WORK_OPTIONS} selected={f.workInterests} onToggle={(value) => toggle('workInterests', value)} />
                </div>
                <div>
                  <label htmlFor="resume" style={labelStyle}>Resume *</label>
                  <input id="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={chooseResume} style={{ ...inputStyle, padding: '12px' }} />
                  <p style={hintStyle}>{resume ? `Selected: ${resume.name}` : `PDF or Word, up to ${MAX_RESUME_MB} MB.`}</p>
                  {resumeError && <p role="alert" style={{ ...hintStyle, color: '#b3261e', fontWeight: '600' }}>{resumeError}</p>}
                </div>
              </div>
            )}

            {error && <p role="alert" style={{ margin: '20px 0 0', padding: '12px 14px', backgroundColor: '#fdecea', color: '#b3261e', borderRadius: '12px', fontSize: '14px', fontWeight: '600' }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #eaf6f7' }}>
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                disabled={step === 1}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: 'transparent', border: 'none', color: step === 1 ? '#ccc' : '#4c5f62', cursor: step === 1 ? 'default' : 'pointer', fontWeight: '600', fontSize: '15px', fontFamily: 'inherit' }}
              >
                <ArrowLeft style={{ width: '18px', height: '18px' }} />
                Back
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev + 1)}
                  disabled={!canProceed()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 26px', backgroundColor: canProceed() ? ACCENT : '#ccc', color: canProceed() ? ACCENT_TEXT : 'white', border: 'none', borderRadius: '12px', cursor: canProceed() ? 'pointer' : 'default', fontWeight: '700', fontSize: '15px', fontFamily: 'inherit' }}
                >
                  Continue
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canProceed() || submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 26px', backgroundColor: canProceed() && !submitting ? '#0c6b73' : '#ccc', color: 'white', border: 'none', borderRadius: '12px', cursor: canProceed() && !submitting ? 'pointer' : 'default', fontWeight: '700', fontSize: '15px', fontFamily: 'inherit' }}
                >
                  {submitting ? 'Sending...' : 'Submit application'}
                  {!submitting && <CheckCircle style={{ width: '18px', height: '18px' }} />}
                </button>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7d80', marginTop: '20px' }}>Fields marked * are required.</p>
        </div>
      </div>
    </>
  );
}

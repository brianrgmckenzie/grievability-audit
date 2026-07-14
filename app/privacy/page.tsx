export const metadata = {
  title: 'Privacy Policy — Grievability Audit',
};

const section = (title: string, body: React.ReactNode) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber)', margin: '0 0 12px' }}>
      {title}
    </h2>
    <div style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--secondary)' }}>
      {body}
    </div>
  </div>
);

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '620px', padding: '64px 24px 96px' }}>

        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '20px' }}>
          Reframe Concepts
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(32px, 8vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.015em', color: 'var(--cream)', margin: '0 0 12px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', fontFamily: "'Roboto', sans-serif", margin: '0 0 52px' }}>
          Grievability Audit · Last updated July 2026
        </p>

        {section('Who we are', (
          <p style={{ margin: 0 }}>
            Reframe Concepts is an impact consulting firm based in Kelowna, BC, Canada. We operate the Grievability Audit at grievabilityaudit.com. Questions about this policy can be sent to{' '}
            <a href="mailto:hello@reframeconcepts.com" style={{ color: 'var(--amber)', textDecoration: 'none' }}>
              hello@reframeconcepts.com
            </a>.
          </p>
        ))}

        {section('What we collect', (
          <>
            <p style={{ margin: '0 0 12px' }}>When you complete the audit, we collect:</p>
            <ul style={{ margin: '0 0 12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Your name and email address</li>
              <li>Your organization name</li>
              <li>Your responses to the 15 self-assessment statements (numeric scores, 1–5)</li>
              <li>An AI-generated interpretation of your results, created using Anthropic's Claude model</li>
            </ul>
            <p style={{ margin: 0 }}>We do not collect payment information, government IDs, or any data beyond what is listed above.</p>
          </>
        ))}

        {section('Why we collect it', (
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>To generate and display your personalized Grievability Score report</li>
            <li>To email you a copy of your results</li>
            <li>To enable a Reframe Concepts strategist to follow up with you about our services, if relevant</li>
          </ul>
        ))}

        {section('How it is stored', (
          <>
            <p style={{ margin: '0 0 12px' }}>Your data is stored in a secured cloud database (Supabase) accessible only to Reframe Concepts staff. It is transmitted only to the following service providers, solely for the purposes described above:</p>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong style={{ color: 'var(--cream)' }}>Supabase</strong> — encrypted database storage</li>
              <li><strong style={{ color: 'var(--cream)' }}>Resend</strong> — transactional email delivery</li>
              <li><strong style={{ color: 'var(--cream)' }}>Anthropic</strong> — AI narrative generation (your data is processed to generate your report and is not used to train AI models)</li>
            </ul>
          </>
        ))}

        {section('How long we keep it', (
          <p style={{ margin: 0 }}>
            We retain your submission until you request deletion. We do not sell, rent, or share your data with any third party for marketing purposes.
          </p>
        ))}

        {section('Your rights', (
          <>
            <p style={{ margin: '0 0 12px' }}>You may at any time:</p>
            <ul style={{ margin: '0 0 12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Request a copy of the data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your submission and all associated data</li>
            </ul>
            <p style={{ margin: 0 }}>
              To exercise any of these rights, email{' '}
              <a href="mailto:hello@reframeconcepts.com" style={{ color: 'var(--amber)', textDecoration: 'none' }}>
                hello@reframeconcepts.com
              </a>{' '}
              with your name and the email address you used to submit the audit. We will respond within 30 days.
            </p>
          </>
        ))}

        {section('Legal basis', (
          <p style={{ margin: 0 }}>
            This policy is written in compliance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA). If you are located in the European Union, our lawful basis for processing is your implied consent provided at the time of form submission, with the right to withdraw at any time by contacting us.
          </p>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', marginTop: '8px' }}>
          <a
            href="/"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
          >
            ← Back to audit
          </a>
        </div>
      </div>
    </div>
  );
}

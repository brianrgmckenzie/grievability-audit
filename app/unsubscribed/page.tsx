export const metadata = {
  title: 'Unsubscribed — Grievability Audit',
};

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const invalid = status === 'invalid';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '520px', padding: '96px 24px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            marginBottom: '20px',
          }}
        >
          Reframe Concepts
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(28px, 7vw, 40px)',
            lineHeight: 1.1,
            color: 'var(--cream)',
            margin: '0 0 16px',
          }}
        >
          {invalid ? 'That link isn’t valid' : 'You’re unsubscribed'}
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--secondary)', margin: 0 }}>
          {invalid
            ? 'We couldn’t find a subscription matching that link. If you’re still receiving emails you’d like to stop, reply to any of them and we’ll take care of it.'
            : 'You won’t receive any further emails in this sequence. If this was a mistake, reply to any email you already received from us.'}
        </p>
      </div>
    </div>
  );
}

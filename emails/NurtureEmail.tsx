import { Html, Head, Body, Container, Section, Text, Link } from '@react-email/components';

interface Props {
  org: string;
  paragraphs: string[];
  ctaUrl: string;
  ctaLabel: string;
  unsubscribeUrl: string;
  recipientEmail: string;
}

const c = {
  bg: '#0A1628',
  amber: '#5B9BD5',
  ink: '#080E1C',
  emailBg: '#EEF3FA',
  emailText: '#0A1628',
  emailSecondary: '#4A6483',
  emailBorder: '#CBD9EA',
};

const mono = "'Roboto', sans-serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export default function NurtureEmail({
  org,
  paragraphs,
  ctaUrl,
  ctaLabel,
  unsubscribeUrl,
  recipientEmail,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ background: '#E4ECF6', margin: 0, padding: 0, fontFamily: sans }}>
        <Container
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            background: c.emailBg,
          }}
        >
          <Section style={{ padding: '32px 32px 0' }}>
            <Text
              style={{
                fontFamily: mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: c.amber,
                margin: '0 0 28px',
              }}
            >
              {org} · Grievability Audit
            </Text>

            {paragraphs.map((para, i) => (
              <Text
                key={i}
                style={{
                  fontSize: '15px',
                  lineHeight: '1.65',
                  color: c.emailText,
                  margin: '0 0 16px',
                }}
              >
                {para}
              </Text>
            ))}
          </Section>

          <Section style={{ padding: '12px 32px 32px' }}>
            <Link
              href={ctaUrl}
              style={{
                display: 'inline-block',
                fontFamily: sans,
                fontSize: '15px',
                fontWeight: 600,
                color: c.ink,
                background: c.amber,
                borderRadius: '999px',
                padding: '14px 28px',
                textDecoration: 'none',
              }}
            >
              {ctaLabel}
            </Link>

            <Text
              style={{
                fontSize: '12px',
                lineHeight: '1.5',
                color: c.emailSecondary,
                margin: '24px 0 0',
                borderTop: `1px solid ${c.emailBorder}`,
                paddingTop: '16px',
              }}
            >
              Reframe Concepts · Kelowna, BC. You are receiving this because you completed the
              Grievability Audit at {recipientEmail}.{' '}
              <Link href={unsubscribeUrl} style={{ color: c.emailSecondary, textDecoration: 'underline' }}>
                Unsubscribe
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

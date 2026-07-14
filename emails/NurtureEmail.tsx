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
  bg: '#1E1812',
  amber: '#E0943A',
  ink: '#1C1A17',
  emailBg: '#F2EAD8',
  emailText: '#1C1A17',
  emailSecondary: '#5C4E36',
  emailBorder: '#D4C8AE',
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
      <Body style={{ background: '#ede6d4', margin: 0, padding: 0, fontFamily: sans }}>
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

import { Html, Head, Body, Container, Section, Text, Hr } from '@react-email/components';

interface BreakdownItem {
  eyebrow: string;
  score: number;
  scoreStr: string;
}

interface Props {
  visitorEmail: string;
  name: string;
  org: string;
  finalScore: number;
  bandName: string;
  breakdown: BreakdownItem[];
  capturedAt: string;
}

const mono = "'Roboto', sans-serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const c = {
  bg: '#1E1812',
  card: '#2A2118',
  border: '#3D3020',
  amber: '#E0943A',
  gold: '#F5B040',
  cream: '#F2EAD8',
  secondary: '#B8AE9C',
  muted: '#8C6E42',
};

export default function LeadEmail({
  visitorEmail,
  name,
  org,
  finalScore,
  bandName,
  breakdown,
  capturedAt,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ background: '#120E09', margin: 0, padding: '24px', fontFamily: sans }}>
        <Container
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Section
            style={{
              background: c.bg,
              borderBottom: `1px solid ${c.border}`,
              padding: '16px 24px',
            }}
          >
            <Text
              style={{
                fontFamily: mono,
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: c.muted,
                margin: '0 0 2px',
              }}
            >
              System notification
            </Text>
            <Text
              style={{
                fontFamily: sans,
                fontSize: '18px',
                fontWeight: 600,
                color: c.cream,
                margin: '0',
              }}
            >
              New Grievability Audit lead
            </Text>
          </Section>

          {/* Lead data */}
          <Section style={{ padding: '20px 24px' }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: '12.5px',
                lineHeight: '1.9',
                color: c.secondary,
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: '12px',
                padding: '16px 18px',
              }}
            >
              <Text style={{ margin: '0', color: c.muted, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                To: hello@reframeconcepts.com
              </Text>
              <Text style={{ margin: '4px 0 0', fontFamily: mono, fontSize: '12.5px', color: c.secondary }}>
                <span style={{ color: c.muted }}>name</span>{'  '}{name}
              </Text>
              <Text style={{ margin: '0', fontFamily: mono, fontSize: '12.5px', color: c.secondary }}>
                <span style={{ color: c.muted }}>organization</span>{'  '}{org}
              </Text>
              <Text style={{ margin: '0', fontFamily: mono, fontSize: '12.5px', color: c.secondary }}>
                <span style={{ color: c.muted }}>email</span>{'  '}{visitorEmail}
              </Text>
              <Text style={{ margin: '0', fontFamily: mono, fontSize: '12.5px', color: c.secondary }}>
                <span style={{ color: c.muted }}>overall_score</span>{'  '}
                <span style={{ color: c.gold }}>{finalScore}</span> / 100
              </Text>
              <Text style={{ margin: '0', fontFamily: mono, fontSize: '12.5px', color: c.secondary }}>
                <span style={{ color: c.muted }}>band</span>{'  '}{bandName}
              </Text>
              <Text style={{ margin: '0', fontFamily: mono, fontSize: '12.5px', color: c.secondary }}>
                <span style={{ color: c.muted }}>captured_at</span>{'  '}{capturedAt}
              </Text>
            </div>
          </Section>

          <Hr style={{ borderColor: c.border, margin: '0 24px' }} />

          {/* Dimension breakdown */}
          <Section style={{ padding: '16px 24px 20px' }}>
            <Text
              style={{
                fontFamily: mono,
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: c.muted,
                margin: '0 0 12px',
              }}
            >
              Dimension scores
            </Text>

            {breakdown.map((bd, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex' as const, justifyContent: 'space-between' as const }}>
                  <Text
                    style={{
                      fontFamily: mono,
                      fontSize: '11px',
                      color: c.secondary,
                      margin: '0',
                    }}
                  >
                    {bd.eyebrow}
                  </Text>
                  <Text
                    style={{ fontFamily: mono, fontSize: '11px', color: c.amber, margin: '0' }}
                  >
                    {bd.scoreStr}
                  </Text>
                </div>
              </div>
            ))}
          </Section>

          <Hr style={{ borderColor: c.border, margin: '0 24px' }} />

          <Section style={{ padding: '16px 24px 20px' }}>
            <Text
              style={{
                fontSize: '13.5px',
                lineHeight: '1.55',
                color: c.secondary,
                margin: '0',
              }}
            >
              A Reframe strategist should follow up personally. Reply to this email to reach the
              visitor at {visitorEmail}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Font,
} from '@react-email/components';

interface BreakdownItem {
  eyebrow: string;
  score: number;
  scoreStr: string;
  rec: string;
}

interface LowestItem {
  eyebrow: string;
  scoreStr: string;
  rec: string;
}

interface RadarData {
  grid100: string;
  grid66: string;
  grid33: string;
  data: string;
  spokes: { x: string; y: string }[];
}

interface Props {
  name: string;
  org: string;
  email: string;
  finalScore: number;
  bandName: string;
  bandDesc: string;
  narrative: string;
  lowest: LowestItem[];
  breakdown: BreakdownItem[];
  radar: RadarData;
  boardAuditUrl: string;
}

const c = {
  bg: '#0A1628',
  card: '#112038',
  border: '#1C3456',
  amber: '#5B9BD5',
  gold: '#F2C930',
  cream: '#DDE8F5',
  secondary: '#6E94BA',
  muted: '#6A91BC',
  ink: '#080E1C',
  emailBg: '#EEF3FA',
  emailCard: '#E3EBF5',
  emailBorder: '#CBD9EA',
  emailText: '#0A1628',
  emailSecondary: '#4A6483',
};

const mono = "'Roboto', sans-serif";
const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export default function ResultsEmail({
  name,
  org,
  email,
  finalScore,
  bandName,
  bandDesc,
  narrative,
  lowest,
  breakdown,
  radar,
  boardAuditUrl,
}: Props) {
  const firstName = name.split(' ')[0];
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/ibmplexmono/v19/-F6pfjptAgt5VM-kVkqdyU8n1iIq131nj-otFQ.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={{ background: '#E4ECF6', margin: 0, padding: 0, fontFamily: sans }}>
        <Container
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            background: c.emailBg,
            borderRadius: '0',
          }}
        >
          {/* Header */}
          <Section style={{ padding: '28px 32px 0' }}>
            <Text
              style={{
                fontFamily: mono,
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: c.amber,
                margin: '0 0 24px',
              }}
            >
              {org} · Grievability Report
            </Text>
            <Text
              style={{
                fontFamily: sans,
                fontSize: '15px',
                lineHeight: '1.6',
                color: c.emailText,
                margin: '0 0 24px',
              }}
            >
              {firstName}, thank you for sitting with the hard question. Here is your read.
            </Text>
          </Section>

          {/* Score card */}
          <Section style={{ padding: '0 32px' }}>
            <div
              style={{
                background: c.bg,
                borderRadius: '16px',
                padding: '22px',
                marginBottom: '22px',
                display: 'flex' as const,
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 160 160">
                  <polygon points={radar.grid100} fill="none" stroke={c.border} strokeWidth="1" />
                  <polygon points={radar.grid66} fill="none" stroke={c.border} strokeWidth="0.75" />
                  <polygon points={radar.grid33} fill="none" stroke={c.border} strokeWidth="0.75" />
                  {radar.spokes.map((sp, i) => (
                    <line key={i} x1="80" y1="80" x2={sp.x} y2={sp.y} stroke={c.border} strokeWidth="0.75" />
                  ))}
                  <polygon points={radar.data} fill={c.amber} fillOpacity="0.32" stroke={c.gold} strokeWidth="2" />
                </svg>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <Text
                  style={{
                    fontFamily: mono,
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase' as const,
                    color: c.secondary,
                    margin: '0 0 6px',
                  }}
                >
                  Grievability Score
                </Text>
                <Text
                  style={{
                    fontFamily: serif,
                    fontSize: '52px',
                    fontWeight: 500,
                    lineHeight: '1',
                    color: c.cream,
                    margin: '0',
                  }}
                >
                  {finalScore}
                  <span style={{ fontSize: '20px', color: c.muted }}>/100</span>
                </Text>
              </div>
            </div>
          </Section>

          {/* Band */}
          <Section style={{ padding: '0 32px 22px' }}>
            <div
              style={{
                borderLeft: `3px solid ${c.amber}`,
                paddingLeft: '16px',
                marginBottom: '26px',
              }}
            >
              <Text
                style={{
                  fontFamily: serif,
                  fontSize: '22px',
                  fontWeight: 500,
                  color: c.emailText,
                  margin: '0 0 4px',
                }}
              >
                {bandName}
              </Text>
              <Text
                style={{
                  fontSize: '14.5px',
                  lineHeight: '1.55',
                  color: c.emailSecondary,
                  margin: '0',
                }}
              >
                {bandDesc}
              </Text>
            </div>

            {/* Fable narrative */}
            {narrative.split('\n\n').map((para, i) => (
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

          <Hr style={{ borderColor: c.emailBorder, margin: '0 32px' }} />

          {/* Two things to fix */}
          <Section style={{ padding: '24px 32px 0' }}>
            <Text
              style={{
                fontFamily: mono,
                fontSize: '10.5px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: c.emailSecondary,
                margin: '0 0 14px',
              }}
            >
              The two things to fix first
            </Text>

            {lowest.map((lo, i) => (
              <div
                key={i}
                style={{
                  background: c.emailCard,
                  border: `1px solid ${c.emailBorder}`,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex' as const,
                    justifyContent: 'space-between' as const,
                    marginBottom: '8px',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: serif,
                      fontSize: '17px',
                      fontWeight: 500,
                      color: c.emailText,
                      margin: '0',
                    }}
                  >
                    {lo.eyebrow}
                  </Text>
                  <Text
                    style={{
                      fontFamily: mono,
                      fontSize: '13px',
                      color: c.amber,
                      margin: '0',
                    }}
                  >
                    {lo.scoreStr}
                  </Text>
                </div>
                <Text
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.55',
                    color: c.emailSecondary,
                    margin: '0',
                  }}
                >
                  {lo.rec}
                </Text>
              </div>
            ))}
          </Section>

          <Hr style={{ borderColor: c.emailBorder, margin: '24px 32px 0' }} />

          {/* Full breakdown */}
          <Section style={{ padding: '20px 32px 0' }}>
            <Text
              style={{
                fontFamily: mono,
                fontSize: '10.5px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: c.emailSecondary,
                margin: '0 0 4px',
              }}
            >
              Full breakdown
            </Text>

            {breakdown.map((bd, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 0',
                  borderBottom: `1px solid ${c.emailBorder}`,
                }}
              >
                <div
                  style={{
                    display: 'flex' as const,
                    justifyContent: 'space-between' as const,
                    marginBottom: '8px',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: mono,
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase' as const,
                      color: c.emailText,
                      margin: '0',
                    }}
                  >
                    {bd.eyebrow}
                  </Text>
                  <Text
                    style={{ fontFamily: mono, fontSize: '13px', color: c.amber, margin: '0' }}
                  >
                    {bd.scoreStr}
                  </Text>
                </div>
                {/* Progress bar via table trick for email clients */}
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ width: '100%', marginBottom: '8px' }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: '5px',
                          background: c.emailBorder,
                          borderRadius: '999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '5px',
                            width: `${bd.score}%`,
                            background: c.amber,
                            borderRadius: '999px',
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Text
                  style={{
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    color: c.emailSecondary,
                    margin: '0',
                  }}
                >
                  {bd.rec}
                </Text>
              </div>
            ))}
          </Section>

          {/* CTA */}
          <Section style={{ padding: '28px 32px 32px' }}>
            <Link
              href={boardAuditUrl}
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
              Book the live board audit
            </Link>

            <Text
              style={{
                fontSize: '12px',
                lineHeight: '1.5',
                color: c.emailSecondary,
                margin: '24px 0 0',
              }}
            >
              You are receiving this because you completed the Grievability Audit at{' '}
              {email}. Unsubscribe anytime.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

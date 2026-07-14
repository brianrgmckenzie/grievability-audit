import { Html, Head, Body, Container, Text, Link } from '@react-email/components';
import type { BodyLine } from '@/lib/sequence';

interface Props {
  firstName: string;
  lines: BodyLine[];
  trailingLink?: string;
  unsubscribeUrl: string;
  recipientEmail: string;
}

const text = { fontSize: '15px', lineHeight: '1.65', color: '#1a1a1a', margin: '0 0 18px' };

export default function NurtureEmail({ firstName, lines, trailingLink, unsubscribeUrl, recipientEmail }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ background: '#ffffff', margin: 0, padding: 0, fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
          <Text style={text}>Hi {firstName},</Text>

          {lines.map((line, i) => (
            <Text key={i} style={text}>
              {line.text}
              {line.href && (
                <>
                  {line.text ? ' ' : ''}
                  <Link href={line.href} style={{ color: '#1a56db' }}>
                    {line.href}
                  </Link>
                </>
              )}
            </Text>
          ))}

          <Text style={{ ...text, marginTop: '24px' }}>Brian</Text>

          {trailingLink && (
            <Text style={text}>
              <Link href={trailingLink} style={{ color: '#1a56db' }}>
                {trailingLink}
              </Link>
            </Text>
          )}

          <Text style={{ fontSize: '11px', lineHeight: '1.5', color: '#888', marginTop: '32px' }}>
            You are receiving this because you completed the Grievability Audit at {recipientEmail}.{' '}
            <Link href={unsubscribeUrl} style={{ color: '#888' }}>
              Unsubscribe
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

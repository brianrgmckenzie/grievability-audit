import { Html, Head, Body, Container, Text, Link } from '@react-email/components';
import { DIMS } from '@/lib/scoring';

interface Props {
  name: string;
  org: string;
  email: string;
  scores: number[];
  finalScore: number;
  bandName: string;
  narrative: string;
  boardAuditUrl: string;
  unsubscribeUrl: string;
}

const BAND_LINES: Record<string, string> = {
  'Load bearing':
    'Remove this organization and a visible hole opens. The community would grieve, and soon. The work now is not to prove relevance but to protect it and compound it.',
  'Held in affection':
    'Loved, but not yet load bearing. Real warmth around replaceable function. Tighten the overlap between what you offer and what your community needs, and the affection becomes need.',
  'Quietly at risk':
    'A few would grieve. Most would adjust by Friday. The gap is nameable, and nameable means closeable. This is workable ground.',
  'Disappearing in plain sight':
    'The honest news is that almost no one would notice yet. The hopeful news is that this is a position, not a fate. This is exactly where the work begins.',
};

const DIM_QUESTIONS = [
  'do you still know what your community would miss',
  'do you meet a need they feel today',
  'does your absence leave a hole no one else can fill',
  'is there a future vivid enough to mourn',
  'are you reliably, sustainably there',
];

const DIM_MOVES = [
  'Restart a real listening program. Put leadership back in front of the people you serve before another decision is made.',
  'Re-run your needs assessment against today, not the founding. Confirm the ache you answer is still being felt.',
  'Tighten the overlap. Narrow your offer until it meets a felt need so exactly that you become load bearing.',
  'Declare a future vivid enough to mourn. Give people something they would feel robbed of.',
  'Move off the grant treadmill and harden governance, so your presence does not depend on any one person.',
];

const text = { fontSize: '15px', lineHeight: '1.65', color: '#1a1a1a', margin: '0 0 18px' };
const small = { fontSize: '13px', lineHeight: '1.6', color: '#444', margin: '0 0 6px' };

export default function ResultsEmail({
  name,
  org,
  email,
  scores,
  finalScore,
  bandName,
  narrative,
  boardAuditUrl,
  unsubscribeUrl,
}: Props) {
  const firstName = name.split(' ')[0];
  const lowestIdx = [0, 1, 2, 3, 4].sort((a, b) => scores[a] - scores[b]).slice(0, 2) as [number, number];

  return (
    <Html>
      <Head />
      <Body style={{ background: '#ffffff', margin: 0, padding: 0, fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            You asked a question most leaders avoid: if {org} disappeared, would anyone grieve it? Here is your
            honest answer, as of today.
          </Text>

          <Text style={{ ...text, fontWeight: 700 }}>
            Your Grievability Score: {finalScore} out of 100 — {bandName}
          </Text>

          <Text style={text}>{BAND_LINES[bandName]}</Text>

          <Text style={{ ...text, fontWeight: 700, marginBottom: '10px' }}>The five dimensions</Text>
          {DIMS.map((d, i) => (
            <Text key={i} style={small}>
              {d.name}, {DIM_QUESTIONS[i]}: {scores[i]}
            </Text>
          ))}

          <Text style={{ ...text, marginTop: '10px' }}>
            One note on reading these. Indispensability is weighted double in your overall score, because it is the
            core of the whole question. An organization can score well everywhere else and still be replaceable. If
            that number is your lowest, treat it as the headline even if the total looks healthy.
          </Text>

          <Text style={{ ...text, fontWeight: 700, marginBottom: '10px' }}>Where to start</Text>
          <Text style={text}>
            Your two lowest dimensions are {DIMS[lowestIdx[0]].name} and {DIMS[lowestIdx[1]].name}. Each comes with a
            first move:
          </Text>
          <Text style={small}>
            <strong>{DIMS[lowestIdx[0]].name}:</strong> {DIM_MOVES[lowestIdx[0]]}
          </Text>
          <Text style={{ ...small, marginBottom: '18px' }}>
            <strong>{DIMS[lowestIdx[1]].name}:</strong> {DIM_MOVES[lowestIdx[1]]}
          </Text>

          {narrative.split('\n\n').filter(Boolean).map((para, i) => (
            <Text key={i} style={text}>
              {para}
            </Text>
          ))}

          <Text style={{ ...text, fontWeight: 700, marginBottom: '10px' }}>What this is, and is not</Text>
          <Text style={text}>
            This score is a mirror, not a judgement. It reflects one person&rsquo;s honest answers on one day. The
            most useful thing you can do with it is disagree with it out loud, with your board, in the same room.
            Where your answers and theirs diverge is usually where the real finding lives.
          </Text>

          <Text style={text}>
            If you want to run exactly that conversation, we facilitate a live version of this audit with full
            boards. I will send a bit more about that in the coming days, or you can skip ahead:{' '}
            <Link href={boardAuditUrl} style={{ color: '#1a56db' }}>
              {boardAuditUrl}
            </Link>
          </Text>

          <Text style={text}>Either way, you now know something most organizations never ask.</Text>

          <Text style={{ ...text, marginTop: '24px' }}>
            Brian McKenzie
            <br />
            Reframe Concepts
            <br />
            We move at the speed of trust.
          </Text>

          <Text style={{ fontSize: '11px', lineHeight: '1.5', color: '#888', marginTop: '32px' }}>
            You are receiving this because you completed the Grievability Audit at {email}.{' '}
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

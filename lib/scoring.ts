export interface Dim {
  num: string;
  name: string;
  tie: string;
  desc: string;
  core?: boolean;
  statements: readonly string[];
}

export const DIMS: Dim[] = [
  {
    num: '01',
    name: 'Attunement',
    tie: 'Listening Program',
    desc: 'How closely you are still listening to the people you serve.',
    statements: [
      'We are in living dialogue with the people we serve, not only our members and donors.',
      'We can name the needs our community feels right now, in their own words.',
      'Our leadership regularly hears from voices outside the institution.',
    ],
  },
  {
    num: '02',
    name: 'Relevance',
    tie: 'Needs Assessment',
    desc: 'Whether the need you exist to meet is present tense, not historical.',
    statements: [
      'The need we exist to meet is present and current, not historical or nostalgic.',
      "Our core work has adapted as the community's needs have shifted.",
      'If we vanished, a real and present gap would open, not just a sentimental one.',
    ],
  },
  {
    num: '03',
    name: 'Indispensability',
    tie: 'Functional Sweet Spot',
    core: true,
    desc: 'How tightly what you offer overlaps what your community actually needs.',
    statements: [
      'What we offer and what our community needs overlap tightly and deliberately.',
      'We are load-bearing in our community’s web of support, not a nice-to-have.',
      'No one else could easily replace the specific thing we do.',
    ],
  },
  {
    num: '04',
    name: 'Story',
    tie: 'Social Impact Vision',
    desc: 'Whether the future you are building is declared, specific, and repeatable.',
    statements: [
      'We have clearly declared the future we are working to build.',
      'That vision is specific enough that people would feel robbed if it never arrived.',
      'People outside our walls can repeat our story back to us.',
    ],
  },
  {
    num: '05',
    name: 'Durability',
    tie: 'Operational Delivery',
    desc: 'Whether you can deliver, and keep delivering, over time.',
    statements: [
      'We are financially resilient, not living grant to grant or appeal to appeal.',
      'Our governance is healthy: clear roles, real succession, not dependent on one person.',
      'We deliver consistently and dependably over time.',
    ],
  },
];

export const RECS = [
  'Build a standing listening rhythm. Put leadership in the same room as the people you serve on a schedule, not by accident, and write down what you hear.',
  'Re-audit the need out loud. Ask whether the gap you fill is present tense, and let an honest answer reshape the work rather than defend it.',
  'Tighten the overlap. Name the one thing only you can do, and pour attention and resources there until your absence would genuinely fracture something.',
  'Declare the future plainly. Make the vision specific enough that its absence would feel like a theft, then teach it until others can repeat it.',
  'Reduce single points of failure. Diversify funding and clarify succession so the mission can outlive any one person, budget, or season.',
];

export type Answers = Record<string, number>; // "dimIndex-stmtIndex" -> 1..5

export function dimScore(answers: Answers, i: number): number {
  const vals = [0, 1, 2].map((s) => answers[`${i}-${s}`]);
  if (vals.some((v) => !v)) return 0;
  const raw = vals.reduce((a, b) => a + b, 0); // 3..15
  return Math.round(((raw - 3) / 12) * 100);
}

export function allScores(answers: Answers): number[] {
  return [0, 1, 2, 3, 4].map((i) => dimScore(answers, i));
}

export function finalScore(answers: Answers): number {
  const s = allScores(answers);
  return Math.round((s[0] + s[1] + 2 * s[2] + s[3] + s[4]) / 6);
}

export function band(f: number): { name: string; desc: string } {
  if (f >= 82)
    return {
      name: 'Load bearing',
      desc: 'Your absence would leave a visible hole. People would reorganize their lives around the gap you left.',
    };
  if (f >= 60)
    return {
      name: 'Held in affection',
      desc: 'You are loved, but replaceable. The warmth is real; the sweet spot needs tightening.',
    };
  if (f >= 38)
    return {
      name: 'Quietly at risk',
      desc: 'A few would grieve, most would adjust. This is closeable, and now is the time to close it.',
    };
  return {
    name: 'Disappearing in plain sight',
    desc: 'Almost no one would notice yet. That is not a verdict, it is where the work begins.',
  };
}

export function lowestTwo(answers: Answers) {
  const scores = allScores(answers);
  return [0, 1, 2, 3, 4]
    .map((i) => ({ i, s: scores[i] }))
    .sort((a, b) => a.s - b.s)
    .slice(0, 2)
    .map((o) => ({
      eyebrow: `${DIMS[o.i].num} ${DIMS[o.i].name}`,
      scoreStr: `${o.s} / 100`,
      rec: RECS[o.i],
    }));
}

export function breakdown(answers: Answers) {
  const scores = allScores(answers);
  return [0, 1, 2, 3, 4].map((i) => ({
    eyebrow: `${DIMS[i].num} ${DIMS[i].name}`,
    score: scores[i],
    scoreStr: `${scores[i]} / 100`,
    rec: RECS[i],
  }));
}

// Pentagon radar geometry
export function radarPoints(answers: Answers, scale?: number): string {
  const cx = 80,
    cy = 80,
    r = 62;
  const scores = allScores(answers);
  return [0, 1, 2, 3, 4]
    .map((i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const rad = r * (typeof scale === 'number' ? scale : scores[i] / 100);
      return `${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`;
    })
    .join(' ');
}

export function radarSpokes(): { x: string; y: string }[] {
  const cx = 80,
    cy = 80,
    r = 62;
  return [0, 1, 2, 3, 4].map((i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return {
      x: (cx + r * Math.cos(ang)).toFixed(1),
      y: (cy + r * Math.sin(ang)).toFixed(1),
    };
  });
}

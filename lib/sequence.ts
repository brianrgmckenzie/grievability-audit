import { DIMS, type Answers } from '@/lib/scoring';
import { BOARD_AUDIT_URL } from '@/lib/email';

export interface SequenceContext {
  name: string;
  org: string;
  answers: Answers;
  scores: number[];
  finalScore: number;
  bandName: string;
  bandDesc: string;
  lowestIdx: [number, number];
  lang: string;
}

export interface BodyLine {
  text: string;
  href?: string;
}

export interface SequenceSlot {
  step: number;
  dayOffset: number;
  angle: string;
  subject: (ctx: SequenceContext) => string;
  body: (ctx: SequenceContext) => BodyLine[];
  trailingLink?: (ctx: SequenceContext) => string;
}

const isHigherBand = (ctx: SequenceContext) =>
  ctx.bandName === 'Load bearing' || ctx.bandName === 'Held in affection';

export const SEQUENCE_SLOTS: SequenceSlot[] = [
  {
    step: 1,
    dayOffset: 1,
    angle: 'The pattern in your lowest score',
    subject: (ctx) => `One thing about your ${ctx.finalScore}`,
    body: (ctx) => [
      {
        text: 'Your report landed yesterday. Before it disappears into the folder where reports go, one observation worth pulling out of it.',
      },
      {
        text: `Your two lowest dimensions were ${DIMS[ctx.lowestIdx[0]].name} and ${DIMS[ctx.lowestIdx[1]].name}. In almost every audit we run, the lowest score is not the one the leadership was worried about. Boards tend to worry about money. The audit tends to find the erosion somewhere quieter, usually in how well the organization still hears the people outside its own walls.`,
      },
      {
        text: `Whether that pattern holds for ${ctx.org}, you would know better than I would. But it is worth one honest conversation at your next board meeting: does our lowest number surprise us, and if so, why did we not see it coming?`,
      },
      { text: 'No need to reply. More soon, and never much at once.' },
    ],
  },
  {
    step: 2,
    dayOffset: 4,
    angle: 'Case study: Trinity United',
    subject: () => `4.5 acres nobody was looking at`,
    body: () => [
      {
        text: 'Trinity United in Vernon had the problem most established congregations have. Faithful people, a good building, and a future that kept getting shorter every time the board did the math.',
      },
      { text: 'What they also had, and had mostly stopped seeing, was four and a half acres of land.' },
      {
        text: 'We spent time with the congregation first, then with the city and the province, mapping what the neighbourhood actually needed against what Trinity actually had. The answer that came back was housing: a plan for 250 mixed income homes, 161 of them supportive, on land that had been sitting under their feet the whole time. That work is now moving through the later planning stages with letters of intent in hand.',
      },
      {
        text: 'Their minister described the task before we started as impossibly daunting. That is the honest starting point for most boards. The land, the program, the trust your organization has built, these are usually worth far more than the balance sheet admits. The hard part is seeing your own assets after twenty years of walking past them.',
      },
      {
        text: 'If you have a version of this, a property, a program, a reputation that is doing less than it could, reply and tell me about it. I read every one of these.',
      },
    ],
  },
  {
    step: 3,
    dayOffset: 8,
    angle: 'The board audit pitch (band-tiered)',
    subject: (ctx) => `The next step for ${ctx.org}`,
    body: (ctx) => {
      const opening: BodyLine[] = isHigherBand(ctx)
        ? [
            {
              text: `A ${ctx.finalScore} is a genuinely strong result. Most organizations that take this audit do not score where you did.`,
            },
            {
              text: `The risk at your level is a quiet one: strong scores make boards comfortable, and comfortable boards stop tending the exact things that made them strong. Your ${DIMS[ctx.lowestIdx[0]].name} and ${DIMS[ctx.lowestIdx[1]].name} numbers are where that usually starts.`,
            },
          ]
        : [
            {
              text: `A ${ctx.finalScore} is not a comfortable number to receive. It is also not a prediction. It is a photograph of where things stand today, and every organization we have done our best work with started with a photograph they did not like.`,
            },
            {
              text: `The useful part of your result is its specificity: ${DIMS[ctx.lowestIdx[0]].name} and ${DIMS[ctx.lowestIdx[1]].name} are the two places to start, and starting in two places is a very different problem than the vague sense that everything needs fixing.`,
            },
          ];
      return [
        ...opening,
        {
          text: 'Here is what going deeper looks like. We run the audit live with your full board, ninety minutes, everyone scoring in the same room. Individual answers diverge in ways a single person filling out a form never reveals, and the conversation that happens inside those gaps is where the real finding usually is. You leave with a shared score, the assets we surfaced along the way, and a concrete plan for your two lowest dimensions.',
        },
        {
          text: 'Fixed fee. If you move into any larger engagement with us afterward, the full amount is credited against it.',
        },
        { text: 'Book a time here:', href: BOARD_AUDIT_URL },
        { text: 'Or just reply with questions. Either works.' },
      ];
    },
  },
  {
    step: 4,
    dayOffset: 14,
    angle: 'Industry stat',
    subject: () => `A third of them`,
    body: (ctx) => [
      {
        text: 'The Canadian Urban Institute published a number that has stayed with me: as many as 9,000 faith owned buildings in Canada, roughly a third of all of them, are at risk of closing within a decade. The civic value tied up in those spaces, the food programs, the childcare, the twelve step meetings, the cheap rehearsal rooms, comes to something like fifteen and a half billion dollars a year.',
      },
      {
        text: 'Almost none of those closures will be dramatic. They will be a quiet vote, a sign on a door, a listing. The neighbourhood will find out afterward what it was actually using the building for.',
      },
      {
        text: `I am not sending this to alarm you about ${ctx.org}. I am sending it because the organizations that end up on the right side of that statistic are the ones that started asking hard questions while they still had room to act, and the fact that you took this audit at all suggests you are one of them.`,
      },
      { text: 'The live board session is still open if you want it:', href: BOARD_AUDIT_URL },
    ],
  },
  {
    step: 5,
    dayOffset: 21,
    angle: 'The close',
    subject: () => `Last one from me`,
    body: () => [
      { text: 'This is the last scheduled email you will get from this sequence, so a quick honest close.' },
      {
        text: 'If the timing is wrong, that is a real answer and a common one. Boards move at the speed of trust, and pushing past that speed is how organizations end up with plans nobody owns. Your results do not expire, and neither does the offer to run the session with your board.',
      },
      {
        text: 'Two things stay true after today. If you reply to this, or any of these, it comes to me, not a queue. And if six months from now something shifts, a hard budget meeting, a property question, a board member who finally says the quiet thing out loud, this thread is the fastest way to reach us.',
      },
      {
        text: 'It was worth five minutes of your time to find out whether your community would grieve you. Whatever you do next, do not let the answer go stale.',
      },
    ],
    trailingLink: () => BOARD_AUDIT_URL,
  },
];

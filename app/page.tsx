import type { Metadata } from 'next';
import Link from 'next/link';
import RevealObserver from '@/components/landing/RevealObserver';
import { BOARD_AUDIT_URL } from '@/lib/email';
import './landing.css';

const TITLE = 'The Grievability Audit | Would Your Community Grieve You? | Free Assessment';
const DESCRIPTION =
  'A free five minute assessment for nonprofits, churches, and mission organizations. Score your organization across five dimensions of presence and find out: if you disappeared, would your community grieve the loss? By Reframe Concepts.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  authors: [{ name: 'Reframe Concepts' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'The Grievability Audit | Would Your Community Grieve You?',
    description:
      'A free five minute diagnostic for nonprofits and churches. Five dimensions. One honest score. Results sent to your inbox.',
    url: '/',
    siteName: 'The Grievability Audit',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Grievability Audit',
    description: 'If your organization disappeared tomorrow, would anyone grieve it? Take the free five minute audit.',
  },
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'The Grievability Audit',
  url: 'https://www.grievabilityaudit.com/',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'A free organizational assessment that scores nonprofits, churches, and mission organizations across five dimensions of presence to answer one question: would your community grieve you if you were gone?',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  provider: {
    '@type': 'Organization',
    name: 'Reframe Concepts',
    url: 'https://www.reframeconcepts.com/',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Reframe Concepts',
  url: 'https://www.reframeconcepts.com/',
  description:
    'A Kelowna based impact, sustainability, and governance consultancy helping land owning nonprofits, churches, and faith communities across Canada become indispensable to the communities they serve.',
  founder: [
    { '@type': 'Person', name: 'Brian McKenzie' },
    { '@type': 'Person', name: 'Laurence East' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Kelowna', addressRegion: 'BC', addressCountry: 'CA' },
  sameAs: [
    'https://www.linkedin.com/company/reframeconcepts/',
    'https://www.instagram.com/reframeconcepts',
    'https://www.youtube.com/@reframeconcepts',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Grievability Audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Grievability Audit is a free five minute assessment for nonprofits, churches, and mission organizations. It scores your organization across five dimensions of presence, attunement, relevance, indispensability, story, and durability, and answers one honest question: if you disappeared tomorrow, would your community grieve the loss?',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Grievability Audit really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The self serve audit is completely free. You answer fifteen statements, and your full results, including your score, your five dimension breakdown, and a personalized written interpretation, are sent to your email. A paid, facilitated version run live with your full board is also available.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does grievability mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Grievability is the honest test of impact. Not whether your organization is busy, well funded, or even loved, but whether your absence would leave a real hole in your community. An organization nobody would grieve has quietly already begun to disappear.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is the audit for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Board chairs, pastors, executive directors, and leaders of nonprofits, charities, churches, and faith communities, especially organizations that own land or buildings and sense they should be doing more for their community than they currently are.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who built the Grievability Audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The audit was built by Reframe Concepts, a Canadian impact, sustainability, and governance consultancy based in Kelowna, BC. Reframe works with land owning nonprofits and faith communities across Canada, including church land redevelopment projects advancing hundreds of units of community housing.',
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="ga-landing">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <RevealObserver />

      <header className="top">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="The Grievability Audit home">
            <svg width="26" height="25" viewBox="0 0 200 190" aria-hidden="true">
              <path
                d="M130.9,172.8 L47.1,172.8 L14.4,72.2 L100,10 L185.6,72.2 L159.7,151.9"
                fill="none"
                stroke="#5B9BD5"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            The Grievability Audit
          </Link>
          <Link className="btn btn-ember" href="/start">Take the audit</Link>
        </div>
      </header>

      <div>
        {/* HERO */}
        <section className="hero sec-dusk">
          <svg className="mark" viewBox="0 0 200 190" aria-hidden="true">
            <path
              d="M130.9,172.8 L47.1,172.8 L14.4,72.2 L100,10 L185.6,72.2 L159.7,151.9"
              fill="none"
              stroke="#5B9BD5"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="wrap">
            <p className="eyebrow"><span className="dot"></span> A free assessment by Reframe Concepts</p>
            <h1>Would your community <em>grieve</em> you?</h1>
            <p className="lede">
              Most organizations measure what they do. This measures whether anyone would miss it. Fifteen honest
              statements, five minutes, one number, and your full results sent straight to your inbox.
            </p>
            <div className="row">
              <Link className="btn btn-ember" href="/start">Take the audit</Link>
              <span className="micro">Free &middot; 5 minutes &middot; No account needed</span>
            </div>
          </div>
        </section>

        {/* THE WHY */}
        <section className="sec sec-bone essay" id="why">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> Why this exists</p>
            <h2 className="head">Activity is not impact.</h2>
            <p style={{ marginTop: 24 }}>
              Every nonprofit, church, and mission organization tracks something. Programs run. Dollars raised.
              Attendance counted. All of it real, and none of it the point. Those numbers measure how busy you are.
              They say nothing about whether the community around you would feel a hole if you were gone.
            </p>
            <p>
              That gap matters more now than it ever has. Congregations are aging. Giving is thinning. Buildings
              that anchored neighbourhoods for generations are quietly becoming costs to defend instead of
              presences to count on. And most boards sense it long before anyone says it out loud.
            </p>
            <p className="pull">
              An organization nobody would grieve has quietly already begun to disappear. The good news: that is a
              position, not a fate.
            </p>
            <div className="stat-row">
              <div className="stat">
                <div className="big">9,000</div>
                <div className="lab">Canadian faith buildings at risk of closing within a decade</div>
              </div>
              <div className="stat">
                <div className="big">$15.5B</div>
                <div className="lab">in annual civic value tied to those spaces</div>
              </div>
            </div>
            <p className="src">
              Source:{' '}
              <a href="https://canurb.org/wp-content/uploads/Sacred-Spaces-Civic-Value-CUI-Report.pdf" rel="noopener">
                Sacred Spaces, Civic Value
              </a>
              , Canadian Urban Institute.
            </p>
          </div>
        </section>

        {/* FIVE DIMENSIONS */}
        <section className="sec sec-dusk" id="what">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> What it measures</p>
            <h2 className="head">Five dimensions of presence</h2>
            <p style={{ maxWidth: 620, marginTop: 18, color: 'var(--slate-on-dark)', fontSize: 16.5, lineHeight: 1.55 }}>
              Grievability is not a vague feeling. It can be scored. The audit measures your organization across
              five dimensions, each one a different test of whether your work would be missed.
            </p>
            <div className="dims">
              <div className="drow">
                <span className="dn">01</span>
                <div><h3>Attunement</h3></div>
                <div className="dq">Do you still know what your community would miss?</div>
              </div>
              <div className="drow">
                <span className="dn">02</span>
                <div><h3>Relevance</h3></div>
                <div className="dq">Do you meet a need they feel today, not one that has faded?</div>
              </div>
              <div className="drow">
                <span className="dn">03</span>
                <div><h3>Indispensability<span className="core">The core, weighted double</span></h3></div>
                <div className="dq">Does your absence leave a hole no one else can fill?</div>
              </div>
              <div className="drow">
                <span className="dn">04</span>
                <div><h3>Story</h3></div>
                <div className="dq">Is there a future vivid enough that people would mourn it?</div>
              </div>
              <div className="drow">
                <span className="dn">05</span>
                <div><h3>Durability</h3></div>
                <div className="dq">Are you reliably, sustainably, dependably there?</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="sec sec-bone" id="how">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> How it works</p>
            <h2 className="head">Five minutes. One honest mirror.</h2>
            <div className="steps">
              <div className="step">
                <div className="sn">1</div>
                <h3>Answer fifteen statements</h3>
                <p>
                  Score each from strongly disagree to strongly agree, as your organization honestly is today, not
                  as it hopes to be. No account, no signup to begin.
                </p>
              </div>
              <div className="step">
                <div className="sn">2</div>
                <h3>We read your result</h3>
                <p>
                  Your answers are scored across the five dimensions, with indispensability weighted double, and a
                  personalized written interpretation is prepared for your specific result.
                </p>
              </div>
              <div className="step">
                <div className="sn">3</div>
                <h3>Your report arrives by email</h3>
                <p>
                  Your Grievability Score, your five dimension breakdown, your two weakest dimensions, and the
                  first move that closes each. Yours to keep, and to bring to your board.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU RECEIVE */}
        <section className="sec sec-dusk">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> What you receive</p>
            <h2 className="head">A report built for a board meeting</h2>
            <ul className="receive">
              <li><b>Your Grievability Score</b>, a single honest number from 0 to 100, with a plain language verdict.</li>
              <li><b>Your five dimension profile</b>, showing exactly where your presence is strong and where it is thinning.</li>
              <li><b>Your two lowest dimensions</b>, named, with the specific first move that starts closing each one.</li>
              <li><b>A personalized interpretation</b>, written for your result, not a generic template, ending with one question worth raising at your next board meeting.</li>
            </ul>
            <div className="row" style={{ marginTop: 34 }}>
              <Link className="btn btn-ember" href="/start">Take the audit</Link>
            </div>
          </div>
        </section>

        {/* WHO IS BEHIND IT */}
        <section className="sec sec-bone" id="reframe">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> Who is behind it</p>
            <h2 className="head">Built by Reframe Concepts</h2>
            <div className="who-grid" style={{ marginTop: 26 }}>
              <div className="body">
                <p>
                  Reframe Concepts is a Canadian impact, sustainability, and governance consultancy based in
                  Kelowna, BC, working with land owning nonprofits, churches, and faith communities across the
                  country. Founded by Brian McKenzie and Laurence East, the firm sits on the client&rsquo;s side of
                  the table, not the developer&rsquo;s, helping boards make well governed decisions about their
                  land, their buildings, and their mission.
                </p>
                <p>
                  The audit distills what Reframe has learned in real board rooms into one instrument: that the
                  organizations which last are not the busiest ones, they are the ones that would be missed. We
                  make mission organizations grievable, by excavating their hidden why, so they are built to be
                  missed.
                </p>
                <p>We move at the speed of trust.</p>
              </div>
              <div>
                <div className="proof-card">
                  <h3>Trinity United Church, Vernon</h3>
                  <p>
                    Four and a half acres of underused church land, now advancing toward a 250 unit mixed income
                    community, 161 supportive homes among them, with letters of intent secured.
                  </p>
                  <div className="quote">
                    <p>
                      Reframe presented options that seem both achievable as well as hugely exciting. I have great
                      confidence in their competence in leading us through what would otherwise be an impossibly
                      daunting task.
                    </p>
                    <div className="who">Rev Robin Jacobson, Lead Minister, Trinity United Church</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TWO WAYS TO RUN IT */}
        <section className="sec sec-dusk" id="options">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> Two ways to run it</p>
            <h2 className="head">Start alone. Go deeper together.</h2>
            <div className="tier-grid">
              <div className="tier">
                <span className="tag">Free, self serve</span>
                <h3>The online audit</h3>
                <p>
                  Take it yourself in five minutes. Your full report, score, profile, weakest dimensions, and a
                  personalized interpretation, arrives by email. The honest starting point for any leader who has
                  quietly wondered whether their organization would be missed.
                </p>
                <Link className="btn btn-ember" href="/start">Take the audit</Link>
              </div>
              <div className="tier featured">
                <span className="tag">Facilitated, fixed fee</span>
                <h3>Live with your board</h3>
                <p>
                  Ninety minutes, your full board, everyone scoring in the same room. Individual answers diverge in
                  ways one person filling out a form never reveals, and the conversation inside those gaps is where
                  the real finding lives. Fixed fee, credited in full against any larger engagement that follows.
                </p>
                <a className="btn btn-ghost" href={BOARD_AUDIT_URL} rel="noopener">
                  Book the board audit
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec sec-bone" id="faq">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> Questions</p>
            <h2 className="head">Frequently asked questions</h2>
            <div className="faq-list">
              <details open>
                <summary>What is the Grievability Audit?<span className="plus">+</span></summary>
                <p>
                  A free five minute assessment for nonprofits, churches, and mission organizations. It scores your
                  organization across five dimensions of presence and answers one honest question: if you
                  disappeared tomorrow, would your community grieve the loss?
                </p>
              </details>
              <details>
                <summary>Is it really free?<span className="plus">+</span></summary>
                <p>
                  Yes. The self serve audit is completely free. You answer fifteen statements and your full results
                  are sent to your email. A paid, facilitated version run live with your full board is also
                  available for organizations that want to go deeper.
                </p>
              </details>
              <details>
                <summary>What does grievability actually mean?<span className="plus">+</span></summary>
                <p>
                  Grievability is the honest test of impact. Not whether your organization is busy, well funded, or
                  even loved, but whether your absence would leave a real hole in your community. An organization
                  nobody would grieve has quietly already begun to disappear.
                </p>
              </details>
              <details>
                <summary>Who is this for?<span className="plus">+</span></summary>
                <p>
                  Board chairs, pastors, executive directors, and leaders of nonprofits, charities, churches, and
                  faith communities, especially organizations that own land or buildings and sense they should be
                  doing more for their community than they currently are.
                </p>
              </details>
              <details>
                <summary>What happens with my email?<span className="plus">+</span></summary>
                <p>
                  Your results are sent to it, and Reframe may follow up with a short series of notes drawn from
                  running this audit with real boards. No spam, and you can unsubscribe at any time. See the
                  privacy policy for full details.
                </p>
              </details>
              <details>
                <summary>Who built this?<span className="plus">+</span></summary>
                <p>
                  Reframe Concepts, a Canadian impact, sustainability, and governance consultancy based in Kelowna,
                  BC, working with land owning nonprofits and faith communities across the country.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final sec-dusk">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> Begin</p>
            <h2>Find out where you stand.</h2>
            <p>
              Fifteen statements. Five minutes. One number most organizations never ask for, and the two moves that
              start changing it.
            </p>
            <div className="row">
              <Link className="btn btn-ember" href="/start">Take the audit</Link>
              <span className="micro">Free &middot; Results by email &middot; Built by Reframe Concepts</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="wrap">
          <span className="fbrand">
            <b>The Grievability Audit</b> &nbsp;&middot;&nbsp; by{' '}
            <a href="https://www.reframeconcepts.com/" rel="noopener">Reframe Concepts</a>
          </span>
          <span className="fmeta">
            <Link href="/privacy">Privacy</Link> &nbsp;&middot;&nbsp; Kelowna, BC &nbsp;&middot;&nbsp; Grievable &middot;
            Hidden Why &middot; Built to Be Missed
          </span>
        </div>
      </footer>
    </div>
  );
}

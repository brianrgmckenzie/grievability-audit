'use client';

import Link from 'next/link';
import Image from 'next/image';
import RevealObserver from '@/components/landing/RevealObserver';
import LanguagePicker from '@/components/LanguagePicker';
import { BOARD_AUDIT_URL } from '@/lib/email';
import { LanguageProvider, useTranslation } from '@/context/LanguageContext';

function HomeBody() {
  const { t } = useTranslation();
  const h = t.home;

  return (
    <div className="ga-landing">
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
            {h.nav.brand}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <LanguagePicker />
            <Link className="btn btn-ember" href="/start">{h.nav.cta}</Link>
          </div>
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
            <p className="eyebrow"><span className="dot"></span> {h.hero.eyebrow}</p>
            <h1>{h.hero.titleBefore}<em>{h.hero.titleItalic}</em>{h.hero.titleAfter}</h1>
            <p className="lede">{h.hero.lede}</p>
            <div className="row">
              <Link className="btn btn-ember" href="/start">{h.hero.cta}</Link>
              <span className="micro">{h.hero.micro}</span>
            </div>
          </div>
        </section>

        {/* THE WHY */}
        <section className="sec sec-bone essay" id="why">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.why.eyebrow}</p>
            <h2 className="head">{h.why.head}</h2>
            <p style={{ marginTop: 24 }}>{h.why.p1}</p>
            <p>{h.why.p2}</p>
            <p className="pull">{h.why.pull}</p>
            <div className="stat-row">
              <div className="stat">
                <div className="big">{h.why.stat1Big}</div>
                <div className="lab">{h.why.stat1Lab}</div>
              </div>
              <div className="stat">
                <div className="big">{h.why.stat2Big}</div>
                <div className="lab">{h.why.stat2Lab}</div>
              </div>
            </div>
            <p className="src">
              {h.why.sourcePrefix}
              <a href="https://canurb.org/wp-content/uploads/Sacred-Spaces-Civic-Value-CUI-Report.pdf" rel="noopener">
                {h.why.sourceLinkText}
              </a>
              {h.why.sourceSuffix}
            </p>
          </div>
        </section>

        {/* FIVE DIMENSIONS */}
        <section className="sec sec-dusk" id="what">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.dims.eyebrow}</p>
            <h2 className="head">{h.dims.head}</h2>
            <p style={{ maxWidth: 620, marginTop: 18, color: 'var(--slate-on-dark)', fontSize: 16.5, lineHeight: 1.55 }}>
              {h.dims.intro}
            </p>
            <div className="dims">
              {h.dims.rows.map((row, i) => (
                <div className="drow" key={row.name}>
                  <span className="dn">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>
                      {row.name}
                      {i === 2 && <span className="core">{h.dims.coreTag}</span>}
                    </h3>
                  </div>
                  <div className="dq">{row.question}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="sec sec-bone" id="how">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.how.eyebrow}</p>
            <h2 className="head">{h.how.head}</h2>
            <div className="steps">
              {h.how.steps.map((step, i) => (
                <div className="step" key={step.title}>
                  <div className="sn">{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU RECEIVE */}
        <section className="sec sec-dusk">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.receive.eyebrow}</p>
            <h2 className="head">{h.receive.head}</h2>
            <ul className="receive">
              {h.receive.items.map((item) => (
                <li key={item.bold}><b>{item.bold}</b>{item.rest}</li>
              ))}
            </ul>
            <div className="row" style={{ marginTop: 34 }}>
              <Link className="btn btn-ember" href="/start">{h.receive.cta}</Link>
            </div>
          </div>
        </section>

        {/* WHO IS BEHIND IT */}
        <section className="sec sec-bone" id="reframe">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.who.eyebrow}</p>
            <h2 className="head">{h.who.head}</h2>
            <a href="https://www.reframeconcepts.com/" rel="noopener" style={{ display: 'inline-block', marginTop: 22 }}>
              <Image
                src="/reframe-logo-for-light-bg.png"
                alt="Reframe Concepts"
                width={150}
                height={50}
                style={{ height: '42px', width: 'auto', display: 'block' }}
              />
            </a>
            <div className="who-grid" style={{ marginTop: 26 }}>
              <div className="body">
                <p>{h.who.p1}</p>
                <p>{h.who.p2}</p>
                <p>{h.who.p3}</p>
              </div>
              <div>
                <div className="proof-card">
                  <h3>{h.who.proofTitle}</h3>
                  <p>{h.who.proofBody}</p>
                  <div className="quote">
                    <p>{h.who.quote}</p>
                    <div className="who">{h.who.quoteWho}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TWO WAYS TO RUN IT */}
        <section className="sec sec-dusk" id="options">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.options.eyebrow}</p>
            <h2 className="head">{h.options.head}</h2>
            <div className="tier-grid">
              <div className="tier">
                <span className="tag">{h.options.tier1Tag}</span>
                <h3>{h.options.tier1Title}</h3>
                <p>{h.options.tier1Body}</p>
                <Link className="btn btn-ember" href="/start">{h.options.tier1Cta}</Link>
              </div>
              <div className="tier featured">
                <span className="tag">{h.options.tier2Tag}</span>
                <h3>{h.options.tier2Title}</h3>
                <p>{h.options.tier2Body}</p>
                <a className="btn btn-ghost" href={BOARD_AUDIT_URL} rel="noopener">
                  {h.options.tier2Cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec sec-bone" id="faq">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.faq.eyebrow}</p>
            <h2 className="head">{h.faq.head}</h2>
            <div className="faq-list">
              {h.faq.items.slice(0, 4).map((item, i) => (
                <details key={item.q} open={i === 0}>
                  <summary>{item.q}<span className="plus">+</span></summary>
                  <p>{item.a}</p>
                </details>
              ))}
              <details>
                <summary>{h.faq.emailQuestion}<span className="plus">+</span></summary>
                <p>
                  {h.faq.emailAnswerPrefix}
                  <Link href="/privacy" style={{ textDecoration: 'underline' }}>{h.faq.emailAnswerLinkText}</Link>
                  {h.faq.emailAnswerSuffix}
                </p>
              </details>
              {h.faq.items.slice(4).map((item) => (
                <details key={item.q}>
                  <summary>{item.q}<span className="plus">+</span></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final sec-dusk">
          <div className="wrap reveal">
            <p className="eyebrow"><span className="dot"></span> {h.final.eyebrow}</p>
            <h2>{h.final.head}</h2>
            <p>{h.final.body}</p>
            <div className="row">
              <Link className="btn btn-ember" href="/start">{h.final.cta}</Link>
              <span className="micro">{h.final.micro}</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="wrap">
          <span className="fbrand">
            <b>{h.footer.brand}</b> &nbsp;&middot;&nbsp; {h.footer.by}{' '}
            <a href="https://www.reframeconcepts.com/" rel="noopener">Reframe Concepts</a>
          </span>
          <span className="fmeta">
            <Link href="/privacy">{h.footer.privacy}</Link> &nbsp;&middot;&nbsp; {h.footer.meta}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function HomeContent() {
  return (
    <LanguageProvider>
      <HomeBody />
    </LanguageProvider>
  );
}

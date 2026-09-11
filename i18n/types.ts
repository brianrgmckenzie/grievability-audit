export type Lang = 'en' | 'fr' | 'es' | 'de';

export interface DimT {
  name: string;
  tie: string;
  desc: string;
  statements: [string, string, string];
}

export interface BandT {
  name: string;
  desc: string;
}

export interface HomeDimRow {
  name: string;
  question: string;
}

export interface HomeStep {
  title: string;
  body: string;
}

export interface HomeFaqItem {
  q: string;
  a: string;
}

export interface HomeReceiveItem {
  bold: string;
  rest: string;
}

export interface Translations {
  lang: Lang;
  home: {
    nav: { brand: string; cta: string };
    hero: {
      eyebrow: string;
      titleBefore: string;
      titleItalic: string;
      titleAfter: string;
      lede: string;
      cta: string;
      micro: string;
    };
    why: {
      eyebrow: string;
      head: string;
      p1: string;
      p2: string;
      pull: string;
      stat1Big: string;
      stat1Lab: string;
      stat2Big: string;
      stat2Lab: string;
      sourcePrefix: string;
      sourceLinkText: string;
      sourceSuffix: string;
    };
    dims: {
      eyebrow: string;
      head: string;
      intro: string;
      coreTag: string;
      rows: [HomeDimRow, HomeDimRow, HomeDimRow, HomeDimRow, HomeDimRow];
    };
    how: {
      eyebrow: string;
      head: string;
      steps: [HomeStep, HomeStep, HomeStep];
    };
    receive: {
      eyebrow: string;
      head: string;
      items: [HomeReceiveItem, HomeReceiveItem, HomeReceiveItem, HomeReceiveItem];
      cta: string;
    };
    who: {
      eyebrow: string;
      head: string;
      p1: string;
      p2: string;
      p3: string;
      proofTitle: string;
      proofBody: string;
      quote: string;
      quoteWho: string;
    };
    options: {
      eyebrow: string;
      head: string;
      tier1Tag: string;
      tier1Title: string;
      tier1Body: string;
      tier1Cta: string;
      tier2Tag: string;
      tier2Title: string;
      tier2Body: string;
      tier2Cta: string;
    };
    faq: {
      eyebrow: string;
      head: string;
      items: [HomeFaqItem, HomeFaqItem, HomeFaqItem, HomeFaqItem, HomeFaqItem];
      emailQuestion: string;
      emailAnswerPrefix: string;
      emailAnswerLinkText: string;
      emailAnswerSuffix: string;
    };
    final: {
      eyebrow: string;
      head: string;
      body: string;
      cta: string;
      micro: string;
    };
    footer: {
      brand: string;
      by: string;
      privacy: string;
      meta: string;
    };
  };
  landing: {
    eyebrow: string;
    titleBefore: string;
    titleItalic: string;
    titleAfter: string;
    body1: string;
    body2: string;
    cta: string;
    tagline: string;
  };
  scoring: {
    back: string;
    next: string;
    seeResult: string;
    coreDimension: string;
    disagree: string;
    agree: string;
  };
  calculating: {
    headline: string;
    body: string;
  };
  gate: {
    eyebrow: string;
    titleBefore: string;
    titleItalic: string;
    titleAfter: string;
    body: string;
    namePlaceholder: string;
    orgPlaceholder: string;
    emailPlaceholder: string;
    cta: string;
    ctaLoading: string;
    error: string;
    footer: string;
    privacyNote: string;
    privacyLink: string;
    cityPlaceholder: string;
    provincePlaceholder: string;
  };
  results: {
    reportLabel: string;
    headline: string;
    scoreLabel: string;
    interpretation: string;
    fullBreakdown: string;
    weightedDouble: string;
    twoThings: string;
    deeper: string;
    ctaBody: string;
    ctaButton: string;
    emailNote: string;
  };
  dims: [DimT, DimT, DimT, DimT, DimT];
  recs: [string, string, string, string, string];
  bands: {
    loadBearing: BandT;
    heldInAffection: BandT;
    quietlyAtRisk: BandT;
    disappearing: BandT;
  };
}

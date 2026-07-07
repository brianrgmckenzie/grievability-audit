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

export interface Translations {
  lang: Lang;
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

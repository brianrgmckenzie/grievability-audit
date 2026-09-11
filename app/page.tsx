import type { Metadata } from 'next';
import HomeContent from '@/components/landing/HomeContent';
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomeContent />
    </>
  );
}

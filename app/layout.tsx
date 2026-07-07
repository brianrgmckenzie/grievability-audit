import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Grievability Audit — Reframe Concepts',
  description:
    'A five-minute diagnostic for nonprofit and faith-based leaders. Would your community grieve you?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-D979Q6TCND"
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-D979Q6TCND');
        `}
      </Script>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}

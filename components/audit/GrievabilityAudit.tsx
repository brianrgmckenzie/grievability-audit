'use client';

import { useState, useCallback } from 'react';
import { type Answers } from '@/lib/scoring';
import { LanguageProvider, useTranslation } from '@/context/LanguageContext';
import LanguagePicker from '@/components/LanguagePicker';
import ProgressRail from './ProgressRail';
import LandingScreen from './LandingScreen';
import ScoringScreen from './ScoringScreen';
import CalculatingScreen from './CalculatingScreen';
import GateScreen from './GateScreen';
import ResultsScreen from './ResultsScreen';
import EmbedResizeReporter from './EmbedResizeReporter';

type Screen = 'landing' | 'scoring' | 'calculating' | 'gate' | 'results';

interface ResultsData {
  name: string;
  org: string;
  narrative: string;
}

function AuditContent() {
  const { lang } = useTranslation();
  const [screen, setScreen] = useState<Screen>('landing');
  const [dimIndex, setDimIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<ResultsData | null>(null);

  const handleAnswer = useCallback((dimIdx: number, stmtIdx: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [`${dimIdx}-${stmtIdx}`]: value }));
  }, []);

  function handleNext() {
    if (dimIndex < 4) {
      setDimIndex((i) => i + 1);
      window.scrollTo(0, 0);
    } else {
      setScreen('calculating');
      window.scrollTo(0, 0);
      setTimeout(() => { setScreen('gate'); window.scrollTo(0, 0); }, 2200);
    }
  }

  function handleBack() {
    if (screen === 'scoring' && dimIndex === 0) {
      setScreen('landing');
    } else if (screen === 'scoring') {
      setDimIndex((i) => i - 1);
    }
    window.scrollTo(0, 0);
  }

  async function handleSubmit(name: string, email: string, org: string, city: string, province: string) {
    setScreen('calculating');
    window.scrollTo(0, 0);

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, org, city, province, answers, lang }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setScreen('gate');
      throw new Error(body.error ?? 'Submit failed');
    }

    const data = await res.json();
    setResults({ name, org, narrative: data.narrative });
    setScreen('results');
    window.scrollTo(0, 0);
  }

  const isScoring = screen === 'scoring';

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isScoring && <ProgressRail dimIndex={dimIndex} totalDims={5} />}

      <div style={{ width: '100%', maxWidth: '560px', flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
        <LanguagePicker />

        {screen === 'landing' && (
          <LandingScreen onBegin={() => { setScreen('scoring'); setDimIndex(0); }} />
        )}

        {screen === 'scoring' && (
          <ScoringScreen
            dimIndex={dimIndex}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {screen === 'calculating' && <CalculatingScreen />}

        {screen === 'gate' && <GateScreen onSubmit={handleSubmit} />}

        {screen === 'results' && results && (
          <ResultsScreen
            name={results.name}
            org={results.org}
            answers={answers}
            narrative={results.narrative}
          />
        )}
      </div>
    </div>
  );
}

export default function GrievabilityAudit() {
  return (
    <LanguageProvider>
      <EmbedResizeReporter />
      <AuditContent />
    </LanguageProvider>
  );
}

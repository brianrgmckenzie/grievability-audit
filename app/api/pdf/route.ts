import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import fs from 'fs';
import path from 'path';
import ReportPDF from '@/components/pdf/ReportPDF';
import type { Answers } from '@/lib/scoring';

function getLogoUrl(): string {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'reframe-logo.png'));
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return 'https://grievabilityaudit.com/reframe-logo.png';
  }
}

function validateAnswers(answers: unknown): answers is Answers {
  if (typeof answers !== 'object' || answers === null) return false;
  const a = answers as Record<string, unknown>;
  for (let d = 0; d < 5; d++) {
    for (let s = 0; s < 3; s++) {
      const v = a[`${d}-${s}`];
      if (typeof v !== 'number' || v < 1 || v > 5 || !Number.isInteger(v)) return false;
    }
  }
  return true;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, org, answers, narrative } = body;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof org !== 'string' || !org.trim() ||
    typeof narrative !== 'string' ||
    !validateAnswers(answers)
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const logoUrl = getLogoUrl();

  const date = new Date().toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    React.createElement(ReportPDF, {
      name: name.trim().slice(0, 200),
      org: org.trim().slice(0, 300),
      answers,
      narrative: narrative.trim(),
      logoUrl,
      date,
    }) as any
  );

  const filename = `${org.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-grievability-report.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

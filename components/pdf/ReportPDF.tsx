import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Polygon,
  Line,
  Circle,
  StyleSheet,
} from '@react-pdf/renderer';
import { allScores, finalScore, band, lowestTwo, DIMS, RECS } from '@/lib/scoring';
import type { Answers } from '@/lib/scoring';

const GOLD = '#C9A227';
const NAVY = '#0F1E2E';
const CREAM = '#F4EFE4';
const MUTED = '#888888';
const BORDER = '#DDDDDD';
const CONTACT = 'hello@reframeconcepts.com  ·  reframeconcepts.com  ·  grievabilityaudit.com';

const s = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 0,
    fontSize: 10,
    color: NAVY,
  },
  headerBar: {
    backgroundColor: NAVY,
    paddingHorizontal: 48,
    paddingTop: 28,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  logo: {
    height: 22,
    width: 120,
    objectFit: 'contain',
    objectPositionX: 0,
  },
  headerContact: {
    fontSize: 7.5,
    color: '#8899AA',
    letterSpacing: 0.3,
    marginTop: 6,
  },
  headerScore: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerScoreNum: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 36,
    color: GOLD,
    lineHeight: 1,
  },
  headerScoreLabel: {
    fontSize: 7,
    color: '#8899AA',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 48,
    paddingTop: 28,
  },
  eyebrow: {
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 8,
  },
  headline: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: NAVY,
    lineHeight: 1.2,
    marginBottom: 20,
    maxWidth: 380,
  },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  bandAccent: {
    width: 3,
    backgroundColor: GOLD,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  bandName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: NAVY,
    marginBottom: 4,
  },
  bandDesc: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.55,
    maxWidth: 380,
  },
  radarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 0,
  },
  radarLegend: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  legendLabel: {
    fontSize: 8,
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    flex: 1,
  },
  legendScore: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    width: 28,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 12,
    fontFamily: 'Helvetica-Bold',
  },
  narrative: {
    fontSize: 11,
    lineHeight: 1.75,
    color: '#222222',
    marginBottom: 10,
  },
  dimRow: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  dimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  dimLabel: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: NAVY,
    fontFamily: 'Helvetica-Bold',
  },
  dimCore: {
    fontSize: 7,
    color: MUTED,
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  dimScore: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
  },
  barTrack: {
    height: 3,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    marginBottom: 6,
  },
  barFill: {
    height: 3,
    backgroundColor: GOLD,
    borderRadius: 2,
  },
  dimRec: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.55,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  priorityCard: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  priorityLabel: {
    fontSize: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: NAVY,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  priorityScore: {
    fontSize: 11,
    color: GOLD,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  priorityRec: {
    fontSize: 8.5,
    color: '#555555',
    lineHeight: 1.55,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: MUTED,
    letterSpacing: 0.5,
  },
  footerBrand: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});

function RadarChart({ answers }: { answers: Answers }) {
  const cx = 80, cy = 80, r = 62;
  const scores = allScores(answers);

  function pts(scale: number) {
    return [0, 1, 2, 3, 4].map((i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const rad = r * scale;
      return `${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`;
    }).join(' ');
  }

  function dataPts() {
    return [0, 1, 2, 3, 4].map((i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const rad = r * (scores[i] / 100);
      return `${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`;
    }).join(' ');
  }

  const spokes = [0, 1, 2, 3, 4].map((i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: (cx + r * Math.cos(ang)).toFixed(1), y: (cy + r * Math.sin(ang)).toFixed(1) };
  });

  const dotPts = [0, 1, 2, 3, 4].map((i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const rad = r * (scores[i] / 100);
    return { cx: (cx + rad * Math.cos(ang)).toFixed(1), cy: (cy + rad * Math.sin(ang)).toFixed(1) };
  });

  return (
    <Svg width={160} height={160} viewBox="0 0 160 160">
      <Polygon points={pts(1)} fill="none" stroke="#DDDDDD" strokeWidth={0.75} />
      <Polygon points={pts(0.66)} fill="none" stroke="#DDDDDD" strokeWidth={0.5} />
      <Polygon points={pts(0.33)} fill="none" stroke="#DDDDDD" strokeWidth={0.5} />
      {spokes.map((sp, i) => (
        <Line key={i} x1="80" y1="80" x2={sp.x} y2={sp.y} stroke="#DDDDDD" strokeWidth={0.5} />
      ))}
      <Polygon points={dataPts()} fill={GOLD} fillOpacity={0.2} stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round" />
      {dotPts.map((d, i) => (
        <Circle key={i} cx={d.cx} cy={d.cy} r={3} fill={GOLD} />
      ))}
    </Svg>
  );
}

interface Props {
  name: string;
  org: string;
  answers: Answers;
  narrative: string;
  logoUrl: string;
  date: string;
}

export default function ReportPDF({ name, org, answers, narrative, logoUrl, date }: Props) {
  const scores = allScores(answers);
  const score = finalScore(answers);
  const bandInfo = band(score);
  const firstName = name.split(' ')[0];
  const lowestPair = lowestTwo(answers);

  return (
    <Document title={`${org} — Grievability Audit Report`} author="Reframe Concepts">

      {/* Page 1: Header + Score + Radar */}
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.headerBar}>
          <View style={s.headerLeft}>
            <Image src={logoUrl} style={s.logo} />
            <Text style={s.headerContact}>{CONTACT}</Text>
          </View>
          <View style={s.headerScore}>
            <Text style={s.headerScoreNum}>{score}<Text style={{ fontSize: 16, color: '#8899AA' }}>/100</Text></Text>
            <Text style={s.headerScoreLabel}>Grievability Score</Text>
          </View>
        </View>

        <View style={s.body}>
          <Text style={s.eyebrow}>{org}  ·  Grievability Report  ·  {date}</Text>
          <Text style={s.headline}>{firstName}, here is what{'\n'}the audit found.</Text>

          {/* Band */}
          <View style={s.bandRow}>
            <View style={s.bandAccent} />
            <View style={{ flex: 1 }}>
              <Text style={s.bandName}>{bandInfo.name}</Text>
              <Text style={s.bandDesc}>{bandInfo.desc}</Text>
            </View>
          </View>

          {/* Radar + Legend */}
          <View style={s.radarSection}>
            <RadarChart answers={answers} />
            <View style={s.radarLegend}>
              {DIMS.map((d, i) => (
                <View key={i} style={s.legendItem}>
                  <View style={s.legendDot} />
                  <Text style={s.legendLabel}>{d.num} {d.name}{d.core ? ' ×2' : ''}</Text>
                  <Text style={s.legendScore}>{scores[i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerBrand}>Reframe Concepts</Text>
          <Text style={s.footerText}>Prepared for {org}  ·  {CONTACT}</Text>
        </View>
      </Page>

      {/* Page 2: Narrative + Breakdown */}
      <Page size="LETTER" style={s.page}>
        <View style={[s.headerBar, { paddingBottom: 16, paddingTop: 16 }]}>
          <Image src={logoUrl} style={[s.logo, { height: 16, width: 90 }]} />
          <Text style={{ fontSize: 7.5, color: '#8899AA', letterSpacing: 0.5 }}>
            {org}  ·  Grievability Report
          </Text>
        </View>

        <View style={s.body}>
          <Text style={s.sectionLabel}>Interpretation</Text>
          {narrative.split('\n\n').filter(Boolean).map((para, i) => (
            <Text key={i} style={[s.narrative, { marginBottom: i < narrative.split('\n\n').filter(Boolean).length - 1 ? 10 : 0 }]}>
              {para}
            </Text>
          ))}

          <View style={s.divider} />

          <Text style={s.sectionLabel}>Full Breakdown</Text>
          {DIMS.map((d, i) => (
            <View key={i} style={s.dimRow} wrap={false}>
              <View style={s.dimHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={s.dimLabel}>{d.num} {d.name}</Text>
                  {d.core && <Text style={s.dimCore}> · weighted double</Text>}
                </View>
                <Text style={s.dimScore}>{scores[i]}<Text style={{ color: MUTED, fontSize: 8 }}>/100</Text></Text>
              </View>
              <View style={s.barTrack}>
                <View style={[s.barFill, { width: `${scores[i]}%` }]} />
              </View>
              <Text style={s.dimRec}>{RECS[i]}</Text>
            </View>
          ))}

          <View style={s.divider} />

          <Text style={s.sectionLabel}>The Two Priorities</Text>
          <View style={s.priorityRow}>
            {lowestPair.map((lo, i) => (
              <View key={i} style={s.priorityCard}>
                <Text style={s.priorityLabel}>{lo.eyebrow}</Text>
                <Text style={s.priorityScore}>{lo.scoreStr}</Text>
                <Text style={s.priorityRec}>{lo.rec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerBrand}>Reframe Concepts</Text>
          <Text style={s.footerText}>Prepared for {org}  ·  {CONTACT}</Text>
        </View>
      </Page>

    </Document>
  );
}

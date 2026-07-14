import { ImageResponse } from 'next/og';

export const alt = 'The Grievability Audit — Reframe Concepts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#1E1812',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#E0943A',
            marginBottom: 28,
            display: 'flex',
          }}
        >
          Reframe Concepts
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#F2EAD8',
            lineHeight: 1.1,
            maxWidth: 980,
            display: 'flex',
          }}
        >
          Would your community grieve you?
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#B8AE9C',
            marginTop: 32,
            display: 'flex',
          }}
        >
          The Grievability Audit — a five-minute diagnostic for nonprofit and faith-based leaders
        </div>
      </div>
    ),
    { ...size }
  );
}

import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from './scenesConfig';

// Pseudo-random deterministik (aman untuk render paralel)
export const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const fill: React.CSSProperties = {pointerEvents: 'none', overflow: 'hidden'};

/** Floating: kabut melayang pelan, muncul bergiliran (stagger). */
export const Fog: React.FC<{opacity?: number; tint?: string; layers?: number}> = ({
  opacity = 1,
  tint = '200,210,225',
  layers = 6,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={fill}>
      {Array.from({length: layers}).map((_, i) => {
        const w = 1300 + rnd(i + 1) * 500;
        const h = 420 + rnd(i + 9) * 260;
        const speed = 0.25 + rnd(i + 3) * 0.45;
        const dir = i % 2 === 0 ? 1 : -1;
        const span = WIDTH + w;
        const base = rnd(i + 5) * span;
        const x = ((((base + dir * frame * speed) % span) + span) % span) - w;
        const y = HEIGHT * (0.25 + 0.6 * rnd(i + 7)) + Math.sin(frame / (70 + i * 13) + i) * 28;
        const fadeIn = interpolate(frame, [i * 14, i * 14 + 50], [0, 1], {extrapolateRight: 'clamp'});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y - h / 2,
              width: w,
              height: h,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, rgba(${tint},${0.3 * opacity}) 0%, rgba(${tint},0) 68%)`,
              opacity: fadeIn,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Tint biru-abu malam. */
export const NightTint: React.FC = () => (
  <AbsoluteFill style={{...fill, backgroundColor: 'rgba(30,50,95,0.22)', mixBlendMode: 'multiply'}} />
);

/** Cahaya lampu minyak/gas: kedip halus. */
export const Lamp: React.FC<{x?: number; y?: number}> = ({x = 50, y = 40}) => {
  const frame = useCurrentFrame();
  const flicker =
    0.62 + 0.1 * Math.sin(frame / 5.3) + 0.07 * Math.sin(frame / 2.1 + 1) + 0.05 * Math.sin(frame / 11);
  return (
    <>
      <AbsoluteFill
        style={{
          ...fill,
          background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,175,80,${0.4 * flicker}) 0%, rgba(255,140,40,${0.12 * flicker}) 35%, rgba(255,140,40,0) 62%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{...fill, backgroundColor: `rgba(255,140,40,${0.05 * flicker})`}} />
    </>
  );
};

const WINDOWS: [number, number][] = [
  [18, 22], [50, 17], [82, 24], [30, 42], [70, 45], [12, 58], [88, 60], [45, 33], [62, 27],
];

/** Stagger: cahaya jendela menyala bergiliran dengan pantulan spring lalu bernapas. */
export const WindowGlows: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{...fill, mixBlendMode: 'screen'}}>
      {WINDOWS.map(([px, py], i) => {
        const pop = spring({
          frame: frame - (10 + i * 14),
          fps,
          config: {damping: 10, stiffness: 140, mass: 0.7},
        });
        const breathe = 0.85 + 0.15 * Math.sin(frame / 30 + i);
        const size = 240;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${px}%`,
              top: `${py}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,205,115,0.55) 0%, rgba(255,170,70,0.18) 45%, rgba(255,170,70,0) 70%)',
              opacity: Math.max(0, Math.min(1, pop * breathe)),
              transform: `scale(${0.6 + 0.4 * pop})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Note: React.FC<{size: number; color: string; kind: number}> = ({size, color, kind}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 40 48" style={{filter: `drop-shadow(0 0 10px ${color})`}}>
    <ellipse cx="12" cy="38" rx="11" ry="8" transform="rotate(-20 12 38)" fill={color} />
    <rect x="21" y="6" width="4" height="32" fill={color} />
    {kind % 2 === 0 ? <path d="M25 6 Q40 12 37 28 Q33 18 25 17Z" fill={color} /> : null}
  </svg>
);

/** Note musik: stagger + floating (naik, goyang), pop dengan overshoot. */
export const Notes: React.FC<{count?: number; color?: string}> = ({count = 10, color = '#ffd36b'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={fill}>
      {Array.from({length: count}).map((_, i) => {
        const delay = i * 20;
        if (frame < delay) return null;
        const period = 260 + rnd(i + 2) * 140;
        const p = ((frame - delay) % period) / period;
        const cycle = Math.floor((frame - delay) / period);
        const sx = WIDTH * (0.15 + 0.7 * rnd(i * 3 + cycle * 7 + 1));
        const sy = HEIGHT * (0.55 + 0.2 * rnd(i + 4));
        const rise = 700 + rnd(i + 6) * 300;
        const x = sx + Math.sin(p * Math.PI * 4 + i) * 60;
        const y = sy - p * rise;
        const scale = interpolate(p, [0, 0.12], [0, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(2.2)),
        });
        const op = interpolate(p, [0, 0.1, 0.8, 1], [0, 1, 0.9, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              opacity: op,
              transform: `scale(${scale}) rotate(${Math.sin(p * 6 + i) * 18}deg)`,
            }}
          >
            <Note size={54 + rnd(i + 8) * 40} color={color} kind={i} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Floating: butiran debu cahaya. */
export const Dust: React.FC<{count?: number}> = ({count = 28}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={fill}>
      {Array.from({length: count}).map((_, i) => {
        const r = 2 + rnd(i + 1) * 3;
        const x = rnd(i + 2) * WIDTH + Math.sin(frame / (60 + i * 3) + i) * 30;
        const y = ((((rnd(i + 3) * HEIGHT - frame * (0.3 + rnd(i + 4) * 0.5)) % HEIGHT) + HEIGHT) % HEIGHT);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,225,160,1)',
              boxShadow: '0 0 12px rgba(255,210,130,0.9)',
              opacity: 0.25 + 0.25 * Math.sin(frame / 40 + i),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Cahaya fajar peach/biru + orb melayang. */
export const Dawn: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 120], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{...fill, mixBlendMode: 'screen', opacity: o}}>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,190,150,0.30) 0%, rgba(150,190,235,0.14) 45%, rgba(255,255,255,0) 75%)',
        }}
      />
      {Array.from({length: 5}).map((_, i) => {
        const s = 380 + rnd(i + 1) * 260;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: rnd(i + 2) * WIDTH + Math.sin(frame / (90 + i * 20) + i) * 60 - s / 2,
              top: HEIGHT * (0.08 + 0.35 * rnd(i + 3)) + Math.cos(frame / (110 + i * 17) + i) * 40,
              width: s,
              height: s,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,220,170,0.32) 0%, rgba(255,220,170,0) 70%)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Motion trail: garis whoosh melengkung pada gestur cepat (muncul berkala, stagger). */
export const Streaks: React.FC = () => {
  const frame = useCurrentFrame();
  const paths = [
    'M 120 1020 Q 400 880 700 960 T 980 900',
    'M 160 1100 Q 440 960 720 1040 T 1000 990',
    'M 100 940 Q 380 810 680 880 T 960 820',
  ];
  return (
    <AbsoluteFill style={fill}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {paths.map((d, i) => {
          const q = (((frame - i * 6) % 150) + 150) % 150 / 150;
          const head = interpolate(q, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
          const tail = interpolate(q, [0.1, 0.35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const seg = Math.max(0, head - tail);
          return (
            <path
              key={i}
              d={d}
              pathLength={1}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${seg} 2`}
              strokeDashoffset={-tail}
              opacity={q < 0.4 ? 1 - q * 1.6 : 0}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      ...fill,
      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
    }}
  />
);

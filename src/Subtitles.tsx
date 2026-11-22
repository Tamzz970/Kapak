import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {scenes, TOTAL_SECONDS} from './scenesConfig';

export type Cue = {start: number; end: number; text: string};

const toSec = (t: string) => {
  const m = t.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, '0')) / 1000;
};

export const parseSrt = (raw: string): Cue[] => {
  const cues: Cue[] = [];
  for (const block of raw.replace(/\r/g, '').split(/\n\s*\n/)) {
    const lines = block.trim().split('\n');
    const ti = lines.findIndex((l) => l.includes('-->'));
    if (ti < 0) continue;
    const [a, b] = lines[ti].split('-->');
    const text = lines.slice(ti + 1).join(' ').trim();
    if (text) cues.push({start: toSec(a), end: toSec(b), text});
  }
  return cues;
};

// Cadangan: pakai teks narasi per adegan jika public/subtitles.srt tidak ada.
const fallbackCues: Cue[] = scenes.map((s, i) => ({
  start: s.from / 60,
  end: i === scenes.length - 1 ? TOTAL_SECONDS : scenes[i + 1].from / 60,
  text: s.text,
}));

/** Cek file opsional di /public (tahan terhadap fallback index.html dev server). */
export const useOptionalFile = (file: string): {ready: boolean; text: string | null; exists: boolean} => {
  const [handle] = useState(() => delayRender(`optional:${file}`));
  const [state, setState] = useState<{ready: boolean; text: string | null; exists: boolean}>({
    ready: false,
    text: null,
    exists: false,
  });
  useEffect(() => {
    const isText = file.endsWith('.srt');
    fetch(staticFile(file))
      .then(async (r) => {
        const ct = r.headers.get('content-type') || '';
        const ok = r.ok && !ct.includes('text/html');
        setState({ready: true, exists: ok, text: ok && isText ? await r.text() : null});
      })
      .catch(() => setState({ready: true, exists: false, text: null}))
      .finally(() => continueRender(handle));
  }, [file, handle]);
  return state;
};

export const Subtitles: React.FC<{srt: string | null}> = ({srt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const parsed = React.useMemo(() => (srt ? parseSrt(srt) : []), [srt]);
  const cues = parsed.length > 0 ? parsed : fallbackCues;

  const t = frame / fps;
  const cue = cues.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;

  const local = frame - Math.round(cue.start * fps);
  const pop = spring({frame: local, fps, config: {damping: 13, stiffness: 180, mass: 0.6}});
  const endF = Math.round(cue.end * fps);
  const fadeOut = interpolate(frame, [endF - 5, endF], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginBottom: 290,
          padding: '0 70px',
          textAlign: 'center',
          fontFamily: '"Liberation Sans", Arial, Helvetica, sans-serif',
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1.25,
          color: '#fff',
          WebkitTextStroke: '10px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 4px 14px rgba(0,0,0,0.6)',
          opacity: fadeOut * Math.min(1, pop),
          transform: `translateY(${(1 - pop) * 24}px) scale(${0.92 + 0.08 * pop})`,
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};

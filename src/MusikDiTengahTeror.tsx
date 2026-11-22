import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneItem} from './SceneItem';
import {Subtitles, useOptionalFile} from './Subtitles';
import {OVERLAP_FRAMES, scenes} from './scenesConfig';

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 20, fps, config: {damping: 11, stiffness: 110, mass: 0.8}});
  const out = interpolate(frame, [240, 290], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  if (frame > 300) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginTop: 190,
          textAlign: 'center',
          opacity: Math.min(1, pop) * out,
          transform: `translateY(${(1 - pop) * -30}px) scale(${0.9 + 0.1 * pop})`,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, "Liberation Serif", serif',
            fontWeight: 700,
            fontSize: 92,
            letterSpacing: 4,
            color: '#ffd9a0',
            textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 0 30px rgba(255,170,70,0.5)',
          }}
        >
          MUSIK DI TENGAH TEROR
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: 'Georgia, "Liberation Serif", serif',
            fontSize: 42,
            letterSpacing: 8,
            color: '#fff',
            textShadow: '0 3px 14px rgba(0,0,0,0.9)',
          }}
        >
          NEW ORLEANS · 1919
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MusikDiTengahTeror: React.FC = () => {
  const audio = useOptionalFile('narasi.mp3'); // opsional
  const srt = useOptionalFile('subtitles.srt'); // opsional

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {scenes.map((s, i) => {
        const isLast = i === scenes.length - 1;
        const length = s.durationInFrames + (isLast ? 0 : OVERLAP_FRAMES);
        return (
          <Sequence key={s.n} from={s.from} durationInFrames={length} premountFor={60}>
            <SceneItem scene={s} length={length} isFirst={i === 0} isLast={isLast} />
          </Sequence>
        );
      })}
      <TitleCard />
      <Subtitles srt={srt.text} />
      {audio.exists ? <Audio src={staticFile('narasi.mp3')} /> : null}
    </AbsoluteFill>
  );
};

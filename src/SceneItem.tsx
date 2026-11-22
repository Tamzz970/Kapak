import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CAMERAS, OVERLAP_FRAMES, SceneConfig} from './scenesConfig';
import {Dawn, Dust, Fog, Lamp, NightTint, Notes, Streaks, Vignette, WindowGlows} from './effects';

const camEase = Easing.bezier(0.45, 0.05, 0.25, 1); // easing halus kamera

// Osilasi teredam: dasar squash & stretch / follow-through.
const damped = (t: number, decay: number, freq: number) =>
  t >= 0 && t < 2 ? Math.exp(-decay * t) * Math.cos(freq * t) : 0;

const periodicImpulse = (frame: number, period: number, amp: number, decay: number, freq: number) => {
  const k = Math.floor(frame / period);
  let s = 0;
  for (let j = k - 1; j <= k; j++) {
    if (j >= 0) s += damped((frame - j * period) / 60, decay, freq);
  }
  return s * amp;
};

type Props = {scene: SceneConfig; length: number; isFirst: boolean; isLast: boolean};

export const SceneItem: React.FC<Props> = ({scene, length, isFirst, isLast}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fx = new Set(scene.fx);
  const cam = CAMERAS[scene.camera];

  // --- Kamera: easing zoom/pan + napas halus (floating)
  const p = interpolate(frame, [0, length], [0, 1], {easing: camEase, extrapolateRight: 'clamp'});
  const lerp = (r: [number, number]) => r[0] + (r[1] - r[0]) * p;
  const breathe = 1 + 0.004 * Math.sin(frame / 50);
  const scale = lerp(cam.scale) * breathe;

  // --- Spring entrance (pantulan saat adegan muncul)
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 90, mass: 0.9}});
  const entry = 1 + 0.045 * (1 - pop);

  // --- Follow-through: ayunan mantel/selendang/tali, fase susulan + settle di awal
  const sway = fx.has('sway');
  const rot = sway
    ? 0.45 * Math.sin(frame / 38) + 0.3 * Math.sin((frame - 14) / 23) + 1.1 * damped(frame / 60, 4, 9)
    : 0.12 * Math.sin(frame / 60);

  // --- Squash & stretch (volume terjaga) + sprite beat (terkuantisasi 12 fps)
  let s = 0;
  if (fx.has('squash')) {
    s += 0.03 * damped((frame - 6) / 60, 5.5, 13);
    s += periodicImpulse(Math.max(0, frame - 60), 110, 0.012, 6, 13);
  }
  if (fx.has('beat')) {
    const fs = Math.floor(frame / 5) * 5; // sprite: ganti pose tiap 5 frame
    const period = Math.round(3600 / (scene.bpm ?? 100));
    s += periodicImpulse(fs, period, 0.022, 7, 16);
  }
  const sx = 1 - s * 0.7;
  const sy = 1 + s;

  // --- Motion trail: ghost mengikuti gestur cepat
  const trail = fx.has('trail');
  const gesture = (f: number) => {
    const env = 0.5 + 0.5 * Math.sin(f / 40);
    return 30 * Math.sin(f / 7) * env * 0.4;
  };

  // --- Transisi: crossfade (adegan berikut menimpa), fade-out di akhir
  const fadeIn = isFirst
    ? interpolate(frame, [0, 45], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})
    : interpolate(frame, [0, OVERLAP_FRAMES], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const fadeOut = isLast
    ? interpolate(frame, [length - 90, length], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;

  const src = staticFile(`scenes/${scene.file}`);
  const imgStyle: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover'};

  return (
    <AbsoluteFill style={{opacity: fadeIn * fadeOut, backgroundColor: '#000'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${lerp(cam.x)}px, ${lerp(cam.y)}px) rotate(${rot}deg) scale(${scale * entry})`,
          transformOrigin: '50% 60%',
        }}
      >
        <AbsoluteFill style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 85%'}}>
          <AbsoluteFill style={{transform: `translateX(${trail ? gesture(frame) : 0}px)`}}>
            <Img src={src} style={imgStyle} />
          </AbsoluteFill>
          {trail
            ? [1, 2, 3].map((k) => (
                <AbsoluteFill
                  key={k}
                  style={{opacity: [0, 0.14, 0.09, 0.05][k], transform: `translateX(${gesture(frame - k * 3)}px)`}}
                >
                  <Img src={src} style={imgStyle} />
                </AbsoluteFill>
              ))
            : null}
        </AbsoluteFill>
      </AbsoluteFill>

      {fx.has('blueFog') ? <NightTint /> : null}
      {fx.has('fog') || fx.has('blueFog') ? <Fog tint={fx.has('blueFog') ? '150,175,215' : '200,210,225'} /> : null}
      {fx.has('lamp') ? <Lamp x={scene.lamp?.x} y={scene.lamp?.y} /> : null}
      {fx.has('windows') ? <WindowGlows /> : null}
      {fx.has('dust') ? <Dust /> : null}
      {fx.has('notes') ? <Notes color={scene.noteColor} /> : null}
      {trail ? <Streaks /> : null}
      {fx.has('dawn') ? <Dawn /> : null}
      {fx.has('vignette') ? <Vignette /> : null}
    </AbsoluteFill>
  );
};

import React from 'react';
import {Composition} from 'remotion';
import {MusikDiTengahTeror} from './MusikDiTengahTeror';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './scenesConfig';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MusikDiTengahTeror"
      component={MusikDiTengahTeror}
      durationInFrames={TOTAL_FRAMES} // 11.820 frames = 197 dtk @ 60 fps
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};

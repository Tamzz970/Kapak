import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
// Waktu tunggu lebih longgar untuk memuat 31 gambar besar + fetch aset opsional
Config.setDelayRenderTimeoutInMilliseconds(120000);

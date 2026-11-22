# Musik di Tengah Teror (Remotion, 1080x1920 @ 60 fps, 11.820 frame)

## Aset yang harus ditaruh
- `public/scenes/01.png` … `31.png`  (wajib)
- `public/narasi.mp3`  (opsional) ← ganti nama dari `kapak_pembunuh.mp3`
- `public/subtitles.srt` (opsional) ← ganti nama dari `kapak pembunuh.txt`
  (jika tidak ada, subtitle cadangan dibuat dari teks di `src/scenesConfig.ts`)

## Jalankan
```bash
npm install
npm start          # Remotion Studio (pratinjau)
npm run render     # -> out/musik-di-tengah-teror.mp4
```

## GitHub Actions
Push ke repo → workflow `Render video` → unduh artifact `musik-di-tengah-teror`.
Untuk memperbarui versi Remotion: `npx remotion upgrade`.

## Mengubah efek
Edit `src/scenesConfig.ts`: tiap adegan punya `camera` (zoom/pan) dan `fx`
(`fog, blueFog, lamp, windows, notes, dust, dawn, squash, beat, sway, trail, vignette`).

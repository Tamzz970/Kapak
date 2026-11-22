// Konfigurasi 31 adegan. Waktu mulai (detik) diambil dari subtitle SRT (narasi.mp3).
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_SECONDS = 197; // 3:17
export const TOTAL_FRAMES = TOTAL_SECONDS * FPS; // 11.820
export const OVERLAP_FRAMES = 18; // crossfade antar adegan (0,3 dtk)

export type Fx =
  | 'fog' // kabut melayang (floating)
  | 'blueFog' // kabut biru-abu malam + tint
  | 'lamp' // cahaya lampu minyak/gas berkedip
  | 'windows' // cahaya jendela menyala bergiliran (stagger)
  | 'notes' // note musik melayang (stagger + floating)
  | 'dust' // partikel debu cahaya melayang
  | 'dawn' // cahaya fajar peach/biru
  | 'squash' // squash & stretch reaksi/penekanan bicara
  | 'beat' // sprite ritme: squash terkuantisasi 12 fps (tepuk/tiup/denyut)
  | 'sway' // follow-through: ayunan mantel/selendang/tali
  | 'trail' // motion trail gestur cepat
  | 'vignette';

export type CameraKey =
  | 'pushIn'
  | 'pushInStrong'
  | 'pullOut'
  | 'panL'
  | 'panR'
  | 'panUp'
  | 'panDown'
  | 'drift';

// scale selalu >= 1.10 supaya pan/sway tidak memperlihatkan tepi gambar.
export const CAMERAS: Record<
  CameraKey,
  {scale: [number, number]; x: [number, number]; y: [number, number]}
> = {
  pushIn: {scale: [1.1, 1.24], x: [0, 0], y: [0, -24]},
  pushInStrong: {scale: [1.12, 1.32], x: [0, 0], y: [10, -30]},
  pullOut: {scale: [1.26, 1.1], x: [0, 0], y: [-20, 0]},
  panL: {scale: [1.14, 1.14], x: [38, -38], y: [0, 0]},
  panR: {scale: [1.14, 1.14], x: [-38, 38], y: [0, 0]},
  panUp: {scale: [1.14, 1.14], x: [0, 0], y: [40, -40]},
  panDown: {scale: [1.14, 1.14], x: [0, 0], y: [-40, 40]},
  drift: {scale: [1.12, 1.2], x: [18, -14], y: [10, -16]},
};

type Def = {
  start: number; // detik
  speaker: string;
  text: string;
  camera: CameraKey;
  fx: Fx[];
  bpm?: number; // untuk fx 'beat'
  lamp?: {x: number; y: number}; // posisi cahaya (% layar)
  noteColor?: string;
};

const DEFS: Def[] = [
  {start: 0, speaker: 'Narator', text: 'New Orleans, Maret 1919. Kota ini dilanda ketakutan besar akibat sosok misterius bernama Pria Kapak.', camera: 'pushIn', fx: ['blueFog', 'fog', 'lamp', 'sway', 'vignette'], lamp: {x: 50, y: 55}},
  {start: 11, speaker: 'Narator', text: 'Di sebuah apartemen kecil di atas toko roti, lampu minyak menyala redup. Di luar, bayangan malam membayangi jalanan berbatu yang lengang.', camera: 'panR', fx: ['lamp', 'dust', 'vignette'], lamp: {x: 40, y: 50}},
  {start: 24, speaker: 'Clara', text: 'Kau yakin ini ide bagus, Marco? Kita menyalakan musik di tengah malam.', camera: 'pushIn', fx: ['lamp', 'squash', 'sway', 'vignette'], lamp: {x: 70, y: 35}},
  {start: 30, speaker: 'Marco', text: 'Menurut koran ini, rumah yang memainkan musik jazz akan aman.', camera: 'drift', fx: ['lamp', 'squash', 'vignette'], lamp: {x: 30, y: 40}},
  {start: 34, speaker: 'Clara', text: 'Bagaimana kalau itu jebakan? Atau malah memberitahu posisi kita?', camera: 'pushInStrong', fx: ['lamp', 'squash', 'vignette'], lamp: {x: 70, y: 35}},
  {start: 37, speaker: 'Marco', text: 'Kita sudah terlalu lama takut. Musik adalah cara melawan kepanikan.', camera: 'pushIn', fx: ['lamp', 'squash', 'vignette'], lamp: {x: 50, y: 30}},
  {start: 42, speaker: 'Tommy', text: 'Nona Clara, koran edisi malam baru datang. Semua orang membicarakan surat itu. Katanya jam 00.15. Tidak boleh ada rumah yang sunyi malam ini.', camera: 'panL', fx: ['squash', 'trail', 'sway', 'lamp', 'vignette'], lamp: {x: 55, y: 40}},
  {start: 51, speaker: 'Clara', text: 'Terima kasih, Tommy. Cepat pulang dan tutup pintu rapat-rapat.', camera: 'panR', fx: ['trail', 'sway', 'lamp', 'vignette'], lamp: {x: 50, y: 35}},
  {start: 54, speaker: 'Marco', text: 'Kalau satu rumah berani membunyikan musik, tetangga sebelah pasti ikut menyahut. Lalu rumah di ujung jalan akan ikut meniup trompet.', camera: 'panUp', fx: ['lamp', 'sway', 'notes', 'vignette'], lamp: {x: 35, y: 40}},
  {start: 62, speaker: 'Narator', text: 'Pukul 23 lewat 30, kabut tipis turun di jalanan berbatu.', camera: 'pullOut', fx: ['blueFog', 'fog', 'lamp', 'vignette'], lamp: {x: 30, y: 38}},
  {start: 67, speaker: 'Detektif Miller', text: 'Gila, kota ini benar-benar nekat. Mereka mempercayai surat misterius yang belum tentu asli.', camera: 'panR', fx: ['fog', 'sway', 'lamp', 'vignette'], lamp: {x: 65, y: 30}},
  {start: 73, speaker: 'Patrolman Reid', text: 'Detektif, di blok 3 ada suara klarinet. Dan di dekat pelabuhan, warga mulai membuka jendela mereka.', camera: 'panL', fx: ['fog', 'trail', 'squash', 'windows', 'vignette']},
  {start: 78, speaker: 'Detektif Miller', text: 'Tetap awasi gang gelap. Ini bisa saja taktik pelaku.', camera: 'pushIn', fx: ['fog', 'lamp', 'vignette'], lamp: {x: 55, y: 55}},
  {start: 81, speaker: 'Patrolman Reid', text: 'Tapi anehnya, Pak, sampai jam segini belum ada laporan serangan.', camera: 'drift', fx: ['windows', 'notes', 'fog', 'vignette']},
  {start: 87, speaker: 'Pastor Julian', text: 'Ketakutan membuat kita mengunci diri di balik pintu. Malam ini, musik membuat kota ini saling mendengar lagi. Ketika banyak suara menyatu, ketakutan kehilangan ruang.', camera: 'pushIn', fx: ['lamp', 'sway', 'windows', 'vignette'], lamp: {x: 50, y: 35}},
  {start: 98, speaker: 'Ibu Elena', text: 'Hei, siapapun di luar sana. Piano kami sudah menyala. Ayo ikut bernyanyi. Malam ini, kita tidak akan bersembunyi di dalam gelap.', camera: 'pullOut', fx: ['windows', 'notes', 'trail', 'sway', 'beat', 'vignette'], bpm: 96},
  {start: 106, speaker: 'Narator', text: 'Pukul 00.12, 3 menit menjelang tengah malam.', camera: 'pushIn', fx: ['lamp', 'beat', 'vignette'], bpm: 60, lamp: {x: 50, y: 45}},
  {start: 111, speaker: 'Clara', text: 'Tiga menit lagi, Marco. Kamu yakin semuanya akan baik-baik saja? Jantungku berdebar kencang sejak tadi malam.', camera: 'drift', fx: ['lamp', 'sway', 'beat', 'vignette'], bpm: 90, lamp: {x: 65, y: 35}},
  {start: 119, speaker: 'Marco', text: 'Tarik nafas pelan. Aku tidak bisa main piano, tapi aku bisa ikut bertepuk tangan.', camera: 'drift', fx: ['lamp', 'beat', 'sway', 'vignette'], bpm: 100, lamp: {x: 40, y: 40}},
  {start: 126, speaker: 'Narator', text: 'Sebentar lagi, jam berdentang. Jam berdentang menandakan pukul 00.15. Marco meniupkan nada pertama seksofonnya. Hangat dan mengalir memenuhi ruangan.', camera: 'pushIn', fx: ['notes', 'squash', 'beat', 'lamp', 'windows', 'vignette'], bpm: 84, lamp: {x: 50, y: 45}},
  {start: 137, speaker: 'Clara', text: 'Dengar itu! Suaranya terdengar sampai ke jalan!', camera: 'pushIn', fx: ['beat', 'notes', 'lamp', 'vignette'], bpm: 112, lamp: {x: 50, y: 40}},
  {start: 140, speaker: 'Marco', text: 'Ikuti ketukannya, Clara. Biarkan iramanya mengalir.', camera: 'panR', fx: ['beat', 'notes', 'sway', 'lamp', 'vignette'], bpm: 112},
  {start: 143, speaker: 'Ibu Elena', text: 'Teruskan musiknya. Seluruh blok ini ikut menari.', camera: 'panUp', fx: ['windows', 'notes', 'beat', 'sway', 'vignette'], bpm: 112},
  {start: 147, speaker: 'Tommy', text: 'Lihat di ujung jalan. Orang-orang membuka jendela semua.', camera: 'drift', fx: ['windows', 'notes', 'trail', 'sway', 'vignette']},
  {start: 151, speaker: 'Clara', text: 'Lihat itu, Marco. Seluruh jalan ini hidup.', camera: 'pushIn', fx: ['windows', 'notes', 'sway', 'dust', 'vignette']},
  {start: 154, speaker: 'Marco', text: 'Tidak ada kapak yang bisa mengalahkan irama yang dimainkan bersama.', camera: 'pushInStrong', fx: ['lamp', 'notes', 'squash', 'vignette'], lamp: {x: 50, y: 35}},
  {start: 158, speaker: 'Narator', text: 'Di ujung jalan yang gelap, sesosok bayangan berhenti mendengarkan. Bayangan itu berdiri diam di tengah alunan musik yang ramai. Lalu perlahan berbalik dan menghilang ke dalam kabut malam.', camera: 'pushIn', fx: ['blueFog', 'fog', 'trail', 'sway', 'vignette']},
  {start: 170, speaker: 'Pastor Julian', text: 'Malam ini, kota ini memilih untuk tidak tunduk pada rasa takut.', camera: 'drift', fx: ['windows', 'lamp', 'sway', 'vignette'], lamp: {x: 50, y: 30}},
  {start: 175, speaker: 'Detektif Miller', text: 'Anehnya malam ini, tidak ada satupun korban jatuh.', camera: 'panL', fx: ['dawn', 'squash', 'notes', 'sway'], noteColor: '#ffe3b0'},
  {start: 178, speaker: 'Patrolman Reid', text: 'Seluruh kota penuh musik sampai pagi menjelang.', camera: 'pullOut', fx: ['dawn', 'notes'], noteColor: '#ffe3b0'},
  {start: 181, speaker: 'Narator', text: 'Pada malam 18 hingga 19 Maret 1919, New Orleans dipenuhi musik jazz. Pada malam itulah rentetan serangan misterius berhenti. Identitas pria kapak tak pernah terungkap, meninggalkan kisah ganjil sepanjang sejarah.', camera: 'pullOut', fx: ['dawn', 'notes', 'dust'], noteColor: '#fff0cf'},
];

export type SceneConfig = Def & {
  n: number; // 1..31
  file: string; // "01.png"
  from: number; // frame awal
  durationInFrames: number;
};

export const scenes: SceneConfig[] = DEFS.map((d, i) => {
  const from = Math.round(d.start * FPS);
  const to =
    i === DEFS.length - 1 ? TOTAL_FRAMES : Math.round(DEFS[i + 1].start * FPS);
  return {
    ...d,
    n: i + 1,
    file: `${String(i + 1).padStart(2, '0')}.png`,
    from,
    durationInFrames: to - from,
  };
});

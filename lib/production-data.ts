// Şah RES (105 MW) için TEMSİLİ saatlik seri (7 gün).
// Gerçek ön çalışma çıktısı (EPİAŞ gerçekleşen üretim, KGÜP ve model tahmini) hazır olduğunda
// bu dosyayı o veriyle değiştirin; bileşenler yalnızca `ProductionPoint[]` şeklini bekler.

export type ProductionPoint = {
  label: string;
  actual: number;
  forecast: number;
  plan: number;
};

export type Range = 24 | 48 | 168;

export const CAPACITY_MW = 105;

// Deterministik PRNG — sunucu ve istemci aynı seriyi üretir (hydration uyumsuzluğu olmaz).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const clamp = (v: number) => Math.max(0, Math.min(CAPACITY_MW, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

function build(hours: number): ProductionPoint[] {
  const rand = mulberry32(491);
  const points: ProductionPoint[] = [];
  let forecastBias = 0;
  let planBias = 0;

  for (let h = 0; h < hours; h++) {
    const wind =
      58 + 28 * Math.sin(h / 6.5) + 14 * Math.sin(h / 2.7 + 1.3) + 10 * Math.sin(h / 31) + (rand() - 0.5) * 14;
    // Son gün öğleden sonra kısa bir kısıt/arıza düşüşü
    const curtail = h >= 158 && h <= 161 ? 0.45 : 1;
    const actual = clamp(wind * curtail);

    forecastBias = forecastBias * 0.75 + (rand() - 0.5) * 9;
    planBias = planBias * 0.6 + (rand() - 0.5) * 6;
    const forecast = clamp(wind * (curtail < 1 ? 0.8 : 1) + forecastBias);
    const plan = clamp(actual + planBias);

    const day = WEEKDAYS[Math.floor(h / 24)];
    const hh = String(h % 24).padStart(2, "0");
    points.push({
      label: `${day} ${hh}:00`,
      actual: round1(actual),
      forecast: round1(forecast),
      plan: round1(plan),
    });
  }
  return points;
}

const week = build(168);

export const productionData: Record<Range, ProductionPoint[]> = {
  24: week.slice(-24),
  48: week.slice(-48),
  168: week,
};

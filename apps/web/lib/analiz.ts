/**
 * Öğrencinin cevap kayıtlarından öğretmen için özet çıkarır. Saf fonksiyonlar (test edilebilir).
 * Saatler Türkiye saatine göre gün gün gruplanır.
 */
import { UNITELER } from "@ti/icerik";

export interface CevapSatiri {
  kaynak: string;
  kural?: string | null;
  dogru: boolean;
  soru?: string | null;
  cevap?: string | null;
  beklenen?: string | null;
  zaman: string;
  ders?: string | null;
  sure_ms?: number | null;
}

const TR_SAAT = 3 * 3600_000;
/** "2026-11-14" (Türkiye saati) */
export const gunAnahtari = (iso: string | number | Date) => new Date(new Date(iso).getTime() + TR_SAAT).toISOString().slice(0, 10);

export interface GunSayisi {
  gun: string;
  toplam: number;
  dogru: number;
}

/** Son n günün her günü için cevap sayısı (boş günler dahil, eskiden yeniye) */
export function gunluk(c: CevapSatiri[], n: number, simdi = Date.now()): GunSayisi[] {
  const m = new Map<string, GunSayisi>();
  for (let i = n - 1; i >= 0; i--) {
    const g = gunAnahtari(simdi - i * 86400_000);
    m.set(g, { gun: g, toplam: 0, dogru: 0 });
  }
  for (const x of c) {
    const s = m.get(gunAnahtari(x.zaman));
    if (s) {
      s.toplam++;
      if (x.dogru) s.dogru++;
    }
  }
  return [...m.values()];
}

/**
 * Seri: bugünden (bugün çalışmadıysa dünden) geriye kesintisiz çalışılan gün sayısı.
 * Pazar günü çalışılmaması seriyi bozmaz (prototipteki kural).
 */
export function seri(c: CevapSatiri[], simdi = Date.now()): number {
  const gunler = new Set(c.map((x) => gunAnahtari(x.zaman)));
  let n = 0;
  let i = gunler.has(gunAnahtari(simdi)) ? 0 : 1;
  for (; i < 400; i++) {
    const t = simdi - i * 86400_000;
    const g = gunAnahtari(t);
    if (gunler.has(g)) n++;
    else if (new Date(t + TR_SAAT).getUTCDay() === 0) continue; // pazar
    else break;
  }
  return n;
}

/**
 * Yaklaşık çalışma süresi (dakika). Ardışık iki cevap arası 5 dakikadan kısaysa çalışmaya sayılır;
 * her oturumun ilk cevabına 30 saniye eklenir. Kesin değil, eğilimi gösterir.
 */
export function tahminiDakika(c: CevapSatiri[]): number {
  const t = c.map((x) => new Date(x.zaman).getTime()).sort((a, b) => a - b);
  let ms = 0;
  for (let i = 0; i < t.length; i++) {
    const ara = i ? t[i] - t[i - 1] : Infinity;
    ms += ara <= 5 * 60_000 ? ara : 30_000;
  }
  return Math.round(ms / 60_000);
}

export const KAYNAK_AD: Record<string, string> = {
  ders: "Ders",
  alistirma: "Alıştırma",
  test: "Test",
  tekrar: "Tekrar kartları",
  oyun: "Oyun",
  yol: "Cümle yolu",
  motor: "Serbest cümle",
};

export interface KaynakOzeti {
  kaynak: string;
  ad: string;
  toplam: number;
  dogru: number;
}

export function kaynaklar(c: CevapSatiri[]): KaynakOzeti[] {
  const m = new Map<string, KaynakOzeti>();
  for (const x of c) {
    const s = m.get(x.kaynak) ?? { kaynak: x.kaynak, ad: KAYNAK_AD[x.kaynak] ?? x.kaynak, toplam: 0, dogru: 0 };
    s.toplam++;
    if (x.dogru) s.dogru++;
    m.set(x.kaynak, s);
  }
  return [...m.values()].sort((a, b) => b.toplam - a.toplam);
}

export interface DersDurumu {
  kod: string;
  etiket: string; // "1.2"
  baslik: string;
  tekrar: boolean;
  cevap: number;
  dogru: number;
  testDogru: number;
  testToplam: number;
  testSoru: number;
  son: string | null;
}

/** Ders ders: kaç soru çözdü, doğru oranı, testte ne yaptı */
export function dersler(c: CevapSatiri[]): DersDurumu[] {
  const out: DersDurumu[] = [];
  for (const u of UNITELER)
    for (const d of u.dersler) {
      const x = c.filter((y) => y.ders === d.kod);
      const t = x.filter((y) => y.kaynak === "test");
      out.push({
        kod: d.kod,
        etiket: `${u.sira}.${d.no}`,
        baslik: d.baslik,
        tekrar: !!d.tekrar,
        cevap: x.length,
        dogru: x.filter((y) => y.dogru).length,
        testDogru: t.filter((y) => y.dogru).length,
        testToplam: t.length,
        testSoru: d.test.length,
        son: x.length ? x.map((y) => y.zaman).sort().at(-1)! : null,
      });
    }
  return out;
}

export interface ZorKelime {
  en: string;
  tr: string;
  hata: number;
}

/** Kartlarda, oyunlarda ve alıştırmalarda en çok bilemediği kelimeler */
export function zorKelimeler(c: CevapSatiri[], n = 8): ZorKelime[] {
  const m = new Map<string, ZorKelime>();
  for (const x of c) {
    if (x.dogru || !["tekrar", "oyun"].includes(x.kaynak) || x.kural) continue;
    // Tekrar: soru=TR, beklenen=EN (ya da tersi). Oyun: soru=EN, beklenen=TR.
    const [a, b] = [x.soru ?? "", x.beklenen ?? ""];
    const enMi = (s: string) => /^[\x00-\x7F]+$/.test(s);
    const en = enMi(a) && !enMi(b) ? a : b;
    const tr = en === a ? b : a;
    if (!en) continue;
    const s = m.get(en) ?? { en, tr, hata: 0 };
    s.hata++;
    m.set(en, s);
  }
  return [...m.values()].sort((a, b) => b.hata - a.hata).slice(0, n);
}

export interface KartOzeti {
  toplam: number;
  ogrenildi: number;
  bugun: number;
  kutular: number[]; // 0..5
}

export function kartOzeti(k: { kutu: number; sonraki: string }[], simdi = Date.now()): KartOzeti {
  const bugun = gunAnahtari(simdi);
  const kutular = [0, 0, 0, 0, 0, 0];
  k.forEach((x) => kutular[Math.max(0, Math.min(5, x.kutu))]++);
  return {
    toplam: k.length,
    ogrenildi: k.filter((x) => x.kutu >= 3).length,
    bugun: k.filter((x) => x.sonraki <= bugun).length,
    kutular,
  };
}

/** Yaş (doğum tarihinden) */
export function yas(dogum: string | null | undefined, simdi = new Date()): number | null {
  if (!dogum) return null;
  const d = new Date(dogum);
  let y = simdi.getFullYear() - d.getFullYear();
  if (simdi.getMonth() < d.getMonth() || (simdi.getMonth() === d.getMonth() && simdi.getDate() < d.getDate())) y--;
  return y;
}

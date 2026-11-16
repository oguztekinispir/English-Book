/**
 * Seri (aralıksız çalışılan gün sayısı) ve günlük hedef hesapları. Sunucuda da tarayıcıda da çalışır.
 * Günler Türkiye saatine göre sayılır: gece 00.30'da çözülen kart yeni günün sayılır.
 * Pazar dinlenme günüdür: çalışılmayan pazar seriyi bozmaz (öğretmen ekranındaki seri ile aynı kural).
 */

export const HEDEFLER = [
  { adet: 10, ad: "Hafif", aciklama: "Günde yaklaşık 5 dakika" },
  { adet: 20, ad: "Normal", aciklama: "Günde yaklaşık 10 dakika" },
  { adet: 40, ad: "Yoğun", aciklama: "Günde yaklaşık 20 dakika" },
] as const;
export const VARSAYILAN_HEDEF = 20;

const BICIM = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" });

/** ISO zaman ya da Date → Türkiye saatine göre "YYYY-AA-GG" */
export const gunAnahtari = (t: string | Date): string => BICIM.format(typeof t === "string" ? new Date(t) : t);

/** "YYYY-AA-GG" günün n gün öncesi */
export function gunOnce(gun: string, n: number): string {
  const d = new Date(gun + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export interface GunOzeti {
  gun: string;
  adet: number;
}

export interface SeriBilgisi {
  /** Aralıksız çalışılan gün sayısı (bugün henüz çalışmadıysa dünden geriye) */
  seri: number;
  /** Bugün çalıştı mı */
  bugunVar: boolean;
  /** Bugünkü cevap sayısı */
  bugunAdet: number;
  /** Son 7 gün, eskiden yeniye */
  son7: GunOzeti[];
  /** Şimdiye kadarki en uzun seri (bakılan aralıkta) */
  enUzun: number;
}

/** Cevap zamanlarından seri bilgisi. bugun verilmezse şu an. */
export function seriHesapla(zamanlar: string[], bugun: string = gunAnahtari(new Date())): SeriBilgisi {
  const say = new Map<string, number>();
  for (const z of zamanlar) {
    const g = gunAnahtari(z);
    say.set(g, (say.get(g) ?? 0) + 1);
  }
  const bugunAdet = say.get(bugun) ?? 0;
  const pazar = (g: string) => new Date(g + "T12:00:00Z").getUTCDay() === 0;
  let seri = 0;
  for (let i = bugunAdet ? 0 : 1; i < 400; i++) {
    const g = gunOnce(bugun, i);
    if (say.has(g)) seri++;
    else if (!pazar(g)) break;
  }

  // En uzun seri: çalışılan günleri sırayla gez; arada sadece pazar boşluğu varsa seri sürer
  let enUzun = 0;
  const gunler = [...say.keys()].sort();
  let sira = 0;
  for (let i = 0; i < gunler.length; i++) {
    const bitisik = i > 0 && (gunOnce(gunler[i], 1) === gunler[i - 1] || (gunOnce(gunler[i], 2) === gunler[i - 1] && pazar(gunOnce(gunler[i], 1))));
    sira = bitisik ? sira + 1 : 1;
    enUzun = Math.max(enUzun, sira);
  }

  const son7 = Array.from({ length: 7 }, (_, i) => {
    const g = gunOnce(bugun, 6 - i);
    return { gun: g, adet: say.get(g) ?? 0 };
  });
  return { seri, bugunVar: bugunAdet > 0, bugunAdet, son7, enUzun };
}

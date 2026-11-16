/**
 * Ödevler: öğretmenin verdiği görevler ve ilerlemesi. Saf fonksiyonlar; sunucuda da tarayıcıda da çalışır.
 * İlerleme, öğrencinin ödev verildikten sonraki cevap kayıtlarından hesaplanır; öğrencinin ayrıca bir düğmeye basması gerekmez.
 */
import { dersBul } from "@ti/icerik";
import { RULES } from "@ti/motor";
import type { CevapSatiri } from "./analiz";

export type OdevHedef =
  /** Dersin testini en az %80 doğruyla bitir */
  | { tur: "ders"; ders: string }
  /** n tekrar kartı çöz */
  | { tur: "tekrar"; adet: number }
  /** Bir kuraldan n doğru cümle kur */
  | { tur: "motor"; kural: string; adet: number };

export interface Odev {
  id: string;
  baslik: string;
  aciklama: string | null;
  hedef: OdevHedef;
  son_tarih: string | null;
  olusturma: string;
}

export interface OdevIlerleme {
  yapilan: number;
  gereken: number;
  bitti: boolean;
}

export const TEKRAR_ADETLERI = [10, 20, 30, 50];
export const MOTOR_ADETLERI = [10, 15, 20, 30];
/** Ders testinde geçme oranı */
export const DERS_GECME = 0.8;

/** Hedeften kısa başlık: "Ders 1.3 (Yaşlar)", "20 tekrar kartı" */
export function odevBasligi(h: OdevHedef): string {
  if (h.tur === "ders") {
    const b = dersBul(h.ders);
    return b ? `Ders ${b.u.sira}.${b.d.no} (${b.d.baslik})` : `Ders ${h.ders}`;
  }
  if (h.tur === "tekrar") return `${h.adet} tekrar kartı`;
  return `${h.adet} cümle: ${RULES[h.kural]?.t.split(":")[0] ?? h.kural}`;
}

/** Öğrenciye ne yapacağını söyleyen tek cümle */
export function odevTarifi(h: OdevHedef): string {
  if (h.tur === "ders") {
    const b = dersBul(h.ders);
    const n = b?.d.test.length ?? 0;
    return `Dersi çalış ve sondaki testte ${Math.ceil(n * DERS_GECME)} / ${n} doğru yap.`;
  }
  if (h.tur === "tekrar") return `Günlük tekrarda ${h.adet} kart çöz.`;
  const t = RULES[h.kural]?.t ?? h.kural;
  return `Pratik'te ${h.adet} doğru cümle kur (${t.split(": ")[1] ?? t} gibi).`;
}

/** Ödevi yapmak için gidilecek sayfa */
export function odevBaglantisi(h: OdevHedef): string {
  if (h.tur === "ders") {
    const b = dersBul(h.ders);
    return b ? `/uniteler/${b.u.kod}/${b.d.no}` : "/uniteler";
  }
  if (h.tur === "tekrar") return "/tekrar";
  return `/pratik?kural=${encodeURIComponent(h.kural)}`;
}

/** Ödev verildikten sonraki cevaplardan ilerleme. cevaplar tek öğrenciye ait olmalı. */
export function odevIlerleme(h: OdevHedef, olusturma: string, cevaplar: CevapSatiri[]): OdevIlerleme {
  const sonra = cevaplar.filter((c) => c.zaman >= olusturma);
  let yapilan = 0,
    gereken = 1;
  if (h.tur === "ders") {
    const n = dersBul(h.ders)?.d.test.length ?? 0;
    gereken = Math.max(1, Math.ceil(n * DERS_GECME));
    // Aynı soruyu birkaç kez doğru yapmak bir sayılır
    yapilan = new Set(sonra.filter((c) => c.kaynak === "test" && c.ders === h.ders && c.dogru).map((c) => c.soru)).size;
  } else if (h.tur === "tekrar") {
    gereken = h.adet;
    yapilan = sonra.filter((c) => c.kaynak === "tekrar").length;
  } else {
    gereken = h.adet;
    yapilan = sonra.filter((c) => c.kural === h.kural && c.dogru).length;
  }
  return { yapilan: Math.min(yapilan, gereken), gereken, bitti: yapilan >= gereken };
}

/** Son günü geçti mi (Türkiye saatiyle gün sonu) */
export function gecikti(son_tarih: string | null, simdi = Date.now()): boolean {
  if (!son_tarih) return false;
  return new Date(son_tarih + "T23:59:59+03:00").getTime() < simdi;
}

/** Hedef verisi geçerli mi (veritabanından gelen jsonb için) */
export function hedefGecerli(x: unknown): x is OdevHedef {
  const h = x as OdevHedef;
  if (!h || typeof h !== "object") return false;
  if (h.tur === "ders") return !!dersBul(h.ders);
  if (h.tur === "tekrar") return Number.isInteger(h.adet) && h.adet > 0 && h.adet <= 200;
  if (h.tur === "motor") return !!RULES[h.kural] && Number.isInteger(h.adet) && h.adet > 0 && h.adet <= 200;
  return false;
}

import type { Ders, Kelime, Unite, UniteTaslak } from "./tipler";
import { A1_01 } from "./a1/01-merhaba";

export * from "./tipler";
export * from "./sozluk";
export * from "./ekiBul";
export * from "./gramerRehberi";

/** A1 müfredatı: 14 ünite, ~50 ders. Yazılmış üniteler UNITELER'de, diğerleri taslak. */
export const A1_PLAN: UniteTaslak[] = [
  { kod: "a1-01", dersSayisi: 4, seviye: "A1", sira: 1, baslik: "Merhaba", baslikEn: "Hello", hedef: "Kendini tanıtırsın, yaşını ve nereli olduğunu söylersin.", gramerEtiketi: "I am, you are, he is" },
  { kod: "a1-02", dersSayisi: 4, seviye: "A1", sira: 2, baslik: "Ailem ve işim", baslikEn: "Family and work", hedef: "Aileni ve mesleğini anlatırsın.", gramerEtiketi: "is / are, olumsuz, soru, my / your" },
  { kod: "a1-03", dersSayisi: 3, seviye: "A1", sira: 3, baslik: "Nasılsın?", baslikEn: "How are you?", hedef: "Duygunu ve durumunu söylersin, renkleri bilirsin.", gramerEtiketi: "am / is / are tamamı, sıfatlar" },
  { kod: "a1-04", dersSayisi: 4, seviye: "A1", sira: 4, baslik: "Neyim var?", baslikEn: "What have you got?", hedef: "Eşyalarını ve vücudunu anlatırsın.", gramerEtiketi: "have got / has got, çoğul -s" },
  { kod: "a1-05", dersSayisi: 4, seviye: "A1", sira: 5, baslik: "Evim", baslikEn: "My home", hedef: "Evini ve eşyaların yerini anlatırsın.", gramerEtiketi: "there is / there are, in / on / under" },
  { kod: "a1-06", dersSayisi: 4, seviye: "A1", sira: 6, baslik: "Günüm", baslikEn: "My day", hedef: "Günlük rutinini anlatırsın, saati söylersin.", gramerEtiketi: "geniş zaman: I work" },
  { kod: "a1-07", dersSayisi: 3, seviye: "A1", sira: 7, baslik: "O ne yapar?", baslikEn: "What does she do?", hedef: "Başkasının gününü anlatırsın.", gramerEtiketi: "he works, always / never" },
  { kod: "a1-08", dersSayisi: 4, seviye: "A1", sira: 8, baslik: "Yemek ve içmek", baslikEn: "Food and drink", hedef: "Sevdiğini söylersin, sipariş verirsin.", gramerEtiketi: "like, don't, Do you…?" },
  { kod: "a1-09", dersSayisi: 3, seviye: "A1", sira: 9, baslik: "Yapabilirim", baslikEn: "I can", hedef: "Yeteneklerini ve hobilerini anlatırsın.", gramerEtiketi: "can / can't" },
  { kod: "a1-10", dersSayisi: 3, seviye: "A1", sira: 10, baslik: "Hava ve mevsimler", baslikEn: "Weather and seasons", hedef: "Havayı, ayları ve tarihi söylersin.", gramerEtiketi: "It's cold, in May, on Monday" },
  { kod: "a1-11", dersSayisi: 4, seviye: "A1", sira: 11, baslik: "Şehirde", baslikEn: "In the city", hedef: "Ulaşımı kullanır, yol sorar ve tarif edersin.", gramerEtiketi: "emir kipi, yer edatları" },
  { kod: "a1-12", dersSayisi: 4, seviye: "A1", sira: 12, baslik: "Alışveriş", baslikEn: "Shopping", hedef: "Kıyafet seçer, fiyat sorar, bir şey alırsın.", gramerEtiketi: "How much, this / that, I'd like" },
  { kod: "a1-13", dersSayisi: 3, seviye: "A1", sira: 13, baslik: "Şu an", baslikEn: "Right now", hedef: "Şu an ne yaptığını söylersin.", gramerEtiketi: "-ıyor: I am working" },
  { kod: "a1-14", dersSayisi: 4, seviye: "A1", sira: 14, baslik: "Dün", baslikEn: "Yesterday", hedef: "Dün ne yaptığını anlatırsın.", gramerEtiketi: "was / were, geçmiş zaman" },
];

/** Yazılmış (tam) üniteler, sırayla */
export const UNITELER: Unite[] = [A1_01];

export const uniteBul = (kod: string): Unite | undefined => UNITELER.find((u) => u.kod === kod);

/** "a1-01-2" → ünite ve ders */
export function dersBul(kod: string): { u: Unite; d: Ders } | undefined {
  for (const u of UNITELER) {
    const d = u.dersler.find((x) => x.kod === kod);
    if (d) return { u, d };
  }
}

export const dersKelimeleri = (d: Ders): Kelime[] => d.kelimeGruplari.flatMap((g) => g.kelimeler);

/** Ünitenin bütün kelimeleri, düz liste */
export const uniteKelimeleri = (u: Unite): Kelime[] => u.dersler.flatMap(dersKelimeleri);

/** Tekrar kartı: kelime ya da kalıp. id, veritabanındaki kelimeler.id ile aynı anahtardan üretilir. */
export interface Kart {
  /** "a1-01:hello" ya da "a1-01:kalip:How are you?" */
  anahtar: string;
  uniteKod: string;
  uniteSira: number;
  dersKod: string;
  tur: "kelime" | "kalip";
  en: string;
  tr: string;
  ok?: string;
  ornek?: [string, string];
  ipucu?: string;
}

export function tumKartlar(): Kart[] {
  const out: Kart[] = [];
  for (const u of UNITELER)
    for (const d of u.dersler) {
      for (const k of dersKelimeleri(d))
        out.push({ anahtar: `${u.kod}:${k.en}`, uniteKod: u.kod, uniteSira: u.sira, dersKod: d.kod, tur: "kelime", en: k.en, tr: k.tr, ok: k.ok, ornek: k.ornek, ipucu: k.ipucu });
      for (const k of d.kaliplar) out.push({ anahtar: `${u.kod}:kalip:${k.en}`, uniteKod: u.kod, uniteSira: u.sira, dersKod: d.kod, tur: "kalip", en: k.en, tr: k.tr });
    }
  return out;
}

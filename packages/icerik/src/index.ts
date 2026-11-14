import type { Unite, UniteTaslak } from "./tipler";
import { A1_01 } from "./a1/01-merhaba";

export * from "./tipler";
export * from "./sozluk";

/** A1 müfredatı: yazılmış üniteler tam, diğerleri taslak (sadece başlık ve hedef). */
export const A1_PLAN: UniteTaslak[] = [
  { kod: "a1-01", seviye: "A1", sira: 1, baslik: "Merhaba", baslikEn: "Hello", hedef: "Kendini tanıtırsın, adını ve nereli olduğunu söylersin.", gramerEtiketi: "I am, you are, he is" },
  { kod: "a1-02", seviye: "A1", sira: 2, baslik: "Ailem ve işim", baslikEn: "Family and work", hedef: "Aileni ve mesleğini anlatırsın.", gramerEtiketi: "is / are, olumsuz, soru, my / your" },
  { kod: "a1-03", seviye: "A1", sira: 3, baslik: "Nasılsın?", baslikEn: "How are you?", hedef: "Duygunu ve durumunu söylersin.", gramerEtiketi: "am / is / are, sıfatlar, renkler" },
  { kod: "a1-04", seviye: "A1", sira: 4, baslik: "Evim", baslikEn: "My home", hedef: "Evini ve eşyaların yerini anlatırsın.", gramerEtiketi: "there is / there are, in / on / under" },
  { kod: "a1-05", seviye: "A1", sira: 5, baslik: "Günüm", baslikEn: "My day", hedef: "Günlük rutinini anlatırsın, saati söylersin.", gramerEtiketi: "geniş zaman: I work" },
  { kod: "a1-06", seviye: "A1", sira: 6, baslik: "O ne yapar?", baslikEn: "What does she do?", hedef: "Başkasının gününü anlatırsın.", gramerEtiketi: "he works, always / never" },
  { kod: "a1-07", seviye: "A1", sira: 7, baslik: "Yemek ve içmek", baslikEn: "Food and drink", hedef: "Sevdiğini söylersin, sipariş verirsin.", gramerEtiketi: "like, don't, Do you…?" },
  { kod: "a1-08", seviye: "A1", sira: 8, baslik: "Yapabilirim", baslikEn: "I can", hedef: "Yeteneklerini ve hobilerini anlatırsın.", gramerEtiketi: "can / can't" },
  { kod: "a1-09", seviye: "A1", sira: 9, baslik: "Şehirde", baslikEn: "In the city", hedef: "Yol sorarsın ve tarif edersin.", gramerEtiketi: "emir kipi, yer edatları" },
  { kod: "a1-10", seviye: "A1", sira: 10, baslik: "Alışveriş", baslikEn: "Shopping", hedef: "Fiyat sorarsın, bir şey alırsın.", gramerEtiketi: "How much, this / that" },
  { kod: "a1-11", seviye: "A1", sira: 11, baslik: "Şu an", baslikEn: "Right now", hedef: "Şu an ne yaptığını söylersin.", gramerEtiketi: "-ıyor: I am working" },
  { kod: "a1-12", seviye: "A1", sira: 12, baslik: "Dün", baslikEn: "Yesterday", hedef: "Dün ne yaptığını anlatırsın.", gramerEtiketi: "was / were, geçmiş zaman" },
];

/** Yazılmış (tam) üniteler */
export const UNITELER: Unite[] = [A1_01];

export const uniteBul = (kod: string): Unite | undefined => UNITELER.find((u) => u.kod === kod);

/** Ünitenin bütün kelimeleri, düz liste */
export const uniteKelimeleri = (u: Unite) => u.kelimeGruplari.flatMap((g) => g.kelimeler);

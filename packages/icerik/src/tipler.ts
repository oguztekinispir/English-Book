/**
 * Ünite içeriğinin yapısı. Bütün üniteler bu tiplere uyar; TypeScript eksik alanı yakalar,
 * test/kontrol.test.ts de içerik hatalarını (bilinmeyen kelime, yanlış cevap şıkkı…) yakalar.
 */
import type { Kalip as MotorKalip, Kutup, Malzeme } from "@ti/motor";

export type Seviye = "A1" | "A2";

export interface Kelime {
  en: string;
  tr: string;
  /** Türkçe harflerle okunuş: water → uo-tır */
  ok: string;
  /** [İngilizce örnek, Türkçesi] */
  ornek?: [string, string];
  /** 💡 kısa not ya da çağrışım */
  ipucu?: string;
}

export interface KelimeGrubu {
  ad: string;
  kelimeler: Kelime[];
}

export interface HazirKalip {
  en: string;
  tr: string;
  /** Ne zaman kullanılır */
  not?: string;
}

/** Gramer anlatımında örnek satır: Türkçe parçalar → İngilizce */
export interface GramerOrnek {
  /** ["Ben öğrenci", "-yim"] gibi; ikinci ve sonraki parçalar ek olarak sarı gösterilir */
  tr: string[];
  /** "I [am] a student." köşeli parantez = vurgulu (ekin karşılığı) */
  en: string;
}

export interface GramerBolum {
  baslik: string;
  metin: string[];
  ornekler?: GramerOrnek[];
  notlar?: string[];
}

export interface Satir {
  /** konuşan kişinin anahtarı (diyalogda) */
  kim?: string;
  en: string;
  tr: string;
}

export interface Diyalog {
  baslik: string;
  /** Sahne: "Bir dil kafesinde iki kişi tanışıyor." */
  sahne: string;
  kisiler: Record<string, { ad: string; ses: "kadin" | "erkek" }>;
  satirlar: Satir[];
}

export interface Okuma {
  baslik: string;
  satirlar: Satir[];
  /** Doğru / yanlış soruları */
  sorular: { en: string; tr: string; dogru: boolean }[];
}

export interface Bosluk {
  /** "I ___ Emre." */
  cumle: string;
  tr: string;
  secenekler: string[];
  cevap: string;
}

export interface Siralama {
  /** Karışık verilecek kelimeler (doğru sırayla yazılır, ekranda karıştırılır) */
  cevap: string;
  tr: string;
}

export interface KonusmaSorusu {
  en: string;
  tr: string;
  ornek: string;
  ornekTr: string;
}

export interface TestSorusu {
  soru: string;
  secenekler: string[];
  /** doğru şıkkın sırası (0'dan) */
  dogru: number;
  aciklama: string;
}

export interface Unite {
  /** Veritabanındaki sabit kimlik */
  id: string;
  kod: string;
  seviye: Seviye;
  sira: number;
  baslik: string;
  baslikEn: string;
  /** "Bu ünitenin sonunda…" maddeleri */
  hedefler: string[];
  /** Kısa gramer etiketi: "am / is / are" */
  gramerEtiketi: string;
  kelimeGruplari: KelimeGrubu[];
  kaliplar: HazirKalip[];
  gramer: GramerBolum[];
  diyaloglar: Diyalog[];
  okuma: Okuma;
  alistirmalar: { bosluk: Bosluk[]; siralama: Siralama[] };
  /** Motor pratiği: hangi kalıplar, hangi kelimelerle */
  motor: { kaliplar: [MotorKalip, Kutup][]; malzeme: Malzeme; aciklama: string };
  konusma: KonusmaSorusu[];
  test: TestSorusu[];
  /** Metinlerde geçen özel isimler (kelime kontrolünde bilinmeyen sayılmaz) */
  ozelIsimler: string[];
}

/** Henüz yazılmamış üniteler için liste kaydı */
export interface UniteTaslak {
  kod: string;
  seviye: Seviye;
  sira: number;
  baslik: string;
  baslikEn: string;
  hedef: string;
  gramerEtiketi: string;
}

/** Kişi numarası: 0 ben, 1 sen, 2 o, 3 biz, 5 onlar (4 = siz, kullanılmıyor) */
export type Kisi = 0 | 1 | 2 | 3 | 5;

/** Kalıp türü */
export type Kalip = "be" | "bePast" | "simple" | "past" | "can" | "will";
/** Olumlu / olumsuz / soru */
export type Kutup = "pos" | "neg" | "q";

export interface Ozne {
  en: string;
  tr: string;
  p: Kisi;
  /** "My friend", "The teacher" gibi isim özneler (zamir değil) */
  nz?: 1;
  /** İyelik ekli öznede kök: "Annem" → "Anne" (parçalamada -m = my gösterilir) */
  kok?: string;
}

/** [İngilizce, Türkçe, kabul edilen alternatifler] */
export type Ikili = [en: string, tr: string, alt?: string[]];

export interface Fiil {
  en: string;
  en3: string;
  past: string;
  irr?: 1;
  /** Türkçe kök: çalış, iç, git */
  stem: string;
  /** Geniş zaman 3. tekil: çalışır, içer, gider */
  aor: string;
  /** Tamamlayıcılar: [en, tr, alternatifler?] */
  cs: Ikili[];
  /** can / will ile kullanılmasın */
  noModal?: 1;
}

/** Üreteç ayarı: hangi kalıplar ve kutuplar açık */
export interface Ayar {
  be?: boolean;
  bePast?: boolean;
  simple?: boolean;
  past?: boolean;
  can?: boolean;
  will?: boolean;
  neg?: boolean;
  q?: boolean;
}

export interface Meta {
  form: Kalip;
  pol: Kutup;
  s: Ozne;
  third: boolean;
  be?: string;
  v?: Fiil;
  comp: string;
  compTr: string;
  alt: string[];
}

/** [Türkçe parça, İngilizce karşılık, ek mi (1)] */
export type Cip = [tr: string, en: string, sig?: 1];

export interface Soru {
  tr: string;
  en: string;
  kind: string;
  chips: Cip[];
  meta: Meta;
  alts: string[];
}

/**
 * Üretecin kullanacağı kelimeler. Verilmezse motorun kendi listeleri (veri.ts) kullanılır.
 * Ünite pratiği için: o ünitenin özneleri, durumları ve fiilleri.
 */
export interface Malzeme {
  ozne?: Ozne[];
  durum?: Ikili[];
  fiil?: Fiil[];
}

/** 0 ile 1 arasında sayı döndüren rastgele sayı kaynağı (Math.random gibi) */
export type Rng = () => number;

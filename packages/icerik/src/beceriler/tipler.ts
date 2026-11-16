/**
 * Beceri dersleri (okuma, yazma): gerçek hayat metinleri. Yetişkinler için, A1–A2.
 * Ders akışı: hazırlık (eşleştirme) → metin → görevler → konuşma / kendi metnini yaz.
 * Orijinal içerik; biçim genel dil öğretimi pratiğidir.
 */
import type { Seviye } from "../tipler";

export interface Eslesme {
  en: string;
  tr: string;
}

/** Metnin türüne göre görünüşü */
export type MetinBlok =
  | { tip: "afis"; baslik: string; giris: string; satirlar: { etiket: string; deger: string }[]; kapanis?: string }
  | { tip: "mesajlar"; kisiler: Record<string, string>; ben: string; satirlar: { kim: string; en: string; saat: string }[] }
  | { tip: "eposta"; kimden: string; kime: string; konu: string; govde: string[] }
  | { tip: "form"; baslik: string; alanlar: { etiket: string; deger: string }[] }
  | { tip: "kartvizit"; kartlar: { ad: string; meslek?: string; yer?: string; satirlar: string[] }[] }
  | { tip: "gonderi"; yazar: string; zaman: string; govde: string[] };

/** Boşluk doldurma: cümledeki ___ yerine cevap; seçenekler kelime bankasından */
export interface BosluklaCumle {
  en: string;
  cevap: string;
}

export interface DogruYanlis {
  en: string;
  dogru: boolean;
  /** Cevaptan sonra: metinde nerede yazıyor */
  aciklama: string;
}

export interface BeceriKonusma {
  en: string;
  tr: string;
  ornek: string;
}

export interface Ipucu {
  baslik: string;
  metin: string;
  ornekler?: Eslesme[];
}

interface Ortak {
  kod: string;
  seviye: Seviye;
  baslik: string;
  /** Listede tek satır */
  aciklama: string;
  /** "Afiş", "Mesajlar" … */
  metinTuru: string;
  konu: string;
  /** Hazırlık: 6–8 kelime ↔ Türkçe */
  hazirlik: Eslesme[];
  /** Metindeki, hazırlıkta olmayan yeni kelimeler (dokununca Türkçesi çıkar) */
  sozluk: Record<string, string>;
  /** Metnin doğal Türkçesi; görevlerden sonra açılır */
  ceviri: string[];
}

export interface OkumaDersi extends Ortak {
  tur: "okuma";
  metin: MetinBlok;
  /** Görev 1: kelime bankasıyla boşluk doldurma (metne göre) */
  bosluklar: BosluklaCumle[];
  /** Görev 2: doğru / yanlış */
  dogruYanlis: DogruYanlis[];
  konusma: BeceriKonusma[];
}

export interface YazmaDersi extends Ortak {
  tur: "yazma";
  /** Örnek metin */
  metin: MetinBlok;
  ipuclari: Ipucu[];
  /** Görev 1: örneği anladın mı? */
  dogruYanlis: DogruYanlis[];
  /** Görev 2: metnin parçalarını doğru sıraya koy (doğru sıra) */
  siralama: string[];
  /** Görev 3: işe yarar kalıplarla boşluk doldurma */
  bosluklar: BosluklaCumle[];
  /** Görev 4: kendi metnin */
  yaz: {
    durum: string;
    kontrol: string[];
    kaliplar: string[];
    /** Serbest metin için en az kelime; form için 0 */
    enAz: number;
    /** Form görevi: doldurulacak alanlar */
    alanlar?: { etiket: string; ipucu: string }[];
    ornekCevap: string;
  };
}

export type BeceriDersi = OkumaDersi | YazmaDersi;

import { OKUMA_A1 } from "./okuma-a1";
import { YAZMA_A1 } from "./yazma-a1";
import type { BeceriDersi } from "./tipler";

export * from "./tipler";

/** Bütün beceri dersleri: okuma ve yazma, seviye sırasıyla */
export const BECERI_DERSLERI: BeceriDersi[] = [...OKUMA_A1, ...YAZMA_A1];
export const beceriBul = (kod: string) => BECERI_DERSLERI.find((d) => d.kod === kod);

/** Sıradaki beceri dersleri (hazırlanıyor) */
export const BECERI_YAKINDA: { tur: "okuma" | "yazma" | "dinleme" | "konusma"; baslik: string; seviye: "A1" | "A2" }[] = [
  { tur: "okuma", baslik: "Kafe menüsü", seviye: "A1" },
  { tur: "okuma", baslik: "Haftalık ders programı", seviye: "A1" },
  { tur: "okuma", baslik: "Kiralık ev ilanları", seviye: "A1" },
  { tur: "okuma", baslik: "İş ilanları", seviye: "A1" },
  { tur: "okuma", baslik: "Havalimanı kalkış tablosu", seviye: "A1" },
  { tur: "okuma", baslik: "Arkadaştan e-posta: hafta sonu planı", seviye: "A2" },
  { tur: "yazma", baslik: "Teşekkür e-postası", seviye: "A1" },
  { tur: "yazma", baslik: "Mesajla davet", seviye: "A1" },
  { tur: "yazma", baslik: "Otel rezervasyonu e-postası", seviye: "A1" },
  { tur: "yazma", baslik: "Planı iptal etme mesajı", seviye: "A2" },
  { tur: "dinleme", baslik: "Kafede sipariş", seviye: "A1" },
  { tur: "dinleme", baslik: "Sesli mesaj", seviye: "A1" },
  { tur: "konusma", baslik: "Anlamadığını söyleme: Can you repeat that?", seviye: "A1" },
];

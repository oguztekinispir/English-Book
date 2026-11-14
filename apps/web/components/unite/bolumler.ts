import type { Ders } from "@ti/icerik";
import type { UniteIlerleme } from "./ortak";

export interface Bolum {
  id: string;
  ad: string;
}

/** Dersin içeriğine göre bölümler (olmayan bölüm gösterilmez) */
export function dersBolumleri(d: Ders): Bolum[] {
  const b: Bolum[] = [];
  if (d.kelimeGruplari.length) b.push({ id: "kelimeler", ad: "Kelimeler" });
  if (d.kaliplar.length) b.push({ id: "kaliplar", ad: "Kalıplar" });
  if (d.gramer.length) b.push({ id: "gramer", ad: d.tekrar ? "Özet" : "Gramer" });
  if (d.diyaloglar.length) b.push({ id: "diyaloglar", ad: d.diyaloglar.length > 1 ? "Diyaloglar" : "Diyalog" });
  if (d.okuma) b.push({ id: "okuma", ad: "Okuma" });
  b.push({ id: "alistirmalar", ad: "Alıştırmalar" });
  if (d.motor) b.push({ id: "cumle", ad: "Cümle kur" });
  if (d.konusma.length) b.push({ id: "konusma", ad: "Konuşma" });
  b.push({ id: "test", ad: d.tekrar ? "Ünite testi" : "Mini test" });
  return b;
}

/** Hangi bölüm "bitti" sayılır */
export function bolumBitti(id: string, p: UniteIlerleme, d: Ders): boolean {
  switch (id) {
    case "kelimeler":
      return (p.kart ?? 0) >= Math.min(10, d.kelimeGruplari[0]?.kelimeler.length ?? 0);
    case "okuma":
      return !!d.okuma && (p.okuma ?? 0) >= d.okuma.sorular.length - 1;
    case "alistirmalar":
      return (p.bosluk ?? 0) >= d.alistirmalar.bosluk.length - 1 && (p.siralama ?? 0) >= d.alistirmalar.siralama.length - 1;
    case "cumle":
      return (p.motor ?? 0) >= 10;
    case "test":
      return (p.test ?? 0) >= Math.ceil(d.test.length * 0.8);
    default:
      return false;
  }
}

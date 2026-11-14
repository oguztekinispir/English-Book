"use client";
/**
 * Günlük tekrar (aralıklı tekrar, Leitner kutuları).
 * Kutu 0-1-2-3-4-5 → 0-1-2-4-7-14 gün sonra tekrar. Bilemediğin kart kutu 0'a döner.
 * Kartlar, öğrencinin açtığı derslerin kelime ve kalıplarından gelir.
 * Tarayıcıda saklanır; giriş yapılmışsa buluta da yazılır (tekrar_kartlari).
 */
import { tumKartlar, type Kart } from "@ti/icerik";
import { oku, yaz } from "./depo";
import { md5Uuid } from "./md5";
import { supabaseTarayici } from "./supabase/istemci";

export const ARALIK = [0, 1, 2, 4, 7, 14];
export const YENI_OTURUM = 8;
export const TEKRAR_OTURUM = 25;

export type Durum = Record<string, { b: number; d: number }>;

/** Bugünün gün numarası (yerel saat) */
export const bugunN = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const gunTarih = (n: number) => new Date(n * 86400000).toISOString().slice(0, 10);
const tarihGun = (s: string) => Math.floor(new Date(s + "T00:00:00Z").getTime() / 86400000);

export const KARTLAR: Kart[] = tumKartlar();
const KIMLIK = new Map(KARTLAR.map((k) => [md5Uuid(k.anahtar), k.anahtar]));
const kimlik = (anahtar: string) => md5Uuid(anahtar);

export const durumOku = (): Durum => oku<Durum>("srs", {});
export const durumYaz = (s: Durum) => yaz("srs", s);

/** Öğrencinin açtığı dersler (ders sayfasına girince eklenir) */
export const acilanlar = (): string[] => oku<string[]>("acilan-dersler", []);
export function dersAcildi(kod: string) {
  const a = acilanlar();
  if (!a.includes(kod)) yaz("acilan-dersler", [...a, kod]);
}

export interface Suzgec {
  unite: string; // "all" ya da "a1-01"
  tur: "all" | "kelime" | "kalip";
}

/** Çalışılabilecek kartlar: açılan derslerden, süzgece göre */
export function havuz(f: Suzgec): Kart[] {
  const a = new Set(acilanlar());
  return KARTLAR.filter((k) => a.has(k.dersKod) && (f.unite === "all" || k.uniteKod === f.unite) && (f.tur === "all" || k.tur === f.tur));
}

export function istatistik(f: Suzgec) {
  const s = durumOku(),
    T = bugunN(),
    p = havuz(f);
  return {
    vadesi: p.filter((k) => s[k.anahtar] && s[k.anahtar].d <= T).length,
    yeni: p.filter((k) => !s[k.anahtar]).length,
    ogrenildi: p.filter((k) => s[k.anahtar] && s[k.anahtar].b >= 3).length,
    toplam: p.length,
    yarin: p.filter((k) => s[k.anahtar] && s[k.anahtar].d <= T + 1).length,
  };
}

export function oturumKartlari(f: Suzgec): Kart[] {
  const s = durumOku(),
    T = bugunN(),
    p = havuz(f);
  const vade = p.filter((k) => s[k.anahtar] && s[k.anahtar].d <= T).sort((a, b) => s[a.anahtar].b - s[b.anahtar].b).slice(0, TEKRAR_OTURUM);
  const yeni = p.filter((k) => !s[k.anahtar]).slice(0, YENI_OTURUM);
  return [...vade, ...yeni];
}

/** Kartı notla. oturumdaBilemedi: bu oturumda daha önce bilemediyse bildiğinde kutu 1'e çıkar (en fazla) */
export function notla(anahtar: string, bildi: boolean, oturumdaBilemedi = false) {
  const s = durumOku(),
    T = bugunN(),
    cur = s[anahtar] ?? { b: 0, d: T };
  if (bildi) {
    const b = oturumdaBilemedi ? 1 : Math.min(cur.b + 1, ARALIK.length - 1);
    s[anahtar] = { b, d: T + ARALIK[b] };
  } else s[anahtar] = { b: 0, d: T };
  durumYaz(s);
  bulutaYaz(anahtar, s[anahtar]);
}

/** Oyunda ya da alıştırmada bilemediği kelime: yarın değil bugün tekrar gelsin */
export function bilemedi(anahtar: string) {
  const s = durumOku();
  s[anahtar] = { b: 0, d: bugunN() };
  durumYaz(s);
  bulutaYaz(anahtar, s[anahtar]);
}

async function bulutaYaz(anahtar: string, x: { b: number; d: number }) {
  try {
    const sb = supabaseTarayici();
    const { data } = await sb.auth.getSession();
    const id = data.session?.user.id;
    if (!id) return;
    const { error } = await sb.from("tekrar_kartlari").upsert({ ogrenci_id: id, kelime_id: kimlik(anahtar), kutu: x.b, sonraki: gunTarih(x.d), guncelleme: new Date().toISOString() });
    if (error && error.code !== "23503") console.warn("Tekrar kartı kaydedilemedi:", error.message);
  } catch {
    /* çevrimdışı: tarayıcıda kaldı */
  }
}

/** Buluttaki kartları tarayıcıdakilerle birleştirir (hangisi daha ilerideyse o kalır) */
export async function buluttanBirlestir(): Promise<boolean> {
  try {
    const sb = supabaseTarayici();
    const { data } = await sb.auth.getSession();
    const id = data.session?.user.id;
    if (!id) return false;
    const { data: satirlar } = await sb.from("tekrar_kartlari").select("kelime_id, kutu, sonraki").eq("ogrenci_id", id);
    if (!satirlar?.length) return false;
    const s = durumOku();
    let degisti = false;
    for (const r of satirlar) {
      const a = KIMLIK.get(r.kelime_id as string);
      if (!a) continue;
      const bulut = { b: r.kutu as number, d: tarihGun(r.sonraki as string) };
      if (!s[a] || bulut.d > s[a].d) {
        s[a] = bulut;
        degisti = true;
      }
    }
    if (degisti) durumYaz(s);
    // Bulutta olmayan yerel kartları da yaz
    const bulutta = new Set(satirlar.map((r) => KIMLIK.get(r.kelime_id as string)));
    Object.entries(s)
      .filter(([a]) => !bulutta.has(a))
      .forEach(([a, x]) => bulutaYaz(a, x));
    return degisti;
  } catch {
    return false;
  }
}

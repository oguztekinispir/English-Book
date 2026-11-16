"use client";
/**
 * Giriş yapılmışsa çalışmaları Supabase'e yazar. Giriş yoksa sessizce hiçbir şey yapmaz
 * (pratik sayfası girişsiz de çalışır; ilerleme o zaman sadece tarayıcıda kalır).
 */
import { supabaseTarayici } from "./supabase/istemci";

async function kullaniciId(): Promise<string | null> {
  try {
    const { data } = await supabaseTarayici().auth.getSession();
    return data.session?.user.id ?? null;
  } catch {
    return null;
  }
}

export interface CevapKaydi {
  kaynak: "yol" | "motor" | "tekrar" | "oyun" | "alistirma" | "test" | "ders";
  kural?: string | null;
  dogru: boolean;
  soru?: string;
  cevap?: string;
  beklenen?: string;
  sure_ms?: number;
  unite_id?: string;
  /** "a1-01-2" */
  ders?: string;
}

export async function cevapKaydet(k: CevapKaydi): Promise<void> {
  const id = await kullaniciId();
  if (!id) return;
  const sb = supabaseTarayici();
  let { error } = await sb.from("cevaplar").insert({ ...k, ogrenci_id: id, cevap: k.cevap || null });
  // Ünite henüz veritabanına yüklenmediyse (yabancı anahtar hatası) ünitesiz kaydet
  if (error?.code === "23503" && k.unite_id) ({ error } = await sb.from("cevaplar").insert({ ...k, unite_id: null, ogrenci_id: id, cevap: k.cevap || null }));
  // 0004 göçü henüz çalıştırılmadıysa "ders" sütunu yoktur: dersiz kaydet
  if (error && k.ders && /ders/.test(error.message)) {
    const { ders: _, ...kalan } = k;
    ({ error } = await sb.from("cevaplar").insert({ ...kalan, ogrenci_id: id, cevap: k.cevap || null }));
  }
  if (error) console.warn("Cevap kaydedilemedi:", error.message);
}

export interface YolDurumu {
  lvl: number;
  max: number;
}

export async function yolOku(): Promise<YolDurumu | null> {
  const id = await kullaniciId();
  if (!id) return null;
  const { data } = await supabaseTarayici().from("ogrenci_durumu").select("yol_seviye, yol_en_ust").eq("ogrenci_id", id).maybeSingle();
  return data ? { lvl: data.yol_seviye as number, max: data.yol_en_ust as number } : { lvl: 0, max: 0 };
}

export async function yolYaz(y: YolDurumu): Promise<void> {
  const id = await kullaniciId();
  if (!id) return;
  const { error } = await supabaseTarayici()
    .from("ogrenci_durumu")
    .upsert({ ogrenci_id: id, yol_seviye: y.lvl, yol_en_ust: y.max, guncelleme: new Date().toISOString() });
  if (error) console.warn("Seviye kaydedilemedi:", error.message);
}

/** Öğrenci durumu satırına kısmi yazma (günlük hedef, seviye testi). Giriş yoksa ya da 0006 göçü yoksa false döner. */
export async function durumGuncelle(alanlar: Record<string, unknown>): Promise<boolean> {
  const id = await kullaniciId();
  if (!id) return false;
  const { error } = await supabaseTarayici()
    .from("ogrenci_durumu")
    .upsert({ ogrenci_id: id, ...alanlar, guncelleme: new Date().toISOString() });
  if (error) console.warn("Durum kaydedilemedi:", error.message);
  return !error;
}

/** Yazma dersinde öğrencinin kendi metni (0008). Giriş yoksa ya da tablo yoksa false. */
export async function yaziKaydet(ders: string, metin: string): Promise<boolean> {
  const id = await kullaniciId();
  if (!id) return false;
  const { error } = await supabaseTarayici().from("yazilar").insert({ ders, metin });
  if (error) console.warn("Yazı kaydedilemedi:", error.message);
  return !error;
}

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CevapSatiri } from "./analiz";

/**
 * Öğrencinin son n günlük cevapları. 0004 göçü çalıştırılmadıysa "ders" sütunu yoktur:
 * o zaman dersiz sorgular (sayfa yine açılır, ders tablosu boş görünür).
 */
export async function cevaplariGetir(sb: SupabaseClient, ogrenciIds: string[], gun: number, limit = 4000) {
  if (!ogrenciIds.length) return { satirlar: [] as (CevapSatiri & { ogrenci_id: string; id: number })[], dersVar: true };
  const bas = new Date(Date.now() - gun * 86400_000).toISOString();
  const sorgu = (alanlar: string) =>
    sb.from("cevaplar").select(alanlar).in("ogrenci_id", ogrenciIds).gte("zaman", bas).order("zaman", { ascending: false }).limit(limit);
  const tam = "id, ogrenci_id, kaynak, kural, dogru, soru, cevap, beklenen, zaman, sure_ms, ders";
  let { data, error } = await sorgu(tam);
  let dersVar = true;
  if (error && /ders/.test(error.message)) {
    dersVar = false;
    ({ data, error } = await sorgu(tam.replace(", ders", "")));
  }
  return { satirlar: ((data as unknown) ?? []) as (CevapSatiri & { ogrenci_id: string; id: number })[], dersVar };
}

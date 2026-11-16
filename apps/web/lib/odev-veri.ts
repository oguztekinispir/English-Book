/** Ödevleri ve ilerlemelerini sunucuda okur (RLS: öğretmen kendi ödevlerini, öğrenci kendine atananları görür). */
import type { SupabaseClient } from "@supabase/supabase-js";
import { cevaplariGetir } from "./ogrenci-veri";
import { hedefGecerli, odevIlerleme, type Odev, type OdevIlerleme } from "./odev";

export interface Atama {
  ogrenci_id: string;
  ad: string;
  durum: string;
  ilerleme: OdevIlerleme;
}
export type OdevSatiri = Odev & { atamalar: Atama[] };

const GUN = 86400_000;

async function tamamla(sb: SupabaseClient, odevler: Odev[], atamaSatirlari: { odev_id: string; ogrenci_id: string; durum: string }[], adlar: Map<string, string>) {
  const ogrenciler = [...new Set(atamaSatirlari.map((a) => a.ogrenci_id))];
  const enEski = odevler.reduce((m, o) => Math.min(m, new Date(o.olusturma).getTime()), Date.now());
  const gun = Math.min(180, Math.ceil((Date.now() - enEski) / GUN) + 1);
  const { satirlar } = ogrenciler.length ? await cevaplariGetir(sb, ogrenciler, gun, 20000) : { satirlar: [] };
  return odevler.map<OdevSatiri>((o) => ({
    ...o,
    atamalar: atamaSatirlari
      .filter((a) => a.odev_id === o.id)
      .map((a) => ({
        ogrenci_id: a.ogrenci_id,
        ad: adlar.get(a.ogrenci_id) || "İsimsiz öğrenci",
        durum: a.durum,
        ilerleme: odevIlerleme(
          o.hedef,
          o.olusturma,
          satirlar.filter((c) => c.ogrenci_id === a.ogrenci_id),
        ),
      }))
      .sort((x, y) => x.ad.localeCompare(y.ad, "tr")),
  }));
}

const temizle = (rows: unknown[] | null): Odev[] =>
  ((rows ?? []) as Odev[]).filter((o) => hedefGecerli(o.hedef));

/** Öğretmenin verdiği ödevler (yeniden eskiye). ogrenciId verilirse sadece o öğrenciye atananlar. */
export async function ogretmenOdevleri(sb: SupabaseClient, ogretmenId: string, ogrenciId?: string): Promise<OdevSatiri[]> {
  const { data } = await sb.from("odevler").select("id, baslik, aciklama, hedef, son_tarih, olusturma").eq("ogretmen_id", ogretmenId).order("olusturma", { ascending: false }).limit(60);
  let odevler = temizle(data);
  if (!odevler.length) return [];
  const { data: at } = await sb.from("odev_atamalari").select("odev_id, ogrenci_id, durum").in("odev_id", odevler.map((o) => o.id));
  let atamalar = (at ?? []) as { odev_id: string; ogrenci_id: string; durum: string }[];
  if (ogrenciId) {
    atamalar = atamalar.filter((a) => a.ogrenci_id === ogrenciId);
    odevler = odevler.filter((o) => atamalar.some((a) => a.odev_id === o.id));
  }
  const ids = [...new Set(atamalar.map((a) => a.ogrenci_id))];
  const { data: pr } = ids.length ? await sb.from("profiller").select("id, ad").in("id", ids) : { data: [] };
  const adlar = new Map(((pr ?? []) as { id: string; ad: string }[]).map((p) => [p.id, p.ad]));
  return tamamla(sb, odevler, atamalar, adlar);
}

/** Öğrenciye atanan ödevler. Bitmiş görünen ama kaydı "bitti" olmayanları işaretler. */
export async function ogrenciOdevleri(sb: SupabaseClient, ogrenciId: string): Promise<OdevSatiri[]> {
  const { data: at } = await sb.from("odev_atamalari").select("odev_id, ogrenci_id, durum").eq("ogrenci_id", ogrenciId);
  const atamalar = (at ?? []) as { odev_id: string; ogrenci_id: string; durum: string }[];
  if (!atamalar.length) return [];
  const { data } = await sb.from("odevler").select("id, baslik, aciklama, hedef, son_tarih, olusturma").in("id", atamalar.map((a) => a.odev_id)).order("olusturma", { ascending: false });
  const sonuc = await tamamla(sb, temizle(data), atamalar, new Map());
  // Kendiliğinden bitenleri kaydet (öğretmen listesinde de "bitti" görünsün)
  const yeniBiten = sonuc.filter((o) => o.atamalar[0]?.ilerleme.bitti && o.atamalar[0].durum !== "bitti").map((o) => o.id);
  if (yeniBiten.length) {
    await sb.from("odev_atamalari").update({ durum: "bitti", bitis: new Date().toISOString() }).eq("ogrenci_id", ogrenciId).in("odev_id", yeniBiten);
    sonuc.forEach((o) => yeniBiten.includes(o.id) && (o.atamalar[0].durum = "bitti"));
  }
  return sonuc;
}

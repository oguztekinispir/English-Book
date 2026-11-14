/**
 * SADECE GELİŞTİRME: TI_ONIZLEME=1 ile `next dev` açılınca giriş yapılmış gibi sahte verilerle sayfa gösterir.
 * Üretimde (NODE_ENV=production) hiç çağrılmaz. Ekran görüntüsü ve tasarım kontrolü için.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Profil } from "./sunucu";

const OGRETMEN = "11111111-0000-4000-8000-000000000001";
const OGRENCI = "22222222-0000-4000-8000-000000000002";
const OGRENCI2 = "33333333-0000-4000-8000-000000000003";
const simdi = Date.now();
const z = (gun: number, dk = 0) => new Date(simdi - gun * 86400000 - dk * 60000).toISOString();
const gun = (n: number) => new Date(simdi + n * 86400000).toISOString().slice(0, 10);

function cevaplar() {
  const out: any[] = [];
  let id = 1;
  const ekle = (g: number, dk: number, kaynak: string, dogru: boolean, extra: any = {}) => out.push({ id: id++, ogrenci_id: OGRENCI, kaynak, dogru, zaman: z(g, dk), kural: null, soru: null, cevap: null, beklenen: null, ders: null, sure_ms: null, ...extra });
  [0, 1, 2, 3, 5, 6, 8, 9, 12].forEach((g, i) => {
    for (let k = 0; k < 6 + ((i * 7) % 15); k++) ekle(g, k * 2, k % 3 ? "tekrar" : "alistirma", k % 5 !== 0, { ders: i < 4 ? "a1-01-2" : "a1-01-1", soru: "merhaba", beklenen: "hello" });
  });
  ekle(0, 30, "oyun", false, { soru: "teacher", beklenen: "öğretmen", ders: "a1-01-2" });
  ekle(1, 40, "oyun", false, { soru: "teacher", beklenen: "öğretmen", ders: "a1-01-2" });
  ekle(1, 41, "tekrar", false, { soru: "on yedi", beklenen: "seventeen", ders: "a1-01-3" });
  for (let k = 0; k < 5; k++) ekle(4, 60 + k, "test", k !== 2, { ders: "a1-01-1", soru: `Test sorusu ${k + 1}`, cevap: "am", beklenen: "is" });
  for (let k = 0; k < 8; k++) ekle(2, 90 + k, "yol", k % 3 !== 0, { kural: "simple-pos", soru: "O kahve içer.", cevap: "He drink coffee.", beklenen: "He drinks coffee." });
  return out.sort((a, b) => b.zaman.localeCompare(a.zaman));
}

const TABLO: Record<string, any[]> = {
  profiller: [
    { id: OGRETMEN, ad: "Ayşe Öğretmen", rol: "ogretmen", davet_kodu: "2G3SEV", dogum_yili: null, dogum_tarihi: null, veli_eposta: null, veli_onayi_at: null, kvkk_onayi_at: z(20), ayarlar: { okul: "Özel ders" }, olusturma: z(30) },
    { id: OGRENCI, ad: "Oğuz Tekin", rol: "ogrenci", dogum_tarihi: "2011-03-09", dogum_yili: 2011, veli_eposta: "veli@example.com", veli_onayi_at: null, olusturma: z(25) },
    { id: OGRENCI2, ad: "Deniz Kaya", rol: "ogrenci", dogum_tarihi: "1995-06-01", olusturma: z(10) },
  ],
  baglantilar: [
    { ogretmen_id: OGRETMEN, ogrenci_id: OGRENCI, durum: "aktif", olusturma: z(24) },
    { ogretmen_id: OGRETMEN, ogrenci_id: OGRENCI2, durum: "aktif", olusturma: z(9) },
  ],
  ogrenci_ozetleri: [
    { ogretmen_id: OGRETMEN, ogrenci_id: OGRENCI, ad: "Oğuz Tekin", baglanma: z(24), son_calisma: z(0), hafta_cevap: 64, hafta_dogru: 52, yol_en_ust: 3 },
    { ogretmen_id: OGRETMEN, ogrenci_id: OGRENCI2, ad: "Deniz Kaya", baglanma: z(9), son_calisma: z(6), hafta_cevap: 0, hafta_dogru: 0, yol_en_ust: 0 },
  ],
  zayif_kurallar: [
    { ogrenci_id: OGRENCI, kural: "simple-pos", hata: 3, toplam: 8 },
    { ogrenci_id: OGRENCI, kural: "be-pos", hata: 1, toplam: 12 },
  ],
  ogrenci_durumu: [{ ogrenci_id: OGRENCI, yol_en_ust: 3 }],
  tekrar_kartlari: [...Array(42)].map((_, i) => ({ ogrenci_id: OGRENCI, kutu: [0, 1, 1, 2, 2, 3, 3, 3, 4, 5][i % 10], sonraki: gun((i % 6) - 2) })),
  ogretmen_notlari: [{ id: 1, ogretmen_id: OGRETMEN, ogrenci_id: OGRENCI, metin: "Ders 1.2 bitti. He/she ile is'i bazen karıştırıyor.", olusturma: z(3) }],
  cevaplar: cevaplar(),
  odev_atamalari: [],
  odevler: [],
};

function sorgu(tablo: string) {
  let satir = [...(TABLO[tablo] ?? [])];
  let tek = false;
  const zincir: any = {
    select: () => zincir,
    eq: (k: string, v: any) => ((satir = satir.filter((r) => r[k] === v)), zincir),
    neq: (k: string, v: any) => ((satir = satir.filter((r) => r[k] !== v)), zincir),
    in: (k: string, v: any[]) => ((satir = satir.filter((r) => v.includes(r[k]))), zincir),
    gte: (k: string, v: any) => ((satir = satir.filter((r) => r[k] >= v)), zincir),
    gt: (k: string, v: any) => ((satir = satir.filter((r) => r[k] > v)), zincir),
    or: () => zincir,
    order: () => zincir,
    limit: (n: number) => ((satir = satir.slice(0, n)), zincir),
    maybeSingle: () => ((tek = true), zincir),
    then: (ok: any) => ok({ data: tek ? (satir[0] ?? null) : satir, error: null }),
  };
  return zincir;
}

export function sahteOturum() {
  const rol = process.env.TI_ONIZLEME_ROL === "ogrenci" ? "ogrenci" : "ogretmen";
  const id = rol === "ogrenci" ? OGRENCI : OGRETMEN;
  const profil = TABLO.profiller.find((p) => p.id === id) as Profil;
  const sb = { from: sorgu, auth: { getUser: async () => ({ data: { user: { id } } }) }, rpc: async () => ({ data: null, error: null }) } as any;
  return { sb, user: { id, email: rol === "ogrenci" ? "ogrenci@example.com" : "ogretmen@example.com", user_metadata: {} } as any, profil };
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CAMP_L, RULES } from "@ti/motor";
import { Ust } from "@/components/Ust";
import { KodKarti } from "@/components/PanelParcalari";
import { oturum } from "@/lib/supabase/sunucu";
import { once, yuzde } from "@/lib/zaman";
import "../hesap.css";

export const metadata: Metadata = { title: "Öğrencilerim" };

interface Ozet {
  ogrenci_id: string;
  ad: string;
  baglanma: string;
  son_calisma: string | null;
  hafta_cevap: number;
  hafta_dogru: number;
  yol_en_ust: number | null;
}

export default async function OgretmenPaneli() {
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris?sonra=/ogretmen");
  if (profil?.rol !== "ogretmen" && profil?.rol !== "yonetici") redirect("/ogrenci");

  const { data } = await sb.from("ogrenci_ozetleri").select("*").eq("ogretmen_id", user.id).order("son_calisma", { ascending: false, nullsFirst: false });
  const liste = (data || []) as Ozet[];
  const ids = liste.map((o) => o.ogrenci_id);
  const zayif = ids.length
    ? ((await sb.from("zayif_kurallar").select("ogrenci_id, kural, hata").in("ogrenci_id", ids).gt("hata", 0).order("hata", { ascending: false })).data ?? [])
    : [];
  const enZor = new Map<string, { kural: string; hata: number }>();
  zayif.forEach((z) => {
    if (!enZor.has(z.ogrenci_id as string)) enZor.set(z.ogrenci_id as string, { kural: z.kural as string, hata: z.hata as number });
  });
  const aktif = liste.filter((o) => o.hafta_cevap > 0).length;

  return (
    <div className="sayfa">
      <Ust aktif="panel" />
      <main className="panel">
        <div className="panel-baslik">
          <h1>Öğrencilerin</h1>
          <p className="not">
            {liste.length} öğrenci, bu hafta {aktif} tanesi çalıştı
          </p>
        </div>

        <div className="ogretmen-izgara">
          <div>
            {liste.length ? (
              <div className="tablo-kap yaprak">
                <table className="ogrenci-tablo">
                  <thead>
                    <tr>
                      <th>Öğrenci</th>
                      <th>Son çalışma</th>
                      <th>Bu hafta</th>
                      <th>Cümle yolu</th>
                      <th>En çok zorlandığı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liste.map((o) => {
                      const z = enZor.get(o.ogrenci_id);
                      const pasif = !o.son_calisma || Date.now() - new Date(o.son_calisma).getTime() > 4 * 86400000;
                      return (
                        <tr key={o.ogrenci_id}>
                          <td>
                            <Link href={`/ogretmen/ogrenci/${o.ogrenci_id}`}>{o.ad || "İsimsiz öğrenci"}</Link>
                          </td>
                          <td className={pasif ? "uyari" : ""}>{once(o.son_calisma)}</td>
                          <td>
                            {o.hafta_cevap} cümle
                            {o.hafta_cevap > 0 && <small>, %{yuzde(o.hafta_dogru, o.hafta_cevap)} doğru</small>}
                          </td>
                          <td>
                            {(o.yol_en_ust ?? 0) + 1} / {CAMP_L.length}
                          </td>
                          <td>{z ? <KuralAdi k={z.kural} hata={z.hata} /> : <span className="not">—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bos-durum yaprak">
                <h2>Henüz bağlı öğrencin yok</h2>
                <p>Yandaki kodu ya da davet linkini öğrencine gönder. Kayıt olunca burada görünecek ve çalıştıkça ne yaptığını göreceksin.</p>
              </div>
            )}
          </div>
          <KodKarti kod={profil?.davet_kodu || "------"} />
        </div>
      </main>
    </div>
  );
}

function KuralAdi({ k, hata }: { k: string; hata: number }) {
  return (
    <span>
      {RULES[k]?.t.split(":")[0] ?? k} <small className="hata-sayi">{hata} hata</small>
    </span>
  );
}

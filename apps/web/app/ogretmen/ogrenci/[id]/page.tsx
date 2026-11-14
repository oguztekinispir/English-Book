import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CAMP_L, RULES } from "@ti/motor";
import { Ust } from "@/components/Ust";
import { oturum } from "@/lib/supabase/sunucu";
import { once, yuzde } from "@/lib/zaman";
import "../../../hesap.css";

export const metadata: Metadata = { title: "Öğrenci" };

const KAYNAK: Record<string, string> = {
  yol: "Cümle yolu",
  motor: "Serbest",
  tekrar: "Tekrar",
  oyun: "Oyun",
  alistirma: "Alıştırma",
  test: "Test",
  ders: "Ders",
};

export default async function OgrenciDetayi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris");
  if (profil?.rol !== "ogretmen" && profil?.rol !== "yonetici") redirect("/ogrenci");

  // RLS: sadece bağlı öğrencinin profili döner
  const { data: ogr } = await sb.from("profiller").select("id, ad, dogum_yili").eq("id", id).maybeSingle();
  if (!ogr) notFound();

  const ay = new Date(Date.now() - 30 * 86400000).toISOString();
  const [ozet, zayif, son, durum] = await Promise.all([
    sb.from("ogrenci_ozetleri").select("*").eq("ogretmen_id", user.id).eq("ogrenci_id", id).maybeSingle(),
    sb.from("zayif_kurallar").select("kural, hata, toplam").eq("ogrenci_id", id).order("hata", { ascending: false }),
    sb.from("cevaplar").select("id, kaynak, kural, dogru, soru, cevap, beklenen, zaman").eq("ogrenci_id", id).gte("zaman", ay).order("zaman", { ascending: false }).limit(40),
    sb.from("ogrenci_durumu").select("yol_en_ust").eq("ogrenci_id", id).maybeSingle(),
  ]);
  const o = ozet.data as { son_calisma: string | null; hafta_cevap: number; hafta_dogru: number } | null;
  const kurallar = (zayif.data || []) as { kural: string; hata: number; toplam: number }[];
  const cevaplar = (son.data || []) as { id: number; kaynak: string; kural: string | null; dogru: boolean; soru: string | null; cevap: string | null; beklenen: string | null; zaman: string }[];
  const yol = (durum.data?.yol_en_ust as number | undefined) ?? 0;
  const enCok = Math.max(1, ...kurallar.map((k) => k.hata));

  return (
    <div className="sayfa">
      <Ust aktif="panel" />
      <main className="panel">
        <p>
          <Link href="/ogretmen" className="geri">
            Öğrencilerin
          </Link>
        </p>
        <div className="panel-baslik">
          <h1>{(ogr.ad as string) || "İsimsiz öğrenci"}</h1>
          <p className="not">Son çalışma: {once(o?.son_calisma)}</p>
        </div>

        <div className="panel-izgara">
          <section className="panel-kutu yaprak" aria-labelledby="h-b">
            <h2 id="h-b">Bu hafta</h2>
            <div className="sayilar">
              <p>
                <b>{o?.hafta_cevap ?? 0}</b>
                <span>cümle</span>
              </p>
              <p>
                <b>%{yuzde(o?.hafta_dogru ?? 0, o?.hafta_cevap ?? 0)}</b>
                <span>doğru</span>
              </p>
              <p>
                <b>{yol + 1}</b>
                <span>/ {CAMP_L.length} seviye</span>
              </p>
            </div>
          </section>

          <section className="panel-kutu genis yaprak" aria-labelledby="k-b">
            <h2 id="k-b">Kural kural son 30 gün</h2>
            {kurallar.length ? (
              <ul className="kural-cubuk">
                {kurallar.map((k) => (
                  <li key={k.kural}>
                    <span className="kc-ad">{RULES[k.kural]?.t ?? k.kural}</span>
                    <span className="kc-cubuk" aria-hidden="true">
                      <i style={{ width: `${(k.hata / enCok) * 100}%` }} />
                    </span>
                    <span className="kc-sayi">
                      {k.hata} hata / {k.toplam}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="not">Son 30 günde cümle motorunda çalışmamış.</p>
            )}
            {kurallar[0]?.hata > 0 && (
              <p className="ipucu-kutusu">
                Derste üzerinde durulabilir: <b>{RULES[kurallar[0].kural]?.t}</b>. Formül: {RULES[kurallar[0].kural]?.f}
              </p>
            )}
          </section>
        </div>

        <section className="panel-kutu yaprak son-cevaplar" aria-labelledby="c-b">
          <h2 id="c-b">Son cevapları</h2>
          {cevaplar.length ? (
            <ul>
              {cevaplar.map((c) => (
                <li key={c.id} className={c.dogru ? "dogru" : "yanlis"}>
                  <span className="sc-isaret" aria-label={c.dogru ? "doğru" : "yanlış"}>
                    {c.dogru ? "✓" : "✗"}
                  </span>
                  <span className="sc-metin">
                    <span className="sc-soru">{c.soru}</span>
                    {!c.dogru && (
                      <span className="sc-cevap">
                        <s>{c.cevap || "(boş bıraktı)"}</s> <b>{c.beklenen}</b>
                      </span>
                    )}
                  </span>
                  <span className="sc-yan">
                    {KAYNAK[c.kaynak] ?? c.kaynak}
                    <small>{once(c.zaman)}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="not">Henüz cevap yok.</p>
          )}
        </section>
      </main>
    </div>
  );
}

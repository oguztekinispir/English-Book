import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CAMP_L, RULES } from "@ti/motor";
import { Ust } from "@/components/Ust";
import { BaglanFormu } from "@/components/PanelParcalari";
import { oturum } from "@/lib/supabase/sunucu";
import { once, yuzde } from "@/lib/zaman";
import "../hesap.css";

export const metadata: Metadata = { title: "Panelim" };

export default async function OgrenciPaneli() {
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris?sonra=/ogrenci");
  if (profil?.rol === "ogretmen") redirect("/ogretmen");

  const hafta = new Date(Date.now() - 7 * 86400000).toISOString();
  const [bag, cev, zayif, durum, atama] = await Promise.all([
    sb.from("baglantilar").select("ogretmen_id, olusturma").eq("ogrenci_id", user.id).eq("durum", "aktif"),
    sb.from("cevaplar").select("dogru, zaman").eq("ogrenci_id", user.id).gte("zaman", hafta),
    sb.from("zayif_kurallar").select("kural, hata, toplam").eq("ogrenci_id", user.id).order("hata", { ascending: false }).limit(3),
    sb.from("ogrenci_durumu").select("yol_en_ust").eq("ogrenci_id", user.id).maybeSingle(),
    sb.from("odev_atamalari").select("odev_id, durum").eq("ogrenci_id", user.id).neq("durum", "bitti"),
  ]);
  const ogretmenIds = (bag.data || []).map((b) => b.ogretmen_id as string);
  const ogretmenler = ogretmenIds.length ? ((await sb.from("profiller").select("id, ad").in("id", ogretmenIds)).data ?? []) : [];
  const odevIds = (atama.data || []).map((a) => a.odev_id as string);
  const odevler = odevIds.length ? ((await sb.from("odevler").select("id, baslik, son_tarih").in("id", odevIds)).data ?? []) : [];

  const cevaplar = cev.data || [];
  const dogru = cevaplar.filter((c) => c.dogru).length;
  const gunler = new Set(cevaplar.map((c) => (c.zaman as string).slice(0, 10))).size;
  const yol = (durum.data?.yol_en_ust as number | undefined) ?? 0;
  const zorlar = (zayif.data || []).filter((z) => (z.hata as number) > 0);
  const kucuk = profil?.dogum_yili && new Date().getFullYear() - profil.dogum_yili < 18;
  const otomatikKod = (user.user_metadata?.ogretmen_kodu as string | undefined) || undefined;

  return (
    <div className="sayfa">
      <Ust aktif="panel" />
      <main className="panel">
        <div className="panel-baslik">
          <h1>Merhaba {profil?.ad?.split(" ")[0] || ""}</h1>
          <Link href="/pratik" className="dugme ana buyuk">
            Pratiğe devam et
          </Link>
        </div>

        {kucuk && !profil?.veli_onayi_at && (
          <p className="form-bilgi">Velinin onayı bekleniyor ({profil?.veli_eposta}). Bu sırada çalışmaya devam edebilirsin.</p>
        )}

        <div className="panel-izgara">
          <section className="panel-kutu yaprak" aria-labelledby="hafta-b">
            <h2 id="hafta-b">Bu hafta</h2>
            <div className="sayilar">
              <p>
                <b>{cevaplar.length}</b>
                <span>cümle</span>
              </p>
              <p>
                <b>%{yuzde(dogru, cevaplar.length)}</b>
                <span>doğru</span>
              </p>
              <p>
                <b>{gunler}</b>
                <span>/ 7 gün çalıştın</span>
              </p>
            </div>
            <p className="not">
              Cümle yolu: seviye {yol + 1} / {CAMP_L.length}, {CAMP_L[Math.min(yol, CAMP_L.length - 1)].t}
            </p>
          </section>

          <section className="panel-kutu yaprak" aria-labelledby="odev-b">
            <h2 id="odev-b">Ödevlerin</h2>
            {odevler.length ? (
              <ul className="liste">
                {odevler.map((o) => (
                  <li key={o.id as string}>
                    <b>{o.baslik as string}</b>
                    {o.son_tarih && <small>Son gün: {new Date(o.son_tarih as string).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</small>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="not">Bekleyen ödevin yok.</p>
            )}
          </section>

          <section className="panel-kutu yaprak" aria-labelledby="zor-b">
            <h2 id="zor-b">En çok zorlandığın</h2>
            {zorlar.length ? (
              <ul className="liste">
                {zorlar.map((z) => (
                  <li key={z.kural as string}>
                    <b>{RULES[z.kural as string]?.t ?? (z.kural as string)}</b>
                    <small>
                      {z.hata as number} hata, {z.toplam as number} denemede
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="not">Son 30 günde belirgin bir zorlandığın kural yok. Ya da daha yeni başladın.</p>
            )}
          </section>

          <section className="panel-kutu yaprak" aria-labelledby="ogr-b">
            <h2 id="ogr-b">Öğretmenlerin</h2>
            {ogretmenler.length > 0 && (
              <ul className="liste">
                {ogretmenler.map((t) => (
                  <li key={t.id as string}>
                    <b>{(t.ad as string) || "Öğretmen"}</b>
                    <small>Çalışmalarını görebiliyor</small>
                  </li>
                ))}
              </ul>
            )}
            {!ogretmenler.length && <p className="not">Bir öğretmenin varsa senden bir kod isteyecek. O kodu buraya yaz.</p>}
            <BaglanFormu otomatikKod={otomatikKod} />
          </section>
        </div>
        <p className="not son-not">Son çalışma: {once(cevaplar.map((c) => c.zaman as string).sort().pop())}</p>
      </main>
    </div>
  );
}

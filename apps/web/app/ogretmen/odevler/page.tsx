import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Ust } from "@/components/Ust";
import { OdevKarti } from "@/components/OdevKarti";
import { oturum } from "@/lib/supabase/sunucu";
import { ogretmenOdevleri } from "@/lib/odev-veri";
import "../../hesap.css";
import "../ogretmen.css";

export const metadata: Metadata = { title: "Ödevler" };

export default async function Odevler({ searchParams }: { searchParams: Promise<{ yeni?: string }> }) {
  const { yeni } = await searchParams;
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris?sonra=/ogretmen/odevler");
  if (profil?.rol !== "ogretmen" && profil?.rol !== "yonetici") redirect("/ogrenci");
  const odevler = await ogretmenOdevleri(sb, user.id);
  const acik = odevler.filter((o) => o.atamalar.some((a) => !a.ilerleme.bitti));
  const biten = odevler.filter((o) => !o.atamalar.some((a) => !a.ilerleme.bitti));

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
          <h1>Ödevler</h1>
          <Link href="/ogretmen/odevler/yeni" className="dugme ana buyuk">
            Yeni ödev ver
          </Link>
        </div>
        {yeni && <p className="form-bilgi" role="status">Ödev verildi. Öğrenci panelini açınca “Bugünün planı”nın en üstünde görecek.</p>}
        <p className="not">Öğrenci çalıştıkça ilerleme kendiliğinden güncellenir; öğrencinin “bitirdim” demesi gerekmez.</p>

        {odevler.length === 0 ? (
          <div className="bos-durum yaprak">
            <h2>Henüz ödev vermediniz</h2>
            <p>Bir ders, tekrar kartı ya da cümle pratiği ödevi verin; kimin bitirdiğini buradan izleyin.</p>
            <Link href="/ogretmen/odevler/yeni" className="dugme ana">
              İlk ödevi ver
            </Link>
          </div>
        ) : (
          <>
            <h2 className="odev-bolum">Devam eden ({acik.length})</h2>
            {acik.length ? (
              <ul className="odev-liste">
                {acik.map((o) => (
                  <OdevKarti key={o.id} o={o} />
                ))}
              </ul>
            ) : (
              <p className="not">Bütün ödevler bitti.</p>
            )}
            {biten.length > 0 && (
              <details className="odev-biten">
                <summary>Bitenler ({biten.length})</summary>
                <ul className="odev-liste">
                  {biten.map((o) => (
                    <OdevKarti key={o.id} o={o} />
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </main>
    </div>
  );
}

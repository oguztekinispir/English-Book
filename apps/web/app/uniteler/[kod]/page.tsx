import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { A1_PLAN, dersKelimeleri, uniteBul, uniteKelimeleri } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { DersIlerleme } from "@/components/unite/UniteGezgin";
import "../unite.css";

export async function generateMetadata({ params }: { params: Promise<{ kod: string }> }): Promise<Metadata> {
  const u = uniteBul((await params).kod);
  return { title: u ? `Ünite ${u.sira}: ${u.baslik}` : "Ünite" };
}

export default async function UniteSayfasi({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const u = uniteBul(kod);
  if (!u) notFound();
  const sonraki = A1_PLAN.find((x) => x.sira === u.sira + 1);

  return (
    <div className="sayfa">
      <Ust aktif="uniteler" />
      <main className="unite">
        <header className="unite-kapak">
          <p className="unite-ust">
            <Link href="/uniteler" className="geri">
              Üniteler
            </Link>
            <span className="tur-etiket">
              {u.seviye}, ünite {u.sira}
            </span>
          </p>
          <h1>
            {u.baslik} <span lang="en">{u.baslikEn}</span>
          </h1>
          <div className="hedefler">
            <p>Bu ünitenin sonunda:</p>
            <ul>
              {u.hedefler.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <p className="not">
            {u.dersler.length} ders, her biri yaklaşık 30 dakika. Toplam {uniteKelimeleri(u).length} kelime. Gramer: {u.gramerEtiketi}.
          </p>
        </header>

        <ol className="ders-listesi">
          {u.dersler.map((d) => (
            <li key={d.kod}>
              <Link href={`/uniteler/${u.kod}/${d.no}`} className={`ders-karti yaprak${d.tekrar ? " tekrar" : ""}`}>
                <span className="dk-no">
                  {u.sira}.{d.no}
                </span>
                <span className="dk-govde">
                  <b>{d.baslik}</b>
                  <span>{d.hedef}</span>
                  <small>
                    {d.tekrar
                      ? `Okuma, konuşma ve ${d.test.length} soruluk ünite testi`
                      : `${dersKelimeleri(d).length} kelime, ${d.kaliplar.length} kalıp${d.diyaloglar.length ? `, ${d.diyaloglar.length} diyalog` : ""}, ${d.test.length} soruluk mini test`}
                  </small>
                </span>
                <DersIlerleme d={d} />
              </Link>
            </li>
          ))}
        </ol>

        {sonraki && (
          <p className="sonraki-unite">
            Sıradaki ünite: <b>{sonraki.sira}. {sonraki.baslik}</b>. {sonraki.hedef} (hazırlanıyor)
          </p>
        )}
      </main>
    </div>
  );
}

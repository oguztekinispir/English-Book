import type { Metadata } from "next";
import Link from "next/link";
import { A1_PLAN, uniteBul } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import "./unite.css";

export const metadata: Metadata = { title: "Üniteler" };

export default function Uniteler() {
  return (
    <div className="sayfa">
      <Ust aktif="uniteler" />
      <main className="uniteler">
        <h1>Üniteler</h1>
        <p className="not uniteler-giris">A1'de 12 ünite var. Her ünite bir konu ve bir gramer adımı. Ünite bitince o kalıp cümle yolunda da seni bekliyor olacak.</p>

        <h2 className="seviye-baslik">A1, başlangıç</h2>
        <ol className="unite-izgara">
          {A1_PLAN.map((p) => {
            const hazir = !!uniteBul(p.kod);
            const ic = (
              <>
                <span className="ui-no">{p.sira}</span>
                <span className="ui-govde">
                  <b>{p.baslik}</b>
                  <span className="ui-en" lang="en">
                    {p.baslikEn}
                  </span>
                  <span className="ui-hedef">{p.hedef}</span>
                  <span className="ui-gramer">{p.gramerEtiketi}</span>
                </span>
                {!hazir && <span className="ui-durum">Hazırlanıyor</span>}
              </>
            );
            return (
              <li key={p.kod}>
                {hazir ? (
                  <Link href={`/uniteler/${p.kod}`} className="unite-kart yaprak hazir">
                    {ic}
                  </Link>
                ) : (
                  <div className="unite-kart yaprak" aria-disabled="true">
                    {ic}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <h2 className="seviye-baslik soluk">A2, temel</h2>
        <p className="not">A1 bittikten sonra açılacak.</p>
      </main>
    </div>
  );
}

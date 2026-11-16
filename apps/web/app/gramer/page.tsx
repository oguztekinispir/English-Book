import type { Metadata } from "next";
import Link from "next/link";
import { GRAMER_YAKINDA, UNITELER } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { Gramer } from "@/components/unite/Gramer";
import { GramerListe } from "@/components/GramerListe";
import "../pratik/pratik.css";
import "../uniteler/unite.css";
import "../calisma.css";
import "./gramer.css";

export const metadata: Metadata = { title: "Gramer" };

export default function GramerSayfasi() {
  const konular = UNITELER.flatMap((u) => u.dersler.filter((d) => !d.tekrar && d.gramer.length).map((d) => ({ u, d })));
  return (
    <div className="sayfa">
      <Ust aktif="gramer" />
      <main className="calisma">
        <header className="calisma-kapak">
          <h1>Gramer</h1>
          <p className="giris">
            Her konu üç adım: <b>önce kendini dene</b>, sonra kalıbı örneklerle öğren, sonra <b>yeniden dene</b>. Sonunda ne kadar ilerlediğini görürsün. Kuralları
            ezberlemek yerine kalıpları sesli tekrar et; Türkçe karşılaştırma sadece sık yapılan hatalarda.
          </p>
        </header>

        <div className="calisma-tek">
          <section aria-labelledby="konular-b">
            <h2 id="konular-b" className="gk-bolum">
              A1 konuları
            </h2>
            <GramerListe />
          </section>

          <section className="calisma-blok yaprak" aria-labelledby="yakinda-b">
            <h2 id="yakinda-b">Hazırlanıyor</h2>
            <ul className="gk-yakinda">
              {GRAMER_YAKINDA.map((y) => (
                <li key={y.baslik}>
                  <span className="rozet sade">{y.seviye}</span> {y.baslik}
                </li>
              ))}
            </ul>
          </section>

          <section className="calisma-blok yaprak" aria-labelledby="dersler-b">
            <h2 id="dersler-b">Derslerdeki gramer bölümleri</h2>
            <p className="not">Her dersin gramer bölümü burada da var. Bir dersi açıp tekrar okuyabilir, dersine gidebilirsin.</p>
            <div className="konu-liste">
              {konular.map(({ u, d }) => (
                <details key={d.kod} className="konu">
                  <summary>
                    <span className="konu-no">
                      {u.sira}.{d.no}
                    </span>
                    <span className="konu-ad">{d.gramer.map((g) => g.baslik).join(", ")}</span>
                  </summary>
                  <div className="konu-ic">
                    <Gramer bolumler={d.gramer} />
                    <Link href={`/uniteler/${u.kod}/${d.no}#gramer`} className="dugme kucuk">
                      Derse git: {u.sira}.{d.no} {d.baslik}
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="calisma-blok yaprak" aria-labelledby="ses-b">
            <h2 id="ses-b">Sesler ve okunuş</h2>
            <p className="not">Kelimelerin yanındaki /ˈmʌðə/ gibi yazılar ne demek? Türkçede olmayan sesler hangileri?</p>
            <Link href="/sesler" className="dugme">
              Ses rehberini aç
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { COZUM_ORNEKLERI, EK_ANAHTARI, UNITELER } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { Gramer } from "@/components/unite/Gramer";
import { EkRehberi } from "@/components/EkRehberi";
import "../pratik/pratik.css";
import "../uniteler/unite.css";
import "../calisma.css";

export const metadata: Metadata = { title: "Gramer" };

/** "I [am] tired." → vurgulu */
function V({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\[[^\]]+\])/g).map((p, i) =>
        p.startsWith("[") ? (
          <mark key={i} className="ek-vurgu">
            {p.slice(1, -1)}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function GramerSayfasi() {
  const konular = UNITELER.flatMap((u) => u.dersler.filter((d) => !d.tekrar && d.gramer.length).map((d) => ({ u, d })));
  return (
    <div className="sayfa">
      <Ust aktif="gramer" />
      <main className="calisma">
        <header className="calisma-kapak">
          <h1>Gramer</h1>
          <p className="giris">
            Bütün sır tek cümlede: <b>Türkçede ek olan şey, İngilizcede ayrı bir kelimedir.</b> &quot;Yorgun<mark className="ek-vurgu">um</mark>&quot; tek kelime; İngilizcesi üç kelime: &quot;I{" "}
            <mark className="ek-vurgu">am</mark> tired&quot;. Aşağıdaki anahtar, hangi ekin hangi kelimeye dönüştüğünü gösterir.
          </p>
        </header>

        <div className="calisma-tek">
          <section className="calisma-blok yaprak" aria-labelledby="anahtar">
            <h2 id="anahtar">Ek anahtarı</h2>
            {EK_ANAHTARI.map((b) => (
              <div key={b.baslik} className="anahtar-grup">
                <h3>{b.baslik}</h3>
                <div className="tablo-kap">
                  <table className="anahtar-tablo">
                    <thead>
                      <tr>
                        <th scope="col">Türkçede</th>
                        <th scope="col">İngilizcede</th>
                        <th scope="col">Örnek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b.satirlar.map((s) => (
                        <tr key={s.ek + s.ornek}>
                          <th scope="row">{s.ek}</th>
                          <td>{s.en}</td>
                          <td>
                            <span lang="en">
                              <V t={s.ornek} />
                            </span>
                            <span className="anahtar-tr">
                              <V t={s.tr} />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          <section className="calisma-blok yaprak" aria-labelledby="coz">
            <h2 id="coz">Kelime kelime çöz</h2>
            <p className="not">Uzun bir cümleyi anlamadığında parçalara ayır: her İngilizce kelime, Türkçede bir kelime ya da bir ektir.</p>
            <ul className="coz-liste">
              {COZUM_ORNEKLERI.map((c) => (
                <li key={c.en}>
                  <p className="coz-en" lang="en">
                    <V t={c.en} />
                  </p>
                  <p className="coz-parca">{c.coz}</p>
                  <p className="coz-tr">
                    <V t={c.tr} />
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="calisma-blok yaprak" aria-labelledby="konular">
            <h2 id="konular">Derslerdeki gramer konuları</h2>
            <p className="not">Her dersin gramer bölümü burada da var. Bir konuyu açıp tekrar okuyabilir, dersine gidebilirsin.</p>
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

          <EkRehberi />
        </div>
      </main>
    </div>
  );
}

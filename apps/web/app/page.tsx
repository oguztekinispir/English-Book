import Link from "next/link";
import { CAMP_L, M_SUBJ, M_VERB, aorTR, diagnose, isaretParcala, type Soru } from "@ti/motor";
import { Ust } from "@/components/Ust";
import { Hero } from "@/components/Hero";
import "./ana.css";

// "Nasıl çalışır" örneği: gerçek motor çıktısı (sunucuda hesaplanır)
const ORNEK: Soru = (() => {
  const v = M_VERB.find((x) => x.en === "drink")!,
    s = M_SUBJ.find((x) => x.en === "You")!;
  return {
    tr: `Sen kahve ${aorTR(v, 1, true)}.`,
    en: "You don't drink coffee.",
    kind: "Geniş zaman · olumsuz",
    chips: [],
    alts: [],
    meta: { form: "simple", pol: "neg", s, third: false, v, comp: "coffee", compTr: "kahve", alt: [] },
  };
})();
const ORNEK_CEVAP = "You not drink coffee";
const ORNEK_TESHIS = diagnose(ORNEK, ORNEK_CEVAP);

const GRUPLAR = [...new Set(CAMP_L.map((x) => x.g))];

function Vurgulu({ metin }: { metin: string }) {
  return (
    <>
      {isaretParcala(metin).map((p, i) => (p.vurgu ? <mark key={i}>{p.t === "i" ? "I" : p.t}</mark> : <span key={i}>{p.t}</span>))}
    </>
  );
}

export default function Ana() {
  return (
    <div className="sayfa">
      <Ust aktif="ana" />
      <main>
        <section className="kahraman" aria-labelledby="baslik">
          <div className="kahraman-metin">
            <h1 id="baslik">Türkçedeki ek, İngilizcede ayrı bir kelimedir.</h1>
            <p className="giris">
              Türkçe düşünen biri için yazılmış bir İngilizce defteri. Cümleyi Türkçe görürsün, İngilizcesini yazarsın. Yanlış yaparsan nedenini kendi dilinin
              ekleriyle anlatır.
            </p>
            <div className="cta">
              <Link href="/pratik" className="dugme ana buyuk">
                Pratiğe başla
              </Link>
              <a href="#nasil" className="dugme buyuk">
                Nasıl çalıştığını gör
              </a>
            </div>
          </div>
          <div className="kahraman-gosteri yaprak">
            <Hero />
          </div>
        </section>

        <section className="nasil-bolum" id="nasil" aria-labelledby="nasil-baslik">
          <h2 id="nasil-baslik">Bir cümle, üç adım</h2>
          <ol className="adimlar">
            <li>
              <span className="adim-no">1</span>
              <h3>Türkçe cümleyi görürsün</h3>
              <p className="adim-metin">Her seferinde motorun kurduğu yeni bir cümle. Binlerce farklı cümle var, ezber olmaz.</p>
              <div className="mini yaprak">
                <p className="mini-tr">{ORNEK.tr}</p>
              </div>
            </li>
            <li>
              <span className="adim-no">2</span>
              <h3>İngilizcesini yazarsın</h3>
              <p className="adim-metin">Takılırsan Türkçe cümleyi parçalarına ayırıp hangi ekin nereye gittiğine bakabilirsin.</p>
              <div className="mini yaprak">
                <p className="mini-girdi" lang="en">
                  {ORNEK_CEVAP}
                  <span className="imlec" aria-hidden="true" />
                </p>
              </div>
            </li>
            <li>
              <span className="adim-no">3</span>
              <h3>Nedenini kendi dilinle öğrenirsin</h3>
              <p className="adim-metin">“Yanlış” demekle kalmaz. Hatayı Türkçedeki ekten yola çıkarak anlatır.</p>
              <div className="mini yaprak">
                <ul className="mini-teshis">
                  {ORNEK_TESHIS.map((d, i) => (
                    <li key={i}>
                      <Vurgulu metin={d.metin} />
                    </li>
                  ))}
                </ul>
                <p className="mini-dogru" lang="en">
                  {ORNEK.en}
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="yol-onizleme" aria-labelledby="yol-baslik">
          <div className="yol-onizleme-ust">
            <h2 id="yol-baslik">Cümle yolu: basitten zora 19 seviye</h2>
            <p>
              am / is / are ile başlar, will ile biter. Her seviyede üst üste 5 doğru yapınca sıradaki açılır. Bildiğin yerleri hızlı geçersin, takıldığın yerde
              motor durup öğretir.
            </p>
          </div>
          <div className="yol-serit">
            {GRUPLAR.map((g) => (
              <div className="yol-grup" key={g}>
                <h3>{g}</h3>
                <ol>
                  {CAMP_L.map((x, i) =>
                    x.g === g ? (
                      <li key={i}>
                        <span className="sev-no">{i + 1}</span>
                        <span>
                          <b>{x.t}</b>
                          <small>{x.d}</small>
                        </span>
                      </li>
                    ) : null,
                  )}
                </ol>
              </div>
            ))}
          </div>
          <Link href="/pratik" className="dugme ana buyuk">
            Yola başla
          </Link>
        </section>

        <footer className="alt">
          <p>Motor kurallarla çalışır, yapay zekâ gerekmez. İnternet olmadan da çalışır. Şimdilik ilerlemen bu tarayıcıda saklanır, hesap açman gerekmez.</p>
          <p className="not">Deneme sürümü, 2026.</p>
        </footer>
      </main>
    </div>
  );
}

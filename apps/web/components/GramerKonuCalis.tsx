"use client";
/**
 * Bir gramer konusu üç adımda: önce kendini dene → kalıbı öğren (ve sık hatalar) → yeniden dene.
 * Sonuç tarayıcıda (gramer:<kod>) ve girişliyse cevaplar tablosunda.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dersBul, type GramerKonusu, type TestSorusu } from "@ti/icerik";
import { Gramer } from "@/components/unite/Gramer";
import { cevapKaydet } from "@/lib/kayit";
import { oku, yaz } from "@/lib/depo";

type Adim = "on" | "aciklama" | "son" | "sonuc";
export interface GramerKaydi {
  on?: number;
  son?: number;
  tarih?: string;
}
export const gramerAnahtari = (kod: string) => `gramer:${kod}`;

const karistir = <T,>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export function GramerKonuCalis({ k }: { k: GramerKonusu }) {
  const [adim, setAdim] = useState<Adim>("on");
  const [on, setOn] = useState<number | null>(null);
  const [son, setSon] = useState<number | null>(null);
  const [onceki, setOnceki] = useState<GramerKaydi>({});

  useEffect(() => setOnceki(oku<GramerKaydi>(gramerAnahtari(k.kod), {})), [k.kod]);

  const kaydet = (x: GramerKaydi) => {
    const yeni = { ...oku<GramerKaydi>(gramerAnahtari(k.kod), {}), ...x, tarih: new Date().toISOString() };
    yaz(gramerAnahtari(k.kod), yeni);
  };

  const ADIMLAR: [Adim, string][] = [
    ["on", "Kendini dene"],
    ["aciklama", "Kalıbı öğren"],
    ["son", "Yeniden dene"],
  ];
  const sira = ADIMLAR.findIndex(([a]) => a === adim);

  return (
    <div className="gk">
      <ol className="gk-adimlar" aria-label="Adımlar">
        {ADIMLAR.map(([a, ad], i) => (
          <li key={a} className={adim === a ? "simdi" : i < sira || adim === "sonuc" ? "bitti" : ""} aria-current={adim === a ? "step" : undefined}>
            <span className="gk-no">{i + 1}</span> {ad}
          </li>
        ))}
      </ol>

      {adim === "on" && (
        <section className="yaprak gk-blok">
          <h2>Önce kendini dene</h2>
          <p className="not">
            Konuyu okumadan 5 soru. Bilmiyorsan tahmin etme, “Bilmiyorum” de; sonunda ne kadar ilerlediğini görürsün.
            {onceki.son !== undefined && ` Geçen sefer son testte ${onceki.son} / 5 yapmıştın.`}
          </p>
          <TestBlok
            sorular={k.onTest}
            etiket={`gramer:${k.kod}:on`}
            bitince={(p) => {
              setOn(p);
              kaydet({ on: p });
              setAdim("aciklama");
            }}
          />
          <button type="button" className="dugme sade kucuk" onClick={() => setAdim("aciklama")}>
            Testi atla, doğrudan anlatıma geç
          </button>
        </section>
      )}

      {adim === "aciklama" && (
        <>
          {on !== null && (
            <p className="gk-ara-sonuc" role="status">
              İlk denemede <b>{on} / 5</b>. {on === 5 ? "Konuyu biliyorsun; yine de sık hatalara bir göz at." : "Şimdi kalıbı öğren, sonra yeniden dene."}
            </p>
          )}
          <Gramer bolumler={k.aciklama} />
          <section className="yaprak gk-blok">
            <h2>Türkçe konuşanların sık yaptığı hatalar</h2>
            <ul className="gk-hatalar">
              {k.hatalar.map((h) => (
                <li key={h.yanlis}>
                  <p>
                    <s lang="en">{h.yanlis}</s> <span aria-hidden="true">→</span> <b lang="en">{h.dogru}</b>
                  </p>
                  <p className="not">{h.neden}</p>
                </li>
              ))}
            </ul>
          </section>
          <button type="button" className="dugme ana buyuk" onClick={() => setAdim("son")}>
            Şimdi yeniden dene
          </button>
        </>
      )}

      {adim === "son" && (
        <section className="yaprak gk-blok">
          <h2>Yeniden dene</h2>
          <p className="not">Yeni 5 soru, aynı konu.</p>
          <TestBlok
            sorular={k.sonTest}
            etiket={`gramer:${k.kod}:son`}
            bitince={(p) => {
              setSon(p);
              kaydet({ son: p });
              setAdim("sonuc");
            }}
          />
        </section>
      )}

      {adim === "sonuc" && son !== null && (
        <section className="yaprak gk-blok gk-sonuc">
          <h2>{son >= 4 ? "Bu konu tamam." : "Biraz daha çalışalım."}</h2>
          <p className="gk-puanlar">
            {on !== null && (
              <>
                <span>
                  İlk deneme <b>{on} / 5</b>
                </span>
                <span aria-hidden="true">→</span>
              </>
            )}
            <span>
              Son deneme <b>{son} / 5</b>
            </span>
          </p>
          <p>
            {son >= 4
              ? "Kalıbı kullanabiliyorsun. Kalıcı olması için derslerde ve tekrar kartlarında karşına çıktıkça sesli söyle."
              : "Anlatımı bir kez daha oku ve örnek cümleleri sesli tekrar et; sonra testi yeniden çöz."}
          </p>
          <div className="dugmeler">
            <button
              type="button"
              className={`dugme${son >= 4 ? "" : " ana"}`}
              onClick={() => {
                setOn(null);
                setAdim(son >= 4 ? "on" : "aciklama");
              }}
            >
              {son >= 4 ? "Baştan çöz" : "Anlatıma dön"}
            </button>
            <Link href="/gramer" className={`dugme${son >= 4 ? " ana" : ""}`}>
              Diğer konular
            </Link>
          </div>
          {k.dersler.length > 0 && (
            <p className="not">
              Bu kalıp şu derslerde geçiyor:{" "}
              {k.dersler.map((kod, i) => {
                const b = dersBul(kod);
                return b ? (
                  <span key={kod}>
                    {i > 0 && ", "}
                    <Link href={`/uniteler/${b.u.kod}/${b.d.no}`}>
                      Ders {b.u.sira}.{b.d.no}
                    </Link>
                  </span>
                ) : null;
              })}
              .
            </p>
          )}
        </section>
      )}
    </div>
  );
}

/** Tek tek soru; her cevaptan sonra kısa açıklama */
function TestBlok({ sorular, etiket, bitince }: { sorular: TestSorusu[]; etiket: string; bitince: (puan: number) => void }) {
  const [i, setI] = useState(0);
  const [puan, setPuan] = useState(0);
  const [secim, setSecim] = useState<number | null>(null);
  const s = sorular[i];
  // Seçenekler karışık sırada; doğru cevap indeksini koru
  const sira = useMemo(() => karistir(s.secenekler.map((_, j) => j)), [s]);
  const cevaplandi = secim !== null;
  const bildi = secim === s.dogru;

  const sec = (j: number) => {
    if (cevaplandi) return;
    setSecim(j);
    if (j === s.dogru) setPuan((p) => p + 1);
    cevapKaydet({ kaynak: "alistirma", kural: etiket, dogru: j === s.dogru, soru: s.soru, cevap: j >= 0 ? s.secenekler[j] : "", beklenen: s.secenekler[s.dogru] });
  };
  const ileri = () => {
    if (i + 1 >= sorular.length) return bitince(puan);
    setI(i + 1);
    setSecim(null);
  };

  return (
    <div className="gk-test">
      <p className="gk-sayac">
        Soru {i + 1} / {sorular.length}
      </p>
      <p className="gk-soru" lang={/^“/.test(s.soru) ? "tr" : "en"}>
        {s.soru}
      </p>
      <div className="gk-secenekler">
        {sira.map((j) => (
          <button
            key={j}
            type="button"
            lang="en"
            className={`secenek-dugme${cevaplandi && j === s.dogru ? " dogru" : ""}${secim === j && !bildi ? " yanlis" : ""}`}
            disabled={cevaplandi}
            onClick={() => sec(j)}
          >
            {s.secenekler[j]}
          </button>
        ))}
        <button type="button" className="secenek-dugme bilmiyorum" disabled={cevaplandi} onClick={() => sec(-1)}>
          Bilmiyorum
        </button>
      </div>
      {cevaplandi && (
        <div className={`gk-geri ${bildi ? "iyi" : "kotu"}`} role="status">
          <p>
            <b>{bildi ? "Doğru." : "Doğrusu:"}</b> {!bildi && <span lang="en">{s.secenekler[s.dogru]}</span>} <span className="not">{s.aciklama}</span>
          </p>
          <button type="button" className="dugme ana" onClick={ileri} autoFocus>
            {i + 1 < sorular.length ? "Sonraki" : "Bitir"}
          </button>
        </div>
      )}
    </div>
  );
}

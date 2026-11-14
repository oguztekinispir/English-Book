"use client";
/**
 * Diyalog ve okuma metni: satır satır dinle, Türkçesini aç, "Çöz" ile kelime kelime anlamını gör.
 * Kelime anlamları ünite sözlüğünden otomatik gelir.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { acKisaltma, sozlukteBul, uniteSozlugu, type Diyalog, type Okuma, type Satir, type Unite } from "@ti/icerik";
import { konus, sustur } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { useIlerleme } from "./ortak";

type Kisi = { ad: string; ses: "kadin" | "erkek" };

export function DiyalogOkuyucu({ u, d }: { u: Unite; d: Diyalog }) {
  return <Okuyucu u={u} baslik={d.baslik} sahne={d.sahne} satirlar={d.satirlar} kisiler={d.kisiler} />;
}

export function OkumaOkuyucu({ u, o }: { u: Unite; o: Okuma }) {
  return (
    <>
      <Okuyucu u={u} baslik={o.baslik} satirlar={o.satirlar} duzMetin />
      <DogruYanlis u={u} o={o} />
    </>
  );
}

function Okuyucu({
  u,
  baslik,
  sahne,
  satirlar,
  kisiler,
  duzMetin,
}: {
  u: Unite;
  baslik: string;
  sahne?: string;
  satirlar: Satir[];
  kisiler?: Record<string, Kisi>;
  duzMetin?: boolean;
}) {
  const [turkce, setTurkce] = useState(false);
  const [calan, setCalan] = useState<number | null>(null);
  const durdu = useRef(false);

  useEffect(() => () => sustur(), []);

  const oynat = (i: number) => {
    if (i >= satirlar.length || durdu.current) {
      setCalan(null);
      return;
    }
    setCalan(i);
    const s = satirlar[i];
    konus(s.en, { kim: s.kim && kisiler ? kisiler[s.kim]?.ses : undefined, bitince: () => setTimeout(() => oynat(i + 1), 350) });
  };

  return (
    <article className={`okuyucu yaprak${duzMetin ? " duz" : ""}`}>
      <header className="ok-ust">
        <div>
          <h3>{baslik}</h3>
          {sahne && <p className="not">{sahne}</p>}
        </div>
        <div className="dugmeler">
          {calan === null ? (
            <button
              type="button"
              className="dugme ana"
              onClick={() => {
                durdu.current = false;
                oynat(0);
              }}
            >
              Baştan dinle
            </button>
          ) : (
            <button
              type="button"
              className="dugme ana"
              onClick={() => {
                durdu.current = true;
                sustur();
                setCalan(null);
              }}
            >
              Durdur
            </button>
          )}
          <button type="button" className={`dugme${turkce ? " acik" : ""}`} aria-pressed={turkce} onClick={() => setTurkce((x) => !x)}>
            Türkçesi
          </button>
        </div>
      </header>
      <ol className="satirlar">
        {satirlar.map((s, i) => (
          <SatirGoster key={i} u={u} s={s} kisi={s.kim && kisiler ? kisiler[s.kim] : undefined} turkce={turkce} caliyor={calan === i} />
        ))}
      </ol>
    </article>
  );
}

function SatirGoster({ u, s, kisi, turkce, caliyor }: { u: Unite; s: Satir; kisi?: Kisi; turkce: boolean; caliyor: boolean }) {
  const [coz, setCoz] = useState(false);
  const [tr, setTr] = useState(false);
  const sozluk = useMemo(() => uniteSozlugu(u), [u]);
  const ozel = useMemo(() => new Set(u.ozelIsimler.map((x) => x.toLowerCase())), [u]);
  const parcalar = useMemo(() => {
    // Görünen kelimeler (kısaltmalar olduğu gibi) + her birinin açılımındaki anlamlar
    return s.en.split(/\s+/).map((w) => {
      const temiz = w.replace(/[.,!?]/g, "");
      const acik = acKisaltma(temiz).split(" ");
      const anlam = acik
        .map((x) => (ozel.has(x.toLowerCase()) ? "(isim)" : (sozlukteBul(sozluk, x)?.tr ?? "?")))
        .map((x) => x.split(/[,;]/)[0].replace(/\s*\(.*?\)\s*/g, " ").trim() || x)
        .join(" + ");
      return { w, anlam };
    });
  }, [s.en, sozluk, ozel]);

  return (
    <li className={`satir${caliyor ? " caliyor" : ""}${kisi?.ses === "erkek" ? " erkek" : ""}`}>
      {kisi && (
        <span className="konusan" aria-label={kisi.ad}>
          {kisi.ad}
        </span>
      )}
      <div className="satir-govde">
        {coz ? (
          <p className="cozulmus" lang="en">
            {parcalar.map((p, i) => (
              <span key={i}>
                <b>{p.w}</b>
                <i>{p.anlam}</i>
              </span>
            ))}
          </p>
        ) : (
          <p className="satir-en" lang="en">
            {s.en}
          </p>
        )}
        {(turkce || tr) && <p className="satir-tr">{s.tr}</p>}
      </div>
      <div className="satir-dugme">
        <button type="button" className="ses" onClick={() => konus(s.en, { kim: kisi?.ses })} aria-label="Bu satırı dinle" title="Dinle">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
            <path d="M10.5 5.2a3.8 3.8 0 0 1 0 5.6M12.4 3.4a6.3 6.3 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" className={`mini-dugme${coz ? " acik" : ""}`} aria-pressed={coz} onClick={() => setCoz((x) => !x)} title="Kelime kelime çöz">
          Çöz
        </button>
        {!turkce && (
          <button type="button" className={`mini-dugme${tr ? " acik" : ""}`} aria-pressed={tr} onClick={() => setTr((x) => !x)} title="Bu satırın Türkçesi">
            TR
          </button>
        )}
      </div>
    </li>
  );
}

function DogruYanlis({ u, o }: { u: Unite; o: Okuma }) {
  const [, setIlerleme] = useIlerleme(u.kod);
  const [cev, setCev] = useState<Record<number, boolean>>({});
  const bitti = Object.keys(cev).length === o.sorular.length;
  const dogru = o.sorular.filter((s, i) => cev[i] === s.dogru).length;
  useEffect(() => {
    if (bitti) setIlerleme((p) => ({ ...p, okuma: Math.max(p.okuma ?? 0, dogru) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  return (
    <section className="dy yaprak" aria-labelledby="dy-b">
      <h3 id="dy-b">Doğru mu, yanlış mı?</h3>
      <ol>
        {o.sorular.map((s, i) => {
          const c = cev[i];
          const cevaplandi = c !== undefined;
          return (
            <li key={i} className={cevaplandi ? (c === s.dogru ? "iyi" : "kotu") : ""}>
              <span lang="en">{s.en}</span>
              <div className="dugmeler">
                {[true, false].map((b) => (
                  <button
                    key={String(b)}
                    type="button"
                    className={`dugme kucuk${cevaplandi && c === b ? " secildi" : ""}`}
                    disabled={cevaplandi}
                    onClick={() => {
                      setCev((x) => ({ ...x, [i]: b }));
                      cevapKaydet({ kaynak: "alistirma", dogru: b === s.dogru, soru: s.en, cevap: b ? "Doğru" : "Yanlış", beklenen: s.dogru ? "Doğru" : "Yanlış", unite_id: u.id });
                    }}
                  >
                    {b ? "Doğru" : "Yanlış"}
                  </button>
                ))}
              </div>
              {cevaplandi && (
                <small>
                  {c === s.dogru ? "Evet. " : "Hayır. "}
                  {s.tr} {s.dogru ? "(doğru)" : "(yanlış)"}
                </small>
              )}
            </li>
          );
        })}
      </ol>
      {bitti && (
        <p className="form-bilgi">
          {o.sorular.length} sorudan {dogru} tanesini doğru bildin.
        </p>
      )}
    </section>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import type { Ders, Kelime, Unite } from "@ti/icerik";
import { bilemedi, biliyorumDe } from "@/lib/tekrar";
import { useKalici } from "@/lib/depo";
import { konus } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { SesDugmesi } from "../Kucukler";
import { karistir, useIlerleme } from "./ortak";

export function Kelimeler({ u, d }: { u: Unite; d: Ders }) {
  const [grup, setGrup] = useState(0);
  const [kartModu, setKartModu] = useState(false);
  const [bilinen, setBilinen] = useKalici<string[]>("bilinen", []);
  const [trAcik, setTrAcik] = useKalici<boolean>("kelime-tr-acik", false);
  const [acilan, setAcilan] = useState<Set<string>>(new Set());
  const [sira, setSira] = useState<Kelime[] | null>(null);
  const [, setIlerleme] = useIlerleme(d.kod);
  const g = d.kelimeGruplari[grup];
  const liste = sira ?? g.kelimeler;
  const anahtar = (k: Kelime) => `${u.kod}:${k.en}`;
  const bilinenSet = new Set(bilinen);
  const tumu = d.kelimeGruplari.flatMap((x) => x.kelimeler);
  const grupBilinen = g.kelimeler.filter((k) => bilinenSet.has(anahtar(k))).length;
  const dersBilinen = tumu.filter((k) => bilinenSet.has(anahtar(k))).length;

  const isaretle = (k: Kelime) => {
    const a = anahtar(k);
    const evet = !bilinenSet.has(a);
    biliyorumDe(a, evet);
    const yeni = evet ? [...bilinen, a] : bilinen.filter((x) => x !== a);
    setBilinen(yeni);
    setIlerleme((p) => ({ ...p, bilinen: tumu.filter((x) => yeni.includes(anahtar(x))).length }));
  };
  const ac = (en: string) => setAcilan((s) => new Set(s).add(en));

  return (
    <div className="kelimeler">
      <div className="grup-sekme" role="tablist" aria-label="Kelime grupları">
        {d.kelimeGruplari.map((x, i) => (
          <button
            key={x.ad}
            role="tab"
            aria-selected={grup === i}
            onClick={() => {
              setGrup(i);
              setSira(null);
              setAcilan(new Set());
            }}
          >
            {x.ad} <small>{x.kelimeler.length}</small>
          </button>
        ))}
      </div>

      {kartModu ? (
        <KartModu u={u} d={d} kelimeler={g.kelimeler} kapat={() => setKartModu(false)} />
      ) : (
        <>
          <div className="kelime-ust">
            <p className="not">
              {trAcik ? "Kelimeye dokununca sesini duyarsın." : "Önce kendin tahmin et, sonra karta dokun: Türkçesi açılsın."} Bildiğin kelimeye <b>Biliyorum</b> de; kart soluklaşır ve 2 gün sonra
              tekrar kartında sorulur.
            </p>
            <button type="button" className="dugme ana" onClick={() => setKartModu(true)}>
              Kendini dene: {g.ad.toLocaleLowerCase("tr")}
            </button>
          </div>
          <div className="kelime-arac">
            <p className="kelime-sayac" aria-live="polite">
              <b>
                {grupBilinen} / {g.kelimeler.length}
              </b>{" "}
              biliyorum
              {d.kelimeGruplari.length > 1 && (
                <small>
                  {" "}
                  (bu derste {dersBilinen} / {tumu.length})
                </small>
              )}
            </p>
            <div className="dugmeler">
              <button type="button" className="dugme kucuk" onClick={() => setSira(karistir(g.kelimeler))}>
                Karıştır
              </button>
              <button
                type="button"
                className="dugme kucuk"
                aria-pressed={trAcik}
                onClick={() => {
                  setTrAcik(!trAcik);
                  setAcilan(new Set());
                }}
              >
                {trAcik ? "Türkçeleri gizle" : "Türkçeleri göster"}
              </button>
            </div>
          </div>
          <ul className="kelime-izgara">
            {liste.map((k) => (
              <KelimeKarti key={k.en} k={k} trGorunur={trAcik || acilan.has(k.en)} ac={() => ac(k.en)} biliyor={bilinenSet.has(anahtar(k))} isaretle={() => isaretle(k)} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function KelimeKarti({ k, trGorunur, ac, biliyor, isaretle }: { k: Kelime; trGorunur: boolean; ac: () => void; biliyor: boolean; isaretle: () => void }) {
  return (
    <li className={`kelime-karti${biliyor ? " biliyor" : ""}`}>
      <button type="button" className="kk-ust" onClick={() => konus(k.en)} aria-label={`${k.en}, dinle`}>
        <b lang="en">{k.en}</b>
        <span className="kk-ok">{k.ok}</span>
        <span className="kk-ses" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
            <path d="M10.5 5.2a3.8 3.8 0 0 1 0 5.6M12.4 3.4a6.3 6.3 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {trGorunur ? (
        <div className="kk-acik">
          <p className="kk-tr">{k.tr}</p>
          {k.ornek && (
            <p className="kk-ornek">
              <span lang="en">{k.ornek[0]}</span>
              <SesDugmesi metin={k.ornek[0]} />
              <small>{k.ornek[1]}</small>
            </p>
          )}
          {k.ipucu && <p className="kk-ipucu">{k.ipucu}</p>}
        </div>
      ) : (
        <button type="button" className="kk-ac" onClick={ac}>
          Türkçesi?
        </button>
      )}
      <button type="button" className={`kk-bil${biliyor ? " geri" : ""}`} aria-pressed={biliyor} onClick={isaretle}>
        {biliyor ? "↺ Geri al" : "✓ Biliyorum"}
      </button>
    </li>
  );
}

/** Türkçesini gör → İngilizcesini düşün → çevir → bildim / bilemedim */
function KartModu({ u, d, kelimeler, kapat }: { u: Unite; d: Ders; kelimeler: Kelime[]; kapat: () => void }) {
  const [, setIlerleme] = useIlerleme(d.kod);
  const deste = useMemo(() => karistir(kelimeler), [kelimeler]);
  const [sira, setSira] = useState(0);
  const [acik, setAcik] = useState(false);
  const [bildim, setBildim] = useState<string[]>([]);
  const [tekrar, setTekrar] = useState<Kelime[]>([]);
  const k = deste[sira];
  const bitti = !k;
  useEffect(() => {
    if (bitti) setIlerleme((p) => ({ ...p, kart: Math.max(p.kart ?? 0, bildim.length) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  const cevap = (b: boolean) => {
    cevapKaydet({ kaynak: "tekrar", dogru: b, soru: k.tr, beklenen: k.en, unite_id: u.id, ders: d.kod });
    if (!b) bilemedi(`${u.kod}:${k.en}`);
    if (b) setBildim((x) => [...x, k.en]);
    else setTekrar((x) => [...x, k]);
    setAcik(false);
    setSira((s) => s + 1);
  };

  if (!k) {
    const n = bildim.length;
    return (
      <div className="kart-sonuc yaprak">
        <h3>
          {deste.length} kelimeden {n} tanesini bildin.
        </h3>
        {tekrar.length > 0 && (
          <>
            <p className="not">Bunlara bir daha bak:</p>
            <ul className="tekrar-liste">
              {tekrar.map((x) => (
                <li key={x.en}>
                  <b lang="en">{x.en}</b> <span>{x.tr}</span> <SesDugmesi metin={x.en} />
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="dugmeler">
          <button
            type="button"
            className="dugme ana"
            onClick={() => {
              setSira(0);
              setBildim([]);
              setTekrar([]);
            }}
          >
            Baştan
          </button>
          <button type="button" className="dugme" onClick={kapat}>
            Kartlara dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kart-modu yaprak">
      <div className="km-ust">
        <span className="not">
          {sira + 1} / {deste.length}
        </span>
        <button type="button" className="dugme sade kucuk" onClick={kapat}>
          Bitir
        </button>
      </div>
      <p className="km-tr">{k.tr}</p>
      {acik ? (
        <>
          <p className="km-en" lang="en">
            {k.en} <SesDugmesi metin={k.en} />
          </p>
          <p className="kk-ok">{k.ok}</p>
          <div className="dugmeler orta">
            <button type="button" className="dugme bildim" autoFocus onClick={() => cevap(true)}>
              Bildim
            </button>
            <button type="button" className="dugme bilemedim" onClick={() => cevap(false)}>
              Bilemedim
            </button>
          </div>
        </>
      ) : (
        <div className="dugmeler orta">
          <p className="not">İngilizcesini aklından söyle, sonra çevir.</p>
          <button
            type="button"
            className="dugme ana buyuk"
            autoFocus
            onClick={() => {
              setAcik(true);
              konus(k.en);
            }}
          >
            Çevir
          </button>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import type { Kelime, Unite } from "@ti/icerik";
import { konus } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { SesDugmesi } from "../Kucukler";
import { karistir, useIlerleme } from "./ortak";

export function Kelimeler({ u }: { u: Unite }) {
  const [grup, setGrup] = useState(0);
  const [kartModu, setKartModu] = useState(false);
  const g = u.kelimeGruplari[grup];

  return (
    <div className="kelimeler">
      <div className="grup-sekme" role="tablist" aria-label="Kelime grupları">
        {u.kelimeGruplari.map((x, i) => (
          <button key={x.ad} role="tab" aria-selected={grup === i} onClick={() => setGrup(i)}>
            {x.ad} <small>{x.kelimeler.length}</small>
          </button>
        ))}
      </div>

      {kartModu ? (
        <KartModu u={u} kelimeler={g.kelimeler} kapat={() => setKartModu(false)} />
      ) : (
        <>
          <div className="kelime-ust">
            <p className="not">Karta dokununca sesi duyarsın. Okunuş Türkçe harflerle yazıldı; th sesini kelimenin notunda anlattık.</p>
            <button type="button" className="dugme ana" onClick={() => setKartModu(true)}>
              Kendini dene: {g.ad.toLocaleLowerCase("tr")}
            </button>
          </div>
          <ul className="kelime-izgara">
            {g.kelimeler.map((k) => (
              <KelimeKarti key={k.en} k={k} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function KelimeKarti({ k }: { k: Kelime }) {
  return (
    <li className="kelime-karti">
      <button type="button" className="kk-ust" onClick={() => konus(k.en)} aria-label={`${k.en}, dinle`}>
        <b lang="en">{k.en}</b>
        <span className="kk-ok">{k.ok}</span>
      </button>
      <p className="kk-tr">{k.tr}</p>
      {k.ornek && (
        <p className="kk-ornek">
          <span lang="en">{k.ornek[0]}</span>
          <SesDugmesi metin={k.ornek[0]} />
          <small>{k.ornek[1]}</small>
        </p>
      )}
      {k.ipucu && <p className="kk-ipucu">{k.ipucu}</p>}
    </li>
  );
}

/** Türkçesini gör → İngilizcesini düşün → çevir → bildim / bilemedim */
function KartModu({ u, kelimeler, kapat }: { u: Unite; kelimeler: Kelime[]; kapat: () => void }) {
  const [, setIlerleme] = useIlerleme(u.kod);
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
    cevapKaydet({ kaynak: "tekrar", dogru: b, soru: k.tr, beklenen: k.en, unite_id: u.id });
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

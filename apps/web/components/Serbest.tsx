"use client";
import { useEffect, useRef, useState } from "react";
import { createFreshGen, type Ayar, type Kalip, type Kutup, type Meta, type Soru } from "@ti/motor";
import { useKalici } from "@/lib/depo";
import { SoruKarti } from "./SoruKarti";

const KUTULAR: [keyof Ayar, string][] = [
  ["be", "am / is / are"],
  ["bePast", "was / were"],
  ["simple", "Geniş zaman (I work)"],
  ["past", "Geçmiş zaman (I worked)"],
  ["can", "can (yapabilmek)"],
  ["will", "will (gelecek)"],
  ["neg", "Olumsuz"],
  ["q", "Soru"],
];

export interface Zorla {
  form: Kalip;
  pol: Kutup;
  /** her "Bunu çalış" tıklamasında artar */
  n: number;
}

export function Serbest({ onSonuc, zorla }: { onSonuc: (ok: boolean, m: Meta) => void; zorla: Zorla | null }) {
  const [ayar, setAyar, hazir] = useKalici<Ayar>("serbest-ayar", { be: true, bePast: true, simple: true, past: true, neg: true, q: true });
  const gen = useRef<ReturnType<typeof createFreshGen> | null>(null);
  const [soru, setSoru] = useState<Soru | null>(null);
  const [tekrar, setTekrar] = useState(false);
  const [n, setN] = useState(0);
  const [seri, setSeri] = useState(0);

  const yeni = (a: Ayar, f?: { form: Kalip; pol: Kutup } | null) => {
    gen.current ??= createFreshGen();
    setSoru(gen.current(a, f || null));
    setTekrar(!!f);
    setN((x) => x + 1);
  };
  useEffect(() => {
    if (hazir) yeni(ayar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hazir]);
  useEffect(() => {
    if (zorla && hazir) yeni(ayar, zorla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zorla?.n]);

  return (
    <div className="serbest">
      <fieldset className="ayarlar">
        <legend>Hangi kalıplar gelsin?</legend>
        {KUTULAR.map(([k, l]) => (
          <label key={k} className={ayar[k] ? "secili" : ""}>
            <input
              type="checkbox"
              checked={!!ayar[k]}
              onChange={(e) => {
                const a = { ...ayar, [k]: e.target.checked };
                setAyar(a);
                yeni(a);
              }}
            />
            {l}
          </label>
        ))}
      </fieldset>
      <p className="not">Kutuların hepsi açıkken zordur. Cümle yolunda geçtiğin kalıpları burada aç. Kesme işaretsiz yazım (dont, didnt, im) da kabul edilir.</p>
      <p className="serbest-seri" aria-live="polite">
        Seri: <b>{seri}</b>
        {tekrar && <span className="pul">Aynı kuraldan yeni cümle</span>}
      </p>
      {soru ? (
        <SoruKarti
          key={n}
          soru={soru}
          onKontrol={(ok) => {
            setSeri(ok ? seri + 1 : 0);
            onSonuc(ok, soru.meta);
          }}
          aksiyonlar={(ok) =>
            ok ? (
              <button type="button" className="dugme ana" autoFocus onClick={() => yeni(ayar)}>
                Sonraki cümle
              </button>
            ) : (
              <>
                <button type="button" className="dugme ana" autoFocus onClick={() => yeni(ayar, { form: soru.meta.form, pol: soru.meta.pol })}>
                  Aynı kuraldan bir tane daha
                </button>
                <button type="button" className="dugme" onClick={() => yeni(ayar)}>
                  Başka cümle
                </button>
              </>
            )
          }
        />
      ) : (
        <div className="soru-karti yaprak bos" aria-busy="true" />
      )}
    </div>
  );
}

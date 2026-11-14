"use client";
import { useState } from "react";
import type { GramerBolum, HazirKalip } from "@ti/icerik";
import { SesDugmesi } from "../Kucukler";

/** "I [am] a student." → köşeli parantezli kısımlar sarı vurgulu */
function Vurgu({ metin }: { metin: string }) {
  return (
    <>
      {metin.split(/(\[[^\]]+\])/g).map((p, i) =>
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

export function Gramer({ bolumler, kesfet = false }: { bolumler: GramerBolum[]; kesfet?: boolean }) {
  return (
    <div className="gramer">
      {bolumler.map((g, i) => (
        <GramerBolumu key={i} g={g} kesfet={kesfet} />
      ))}
    </div>
  );
}

/** Önce örnekler: öğrenci kuralı kendisi tahmin eder, sonra açıklamayı açar. */
function GramerBolumu({ g, kesfet }: { g: GramerBolum; kesfet: boolean }) {
  const tahmin = kesfet && !!g.ornekler?.length;
  const [acik, setAcik] = useState(!tahmin);
  return (
        <section className="gramer-bolum yaprak">
          <h3>{g.baslik}</h3>
          {tahmin && !acik && <p className="gramer-soru">Önce örneklere bak. Sarı kısımlar neye dönüşüyor? Sence kural ne?</p>}
          {acik && !tahmin && g.metin.map((m, j) => <p key={j}>{m}</p>)}
          {g.ornekler && (
            <ul className="gramer-ornek">
              {g.ornekler.map((o, j) => {
                const duz = o.en.replace(/[[\]]/g, "");
                return (
                  <li key={j}>
                    <span className="go-tr">
                      {o.tr.map((p, k) => (k === 0 ? <span key={k}>{p}</span> : <mark key={k}>{p}</mark>))}
                    </span>
                    <span className="go-ok" aria-hidden="true">
                      →
                    </span>
                    <span className="go-en" lang="en">
                      <Vurgu metin={o.en} />
                    </span>
                    {/^[A-Z]/.test(duz) && <SesDugmesi metin={duz} />}
                  </li>
                );
              })}
            </ul>
          )}
          {tahmin && !acik && (
            <button type="button" className="dugme" onClick={() => setAcik(true)}>
              Tahmin ettim, kuralı göster
            </button>
          )}
          {tahmin && acik && (
            <div className="gramer-kural">
              {g.metin.map((m, j) => (
                <p key={j}>{m}</p>
              ))}
            </div>
          )}
          {acik && g.notlar && (
            <ul className="gramer-not">
              {g.notlar.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </section>
  );
}

export function Kaliplar({ kaliplar }: { kaliplar: HazirKalip[] }) {
  return (
    <ul className="kalip-liste">
      {kaliplar.map((k) => (
        <li key={k.en} className="yaprak">
          <span className="kl-en" lang="en">
            {k.en}
          </span>
          <SesDugmesi metin={k.en} />
          <span className="kl-tr">{k.tr}</span>
          {k.not && <small>{k.not}</small>}
        </li>
      ))}
    </ul>
  );
}

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

export function Gramer({ bolumler }: { bolumler: GramerBolum[] }) {
  return (
    <div className="gramer">
      {bolumler.map((g, i) => (
        <section key={i} className="gramer-bolum yaprak">
          <h3>{g.baslik}</h3>
          {g.metin.map((m, j) => (
            <p key={j}>{m}</p>
          ))}
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
          {g.notlar && (
            <ul className="gramer-not">
              {g.notlar.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
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

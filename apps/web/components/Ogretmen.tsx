"use client";
import { useMemo } from "react";
import { RULES, diagnose, genItem, ruleKey, siraHatasi, type Malzeme, type Soru } from "@ti/motor";
import { TAM } from "@/lib/motor-yardim";
import { Isaretli, SesDugmesi } from "./Kucukler";
import { KelimeSirasi } from "./Parcalama";

/** Yanlış cevaptan sonra: neyi yanlış yaptın + kural + aynı kuraldan örnekler. Yapay zekâsız. */
export function Ogretmen({ soru, cevap, malzeme }: { soru: Soru; cevap: string; malzeme?: Malzeme }) {
  const d = useMemo(() => (cevap ? diagnose(soru, cevap) : []), [soru, cevap]);
  const R = RULES[ruleKey(soru.meta)];
  const ornekler = useMemo(() => {
    const out: Soru[] = [];
    for (let i = 0; i < 14 && out.length < 2; i++) {
      const x = genItem(TAM, { form: soru.meta.form, pol: soru.meta.pol }, Math.random, malzeme);
      if (x.en !== soru.en && !out.some((y) => y.en === x.en)) out.push(x);
    }
    return out;
  }, [soru, malzeme]);

  return (
    <div className="ogretmen">
      {d.length ? (
        <section className="bolum">
          <h4>Neyi yanlış yaptın</h4>
          <ul className="teshis">
            {d.map((x, i) => (
              <li key={i} className={x.tur}>
                <Isaretli metin={x.metin} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="bolum">
          <h4>Bir dahaki sefere</h4>
          <p className="ipucu-kutusu">Önce Türkçe cümledeki ekleri bul, sonra aşağıdaki formüle yerleştir.</p>
        </section>
      )}
      {siraHatasi(d) && <KelimeSirasi soru={soru} />}
      <section className="bolum kural">
        <h4>Kural: {R.t}</h4>
        <p className="formul">{R.f}</p>
        <p className="kural-metni">{R.r}</p>
      </section>
      {ornekler.length > 0 && (
        <section className="bolum">
          <h4>Aynı kuraldan örnekler</h4>
          <ul className="ornekler">
            {ornekler.map((x) => (
              <li key={x.en}>
                <SesDugmesi metin={x.en} />
                <span>
                  <b>{x.en}</b>
                  <span className="not">{x.tr}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

"use client";
import { orderNote, orderRows, trSeg, type Soru } from "@ti/motor";
import { SLOT_AD } from "@/lib/motor-yardim";
import { Isaretli } from "./Kucukler";

export function Parcalama({ soru, baslik = "Türkçe cümleyi parçalayalım" }: { soru: Soru; baslik?: string }) {
  const W = trSeg(soru.meta);
  if (!W) return null;
  return (
    <section className="bolum parcala" aria-label={baslik}>
      <h4>{baslik}</h4>
      <div className="parcalar">
        {W.map((w, i) => (
          <span className="kelime" key={i}>
            {w.map(([t, l, k], j) => (
              <span className={`parca ${k}`} key={j}>
                <b>{t}</b>
                <i>{l}</i>
              </span>
            ))}
          </span>
        ))}
      </div>
      <p className="lejant">
        <span style={{ ["--sw" as string]: "var(--kok)" }}>kök, kelimenin anlamı</span>
        <span style={{ ["--sw" as string]: "var(--ek)" }}>ek, İngilizcede ayrı kelime olur</span>
        <span style={{ ["--sw" as string]: "var(--kisi)" }}>kim</span>
      </p>
    </section>
  );
}

export function KelimeSirasi({ soru, gizli }: { soru: Soru; gizli?: boolean }) {
  const { tr, en } = orderRows(soru);
  const m = soru.meta;
  const ekli = (slot: string) => slot === "fiil" && m.pol === "pos" && (m.form === "past" || (m.form === "simple" && m.third));
  return (
    <section className="bolum sira" aria-label="Kelime sırası">
      <h4>{gizli ? "İngilizce cümlenin kalıbı" : "Kelime sırası"}</h4>
      {!gizli && (
        <div className="sira-satir">
          <span className="sira-etiket">Türkçe</span>
          {tr.map(([w, k], i) => (
            <span key={i} className="sira-satir" style={{ gap: 6 }}>
              {i > 0 && <span className="sira-ok">›</span>}
              <span className={`kutu ${k}`}>
                <b>{w}</b>
                <i>{SLOT_AD[k]}</i>
              </span>
            </span>
          ))}
        </div>
      )}
      <div className="sira-satir">
        {!gizli && <span className="sira-etiket">İngilizce</span>}
        {en.map(([w, k], i) => (
          <span key={i} className="sira-satir" style={{ gap: 6 }}>
            {i > 0 && <span className="sira-ok">›</span>}
            <span className={`kutu ${k}${ekli(k) ? " ekli" : ""}`}>
              <b>{gizli ? "?" : w}</b>
              <i>{SLOT_AD[k]}</i>
            </span>
          </span>
        ))}
      </div>
      <p className="not">
        <Isaretli metin={orderNote(m)} />
      </p>
    </section>
  );
}

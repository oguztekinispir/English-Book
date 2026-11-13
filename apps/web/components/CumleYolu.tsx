"use client";
import { useEffect, useRef, useState } from "react";
import { CAMP_L, createFreshGen, pick, type Meta, type Soru } from "@ti/motor";
import { useKalici } from "@/lib/depo";
import { TAM } from "@/lib/motor-yardim";
import { SoruKarti } from "./SoruKarti";

const GRUPLAR = [...new Set(CAMP_L.map((x) => x.g))];
const HEDEF = 5;

export function CumleYolu({ onSonuc }: { onSonuc: (ok: boolean, m: Meta) => void }) {
  const [yol, setYol, hazir] = useKalici("yol", { lvl: 0, max: 0 });
  const gen = useRef<ReturnType<typeof createFreshGen> | null>(null);
  const [soru, setSoru] = useState<Soru | null>(null);
  const [n, setN] = useState(0);
  const [seri, setSeri] = useState(0);
  const [atladi, setAtladi] = useState(false);
  const [hepsi, setHepsi] = useState(false);

  const yeni = (lvl: number) => {
    gen.current ??= createFreshGen();
    const [form, pol] = pick(CAMP_L[lvl].c);
    setSoru(gen.current(TAM, { form, pol }));
    setN((x) => x + 1);
    setAtladi(false);
  };
  useEffect(() => {
    if (hazir) yeni(yol.lvl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hazir]);

  const seviyeyeGit = (i: number) => {
    if (i > yol.max) return;
    setYol((y) => ({ ...y, lvl: i }));
    setSeri(0);
    yeni(i);
  };

  const L = CAMP_L[yol.lvl] ?? CAMP_L[0];
  const yuzde = Math.round((yol.max / (CAMP_L.length - 1)) * 100);
  const sonSeviye = yol.lvl + 1 >= CAMP_L.length;

  const seviyeDugmesi = (i: number) => {
    const x = CAMP_L[i],
      kilitli = i > yol.max,
      gecti = i < yol.max,
      burada = i === yol.lvl;
    return (
      <button
        key={i}
        type="button"
        className={`sev${burada ? " burada" : ""}${gecti ? " gecti" : ""}`}
        disabled={kilitli}
        onClick={() => seviyeyeGit(i)}
        aria-current={burada ? "step" : undefined}
        title={kilitli ? "Önceki seviyede üst üste 5 doğru yapınca açılır" : x.d}
      >
        <span className="sev-no">{kilitli ? <Kilit /> : gecti ? "✓" : i + 1}</span>
        {x.t}
      </button>
    );
  };

  return (
    <div className="yol">
      <div className="yol-ust">
        <div>
          <p className="yol-konum">
            Seviye {yol.lvl + 1} / {CAMP_L.length}, {L.g.toLocaleLowerCase("tr")}
          </p>
          <div className="ilerleme" role="progressbar" aria-valuenow={yuzde} aria-valuemin={0} aria-valuemax={100} aria-label="Cümle yolunda ilerleme">
            <i style={{ width: `${Math.max(yuzde, 3)}%` }} />
          </div>
        </div>
        <div className="seri" aria-label={`Üst üste ${Math.min(seri, HEDEF)} doğru, hedef ${HEDEF}`}>
          {Array.from({ length: HEDEF }, (_, i) => (
            <span key={i} className={i < seri ? "dolu" : ""} />
          ))}
          <small>üst üste {Math.min(seri, HEDEF)} / {HEDEF}</small>
        </div>
      </div>

      <div className="seviyeler">
        {(hepsi ? GRUPLAR : [L.g]).map((g) => (
          <div className="grup" key={g}>
            <span className="grup-ad">{g}</span>
            <div className="grup-sev">{CAMP_L.map((x, i) => (x.g === g ? seviyeDugmesi(i) : null))}</div>
          </div>
        ))}
        <button type="button" className="dugme sade kucuk" onClick={() => setHepsi((x) => !x)} aria-expanded={hepsi}>
          {hepsi ? "Sadece bu bölümü göster" : `Bütün yolu göster (${GRUPLAR.length} bölüm)`}
        </button>
      </div>

      <p className="seviye-aciklama">
        <b>{L.t}</b>
        <span>{L.d}</span>
      </p>

      {soru ? (
        <SoruKarti
          key={n}
          soru={soru}
          seviye={L}
          formulGoster
          onSecim={(d) => {
            if (!d) setSeri(0);
          }}
          onKontrol={(ok) => {
            const s = ok ? seri + 1 : 0;
            setSeri(s);
            onSonuc(ok, soru.meta);
            if (s === HEDEF) {
              setAtladi(true);
              if (!sonSeviye && yol.max < yol.lvl + 1) setYol((y) => ({ ...y, max: y.lvl + 1 }));
            }
          }}
          sonucUstu={
            atladi ? (
              <div className="tebrik" role="status">
                {sonSeviye ? (
                  <>
                    <b>Cümle yolunu bitirdin.</b> A1'in bütün temel kalıpları artık senin. Burada pratiğe devam edebilirsin.
                  </>
                ) : (
                  <>
                    <b>Üst üste 5 doğru, seviye {yol.lvl + 1} tamam.</b> Sıradaki seviye açıldı: {CAMP_L[yol.lvl + 1].t}.
                  </>
                )}
              </div>
            ) : null
          }
          aksiyonlar={(ok) =>
            atladi && !sonSeviye ? (
              <>
                <button type="button" className="dugme ana" autoFocus onClick={() => seviyeyeGit(yol.lvl + 1)}>
                  Sıradaki seviyeye geç
                </button>
                <button type="button" className="dugme" onClick={() => yeni(yol.lvl)}>
                  Bu seviyede devam et
                </button>
              </>
            ) : (
              <button type="button" className="dugme ana" autoFocus onClick={() => yeni(yol.lvl)}>
                {ok ? "Sonraki cümle" : "Bir tane daha dene"}
              </button>
            )
          }
        />
      ) : (
        <div className="soru-karti yaprak bos" aria-busy="true" />
      )}
    </div>
  );
}

function Kilit() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-label="kilitli" fill="currentColor">
      <path d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7zm1.5 0h3V5a1.5 1.5 0 0 0-3 0z" />
    </svg>
  );
}

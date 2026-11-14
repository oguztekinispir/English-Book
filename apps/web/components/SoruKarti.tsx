"use client";
import { useEffect, useRef, useState } from "react";
import { PK_ALL, PK_HINT, RULES, inf, kalipSecimiDogru, matchAns, ruleKey, type Kalip, type Malzeme, type Seviye, type Soru } from "@ti/motor";
import { konus } from "@/lib/ses";
import { turParca } from "@/lib/motor-yardim";
import { SesDugmesi } from "./Kucukler";
import { KelimeSirasi, Parcalama } from "./Parcalama";
import { Ogretmen } from "./Ogretmen";

type Adim = "sec" | "yaz" | "bitti";

interface Props {
  soru: Soru;
  /** Cümle yolu seviyesi. Karışık seviyelerde önce "hangi kalıp?" sorulur. */
  seviye?: Seviye;
  formulGoster?: boolean;
  /** Örnek cümleler bu kelimelerle üretilsin (ünite pratiği) */
  malzeme?: Malzeme;
  onSecim?: (dogru: boolean) => void;
  onKontrol: (ok: boolean, cevap: string) => void;
  /** Sonucun üstünde gösterilecek şey (seviye atladın vb.) */
  sonucUstu?: React.ReactNode;
  /** Sonuçtan sonraki düğmeler */
  aksiyonlar: (ok: boolean) => React.ReactNode;
}

export function SoruKarti({ soru, seviye, formulGoster, malzeme, onSecim, onKontrol, sonucUstu, aksiyonlar }: Props) {
  const pk = seviye?.pk;
  const [adim, setAdim] = useState<Adim>(pk ? "sec" : "yaz");
  const [secim, setSecim] = useState<string | null>(null);
  const [cevap, setCevap] = useState("");
  const [sonuc, setSonuc] = useState<{ ok: boolean; typos: [string, string][]; cevap: string } | null>(null);
  const [parcala, setParcala] = useState(false);
  const inp = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adim === "yaz") inp.current?.focus({ preventScroll: true });
  }, [adim]);

  // Kelime aramadan "+ cümleye ekle"
  useEffect(() => {
    const f = (e: Event) => {
      if (adim !== "yaz") return;
      const w = (e as CustomEvent<string>).detail;
      setCevap((c) => (c.trim() ? c.replace(/\s+$/, "") + " " : "") + w);
      inp.current?.focus({ preventScroll: true });
    };
    window.addEventListener("ti-ekle", f);
    return () => window.removeEventListener("ti-ekle", f);
  }, [adim]);

  const sec = (k: string) => {
    setSecim(k);
    setAdim("yaz");
    if (seviye) onSecim?.(kalipSecimiDogru(seviye, k, soru.meta.form));
  };

  const kontrol = (goster: boolean) => {
    const v = goster ? "" : cevap.trim();
    if (!goster && !v) {
      inp.current?.focus();
      return;
    }
    const r = goster ? { ok: false, typos: [] as [string, string][] } : matchAns(soru, v);
    setSonuc({ ...r, cevap: v });
    setAdim("bitti");
    onKontrol(r.ok, v);
    if (r.ok) konus(soru.en);
  };

  const [tur, ...tAlt] = turParca(soru.kind);

  return (
    <article className="soru-karti yaprak" aria-live="polite">
      <div className="soru-ust">
        <span className="tur-etiket">{tur}</span>
        {tAlt.map((x) => (
          <span key={x} className="tur-alt">
            {x}
          </span>
        ))}
      </div>
      <h2 className="turkce" lang="tr">
        {soru.tr}
      </h2>

      {adim === "sec" && seviye && <KalipSec seviye={seviye} onSec={sec} />}

      {adim !== "sec" && seviye?.pk && secim && <SecimSonucu seviye={seviye} soru={soru} secim={secim} />}
      {adim !== "sec" && formulGoster && <p className="formul">{RULES[ruleKey(soru.meta)].f}</p>}

      {adim === "yaz" && (
        <>
          <form
            className="yazma"
            onSubmit={(e) => {
              e.preventDefault();
              kontrol(false);
            }}
          >
            <label htmlFor="cevap" className="gizli-etiket">
              İngilizcesini yaz
            </label>
            <input
              id="cevap"
              ref={inp}
              value={cevap}
              onChange={(e) => setCevap(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="İngilizcesini yaz, Enter'a bas"
              lang="en"
            />
            <button type="submit" className="dugme ana">
              Kontrol et
            </button>
          </form>
          <div className="dugmeler">
            <button type="button" className={`dugme${parcala ? " acik" : ""}`} aria-pressed={parcala} onClick={() => setParcala((x) => !x)}>
              Türkçeyi parçala
            </button>
            <button type="button" className="dugme sade" onClick={() => kontrol(true)}>
              Bilmiyorum, göster
            </button>
          </div>
          {parcala && (
            <div className="ipucu-alani">
              <Parcalama soru={soru} />
              <KelimeSirasi soru={soru} gizli />
            </div>
          )}
        </>
      )}

      {adim === "bitti" && sonuc && (
        <div className="sonuc-alani">
          {sonucUstu}
          <div className={`sonuc ${sonuc.ok ? "dogru" : "yanlis"}`}>
            <p className="sonuc-baslik">{sonuc.ok ? "Doğru" : sonuc.cevap ? "Doğrusu şöyle" : "Cevap"}</p>
            <p className="ingilizce" lang="en">
              {soru.en} <SesDugmesi metin={soru.en} />
            </p>
            {sonuc.ok && sonuc.typos.length > 0 && (
              <p className="not">
                Küçük bir yazım hatası var:{" "}
                {sonuc.typos.map(([a, b], i) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    <s>{a}</s> yerine <b>{b}</b>
                  </span>
                ))}
                . Doğru saydım, yazılışına dikkat et.
              </p>
            )}
            {!sonuc.ok && sonuc.cevap && (
              <p className="senin">
                Senin cevabın: <span lang="en">{sonuc.cevap}</span>
              </p>
            )}
            {soru.alts.length > 0 && <p className="not">Bu da doğru: {soru.alts.join(" / ")}</p>}
          </div>

          <Parcalama soru={soru} />

          <section className="bolum">
            <h4>Hangi parça neye dönüştü</h4>
            <div className="donusum">
              {soru.chips.map(([t, e, s], i) => (
                <span key={i} className={`don${s ? " ek" : ""}`}>
                  <span className="don-tr">{t}</span>
                  <span className="don-en" lang="en">
                    {e}
                  </span>
                </span>
              ))}
            </div>
          </section>

          {!sonuc.ok && <Ogretmen soru={soru} cevap={sonuc.cevap} malzeme={malzeme} />}

          <div className="dugmeler son">{aksiyonlar(sonuc.ok)}</div>
        </div>
      )}
    </article>
  );
}

function KalipSec({ seviye, onSec }: { seviye: Seviye; onSec: (k: string) => void }) {
  if (seviye.pk === "all")
    return (
      <div className="secim">
        <p className="adim">Önce karar ver: bu hangi kalıp? Türkçedeki eke bak.</p>
        <div className="secenekler alti">
          {PK_ALL.map(([k, t, ex]) => (
            <button key={k} type="button" className="secenek" onClick={() => onSec(k)}>
              <b>{t}</b>
              <small>{ex}</small>
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div className="secim">
      <p className="adim">Önce karar ver: bu cümle ne anlatıyor?</p>
      <div className="secenekler">
        <button type="button" className="secenek durum" onClick={() => onSec("d")}>
          <b>Durum</b>
          <small>yorgun, mutlu, aç, evde, işte</small>
        </button>
        <button type="button" className="secenek is" onClick={() => onSec("i")}>
          <b>İş, hareket</b>
          <small>içmek, yürümek, uyumak, gitmek</small>
        </button>
      </div>
    </div>
  );
}

function SecimSonucu({ seviye, soru, secim }: { seviye: Seviye; soru: Soru; secim: string }) {
  const m = soru.meta,
    f: Kalip = m.form,
    ok = kalipSecimiDogru(seviye, secim, f);
  if (seviye.pk === "all") {
    const o = PK_ALL.find((x) => x[0] === f)!;
    return ok ? (
      <p className="secim-sonuc iyi">
        Doğru kalıp: <b>{o[1]}</b>, yani <b>{o[3]}</b>.
      </p>
    ) : (
      <p className="secim-sonuc kotu">
        Bu cümle <b>{o[1]}</b>: {PK_HINT[f]}. Yani <b>{o[3]}</b>.
      </p>
    );
  }
  const durum = f === "be" || f === "bePast",
    past = seviye.pk === "past",
    bw = past ? "was / were" : "am / is / are",
    P = m.pol;
  const dw = past
    ? P === "pos"
      ? "fiilin geçmiş hali (-ed ya da 2. hal), did yok"
      : P === "neg"
        ? "didn't + fiil"
        : "Did başa"
    : P === "pos"
      ? "kim + fiil, do yok (do sadece olumsuzda ve soruda)"
      : P === "neg"
        ? "don't / doesn't + fiil"
        : "Do / Does başa";
  if (ok)
    return (
      <p className="secim-sonuc iyi">
        {durum ? (
          <>
            Evet, durum: “{m.compTr}” bir hal. Durum için <b>{bw}</b>.
          </>
        ) : (
          <>
            Evet, iş: “{inf(m.v!.stem)}” bir hareket. İş için <b>{dw}</b>.
          </>
        )}
      </p>
    );
  return (
    <p className="secim-sonuc kotu">
      {durum ? (
        <>
          Bu cümle durum anlatıyor: “{m.compTr}” bir hal, hareket yok. Durum için <b>{bw}</b> ({past ? "did" : "do"} değil).
        </>
      ) : (
        <>
          Bu cümle iş anlatıyor: “{inf(m.v!.stem)}” bir hareket. İş için <b>{dw}</b> ({bw} değil).
        </>
      )}
    </p>
  );
}

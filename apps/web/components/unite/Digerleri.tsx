"use client";
import { useEffect, useRef, useState } from "react";
import { createFreshGen, pick, ruleKey, type Soru } from "@ti/motor";
import type { Ders, Unite } from "@ti/icerik";
import { cevapKaydet } from "@/lib/kayit";
import { SesDugmesi } from "../Kucukler";
import { SoruKarti } from "../SoruKarti";
import { useIlerleme } from "./ortak";

/* ---------------- Cümle kur (motor, ünite kelimeleriyle) ---------------- */
export function UniteMotoru({ u, d }: { u: Unite; d: Ders }) {
  const [, setIlerleme] = useIlerleme(d.kod);
  const motor = d.motor!;
  const gen = useRef<ReturnType<typeof createFreshGen> | null>(null);
  const [soru, setSoru] = useState<Soru | null>(null);
  const [n, setN] = useState(0);
  const [dogru, setDogru] = useState(0);
  const [toplam, setToplam] = useState(0);

  const yeni = () => {
    gen.current ??= createFreshGen();
    const [form, pol] = pick(motor.kaliplar);
    setSoru(gen.current({}, { form, pol }, motor.malzeme));
    setN((x) => x + 1);
  };
  useEffect(yeni, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="unite-motor">
      <p className="not">
        {motor.aciklama} Bu oturumda {toplam} cümleden {dogru} doğru.
      </p>
      {soru ? (
        <SoruKarti
          key={n}
          soru={soru}
          malzeme={motor.malzeme}
          onKontrol={(ok, cevap) => {
            setToplam((t) => t + 1);
            if (ok) {
              setDogru((d) => d + 1);
              setIlerleme((p) => ({ ...p, motor: (p.motor ?? 0) + 1 }));
            }
            cevapKaydet({ kaynak: "motor", kural: ruleKey(soru.meta), dogru: ok, soru: soru.tr, cevap, beklenen: soru.en, unite_id: u.id, ders: d.kod });
          }}
          aksiyonlar={(ok) => (
            <button type="button" className="dugme ana" autoFocus onClick={yeni}>
              {ok ? "Sonraki cümle" : "Bir tane daha"}
            </button>
          )}
        />
      ) : (
        <div className="soru-karti yaprak bos" />
      )}
    </div>
  );
}

/* ---------------- Konuşma ---------------- */
export function Konusma({ d }: { d: Ders }) {
  return (
    <div className="konusma">
      <p className="not">Soruyu dinle, cevabını sesli söyle. Sonra örnek cevaba bak. Derste öğretmenin bu soruları sana soracak.</p>
      <ol className="konusma-liste">
        {d.konusma.map((k, i) => (
          <KonusmaKart key={i} k={k} />
        ))}
      </ol>
    </div>
  );
}

function KonusmaKart({ k }: { k: Ders["konusma"][number] }) {
  const [tr, setTr] = useState(false);
  const [ornek, setOrnek] = useState(false);
  return (
    <li className="konusma-kart yaprak">
      <p className="kk-soru" lang="en">
        {k.en} <SesDugmesi metin={k.en} />
      </p>
      {tr && <p className="not">{k.tr}</p>}
      {ornek && (
        <p className="kk-ornek-cevap">
          <span lang="en">{k.ornek}</span> <SesDugmesi metin={k.ornek} />
          <small>{k.ornekTr}</small>
        </p>
      )}
      <div className="dugmeler">
        <button type="button" className={`mini-dugme${tr ? " acik" : ""}`} aria-pressed={tr} onClick={() => setTr((x) => !x)}>
          Soru ne diyor?
        </button>
        <button type="button" className={`mini-dugme${ornek ? " acik" : ""}`} aria-pressed={ornek} onClick={() => setOrnek((x) => !x)}>
          Örnek cevap
        </button>
      </div>
    </li>
  );
}

/* ---------------- Ünite testi ---------------- */
export function UniteTesti({ u, d }: { u: Unite; d: Ders }) {
  const [ilerleme, setIlerleme] = useIlerleme(d.kod);
  const sorular = d.test;
  const n = sorular.length;
  const [cev, setCev] = useState<Record<number, number>>({});
  const [tur, setTur] = useState(0);
  const bitti = Object.keys(cev).length === n;
  const puan = sorular.filter((t, i) => cev[i] === t.dogru).length;
  useEffect(() => {
    if (bitti) setIlerleme((p) => ({ ...p, test: Math.max(p.test ?? 0, puan) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  return (
    <div className="test" key={tur}>
      <p className="not">
        {n} soru. Her sorunun cevabını hemen görürsün.
        {ilerleme.test !== undefined && ` En iyi sonucun: ${ilerleme.test} / ${n}.`}
      </p>
      <ol className="test-liste">
        {sorular.map((t, i) => {
          const c = cev[i];
          const cevaplandi = c !== undefined;
          return (
            <li key={i} className={`test-soru yaprak${cevaplandi ? (c === t.dogru ? " iyi" : " kotu") : ""}`}>
              <p className="ts-soru">{t.soru}</p>
              <div className="ts-secenek">
                {t.secenekler.map((s, j) => (
                  <button
                    key={j}
                    type="button"
                    className={`secenek-dugme${cevaplandi && j === t.dogru ? " dogru" : ""}${cevaplandi && j === c && c !== t.dogru ? " yanlis" : ""}`}
                    disabled={cevaplandi}
                    onClick={() => {
                      setCev((x) => ({ ...x, [i]: j }));
                      cevapKaydet({ kaynak: "test", dogru: j === t.dogru, soru: t.soru, cevap: s, beklenen: t.secenekler[t.dogru], unite_id: u.id, ders: d.kod });
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {cevaplandi && <p className="ts-aciklama">{t.aciklama}</p>}
            </li>
          );
        })}
      </ol>
      {bitti && (
        <div className={`test-sonuc ${puan >= n * 0.8 ? "iyi" : "orta"}`} role="status">
          <b>
            {puan} / {n}
          </b>
          <span>
            {puan === n
              ? d.tekrar
                ? "Ünitenin hepsini biliyorsun. Bir sonraki üniteye hazırsın."
                : "Hepsi doğru. Sıradaki derse geçebilirsin."
              : puan >= n * 0.8
                ? "Çok iyi. Yanlış yaptığın sorulara bir daha bak."
                : "Kelimelere ve gramere bir daha bakıp testi tekrar çöz."}
          </span>
          <button
            type="button"
            className="dugme"
            onClick={() => {
              setCev({});
              setTur((x) => x + 1);
            }}
          >
            Testi tekrar çöz
          </button>
        </div>
      )}
    </div>
  );
}

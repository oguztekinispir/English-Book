"use client";
/**
 * Ana sayfanın kalbi: Türkçe cümle parçalarına ayrılır, sarı ekler İngilizcede sarı kelimelere dönüşür.
 * Cümleler gerçek motordan gelir.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { M_SUBJ, M_VERB, genItem, orderRows, trSeg, type Kalip, type Kutup, type Soru } from "@ti/motor";
import { SLOT_AD, TAM, turParca } from "@/lib/motor-yardim";
import { SesDugmesi } from "./Kucukler";

const ILK: Soru = (() => {
  const v = M_VERB.find((x) => x.en === "sleep")!,
    s = M_SUBJ.find((x) => x.en === "We")!;
  return {
    tr: "Biz iyi uyumadık.",
    en: "We didn't sleep well.",
    kind: "Geçmiş zaman · did / -ed · olumsuz",
    chips: [["Biz", "We"], ["iyi", "well"], ["uyu", "sleep"], ["-medi (geçmiş olumsuz)", "didn't", 1]],
    alts: [],
    meta: { form: "past", pol: "neg", s, third: false, v, comp: "well", compTr: "iyi", alt: [] },
  };
})();

const DIZI: [Kalip, Kutup][] = [
  ["be", "pos"],
  ["simple", "neg"],
  ["past", "pos"],
  ["will", "pos"],
  ["be", "q"],
  ["can", "neg"],
  ["bePast", "neg"],
  ["simple", "q"],
  ["past", "q"],
  ["simple", "pos"],
];

export function Hero() {
  const [soru, setSoru] = useState<Soru>(ILK);
  const [faz, setFaz] = useState(0);
  const [oynat, setOynat] = useState(true);
  const [azHareket, setAzHareket] = useState(false);
  const sira = useRef(0);
  const zaman = useRef<number[]>([]);

  useEffect(() => {
    setAzHareket(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const temizle = () => {
    zaman.current.forEach((t) => clearTimeout(t));
    zaman.current = [];
  };

  const yeni = useCallback(() => {
    const [form, pol] = DIZI[sira.current++ % DIZI.length];
    let x = genItem(TAM, { form, pol });
    for (let i = 0; i < 6 && x.en.length > 34; i++) x = genItem(TAM, { form, pol });
    setSoru(x);
  }, []);

  // Her yeni cümlede: bütün → parçalan → İngilizce dizilir → açıklama
  useEffect(() => {
    temizle();
    if (azHareket) {
      setFaz(3);
      return;
    }
    setFaz(0);
    zaman.current.push(window.setTimeout(() => setFaz(1), 650));
    zaman.current.push(window.setTimeout(() => setFaz(2), 1650));
    zaman.current.push(window.setTimeout(() => setFaz(3), 2700));
    return temizle;
  }, [soru, azHareket]);

  useEffect(() => {
    if (!oynat || azHareket || faz < 3) return;
    const t = window.setTimeout(yeni, 5200);
    return () => clearTimeout(t);
  }, [faz, oynat, azHareket, yeni]);

  const W = trSeg(soru.meta) || [];
  const { en } = orderRows(soru);
  const m = soru.meta;
  const ekli = (k: string) => k === "fiil" && m.pol === "pos" && (m.form === "past" || (m.form === "simple" && m.third));
  const ek = soru.chips.find((c) => c[2]);
  const [tur] = turParca(soru.kind);

  return (
    <div className={`gosteri faz-${faz}`}>
      <div className="gosteri-ust">
        <span className="tur-etiket">{tur}</span>
        <div className="gosteri-kontrol">
          <button type="button" className="dugme sade kucuk" onClick={() => setOynat((x) => !x)} aria-pressed={!oynat}>
            {oynat ? "Durdur" : "Kendiliğinden değişsin"}
          </button>
          <button
            type="button"
            className="dugme kucuk"
            onClick={() => {
              setOynat(false);
              yeni();
            }}
          >
            Başka cümle
          </button>
        </div>
      </div>

      <p className="gosteri-tr" lang="tr" aria-label={soru.tr}>
        {W.map((w, i) => (
          <span className="g-kelime" key={soru.tr + i}>
            {w.map(([t, l, k], j) => (
              <span className={`g-parca ${k}`} key={j} title={l}>
                <b>{t}</b>
                <i>{k === "root" && l.includes("→") ? l.split("→")[1].trim() : l.split(":")[0].split(" → ")[0]}</i>
              </span>
            ))}
          </span>
        ))}
      </p>

      <div className="gosteri-ok" aria-hidden="true">
        <svg viewBox="0 0 24 40" width="18" height="30">
          <path d="M12 2v32M4 26l8 10 8-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="gosteri-en" lang="en" aria-label={soru.en}>
        {en.map(([w, k], i) => (
          <span key={soru.en + i} className={`kutu ${k}${ekli(k) ? " ekli" : ""}`} style={{ transitionDelay: `${i * 110}ms` }}>
            <b>{w}</b>
            <i>{SLOT_AD[k]}</i>
          </span>
        ))}
        <span className="g-ses">
          <SesDugmesi metin={soru.en} />
        </span>
      </p>

      <p className="gosteri-aciklama">
        {ek && (
          <>
            Türkçedeki <span className="ek-isaret">{ek[0]}</span> eki, İngilizcede ayrı bir kelime olur:{" "}
            <span className="ek-isaret" lang="en">
              {ek[1].replace(/ başa$/, "")}
            </span>
            {/ başa$/.test(ek[1]) && " ve cümlenin başına geçer"}.
          </>
        )}
      </p>
    </div>
  );
}

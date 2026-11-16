"use client";
/**
 * Ana sayfanın kalbi: Türkçe cümle bütün olarak verilir, İngilizce kalıp kutu kutu yerine oturur.
 * Cümleler gerçek motordan gelir.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { M_SUBJ, M_VERB, genItem, orderRows, type Kalip, type Kutup, type Soru } from "@ti/motor";
import { SLOT_AD, TAM, turParca } from "@/lib/motor-yardim";
import { SesDugmesi } from "./Kucukler";

const ILK: Soru = (() => {
  const v = M_VERB.find((x) => x.en === "sleep")!,
    s = M_SUBJ.find((x) => x.en === "We")!;
  return {
    tr: "İyi uyumadık.",
    en: "We didn't sleep well.",
    kind: "Geçmiş zaman · did / -ed · olumsuz",
    chips: [["(biz)", "We"], ["iyi", "well"], ["uyu", "sleep"], ["-medi (geçmiş olumsuz)", "didn't", 1]],
    alts: [],
    meta: { form: "past", pol: "neg", s, third: false, gizli: true, v, comp: "well", compTr: "iyi", alt: [] },
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

  const { en } = orderRows(soru);
  const m = soru.meta;
  const ekli = (k: string) => k === "fiil" && m.pol === "pos" && (m.form === "past" || (m.form === "simple" && m.third));
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

      <p className="gosteri-tr gosteri-tr-duz" lang="tr">
        {soru.tr}
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
        Kalıp: <b>{tur}</b>. Türkçede {soru.tr.replace(/[.?]$/, "").split(" ").length === 1 ? "tek kelime" : "kısa bir cümle"}, İngilizcede kelimeler hep aynı sırayla dizilir.
      </p>
    </div>
  );
}

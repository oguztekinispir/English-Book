"use client";
import { useEffect, useState } from "react";
import type { Ders } from "@ti/icerik";
import { dersAcildi } from "@/lib/tekrar";
import { useIlerleme } from "./ortak";
import { bolumBitti, dersBolumleri } from "./bolumler";



const ISARETLI = ["kelimeler", "okuma", "alistirmalar", "cumle", "test"];

/** Yapışkan bölüm menüsü: hangi bölümdesin, hangileri bitti. Dersi "açılan dersler"e de ekler. */
export function DersGezgin({ d }: { d: Ders }) {
  const [p] = useIlerleme(d.kod);
  const bolumler = dersBolumleri(d);
  const [aktif, setAktif] = useState<string>(bolumler[0].id);

  useEffect(() => dersAcildi(d.kod), [d.kod]);

  useEffect(() => {
    const gozlem = new IntersectionObserver(
      (girdiler) => {
        const gorunen = girdiler.filter((g) => g.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (gorunen) setAktif(gorunen.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    bolumler.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) gozlem.observe(el);
    });
    return () => gozlem.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.kod]);

  const isaretli = bolumler.filter((b) => ISARETLI.includes(b.id));
  const biten = isaretli.filter((b) => bolumBitti(b.id, p, d)).length;

  return (
    <nav className="unite-gezgin" aria-label="Ders bölümleri">
      <ol>
        {bolumler.map((b, i) => {
          const ok = bolumBitti(b.id, p, d);
          return (
            <li key={b.id}>
              <a href={`#${b.id}`} aria-current={aktif === b.id ? "true" : undefined} className={ok ? "bitti" : ""}>
                <span className="ug-no">{ok ? "✓" : i + 1}</span>
                {b.ad}
              </a>
            </li>
          );
        })}
      </ol>
      <p className="ug-ozet">
        {biten} / {isaretli.length} hedef tamam
      </p>
    </nav>
  );
}

/** Ünite sayfasındaki ders kartında ilerleme */
export function DersIlerleme({ d }: { d: Ders }) {
  const [p, , hazir] = useIlerleme(d.kod);
  if (!hazir) return null;
  const isaretli = dersBolumleri(d).filter((b) => ISARETLI.includes(b.id));
  const biten = isaretli.filter((b) => bolumBitti(b.id, p, d)).length;
  if (!biten && p.test === undefined) return <span className="di-durum">Başlamadın</span>;
  return (
    <span className={`di-durum${biten === isaretli.length ? " tamam" : ""}`}>
      {biten === isaretli.length ? "Tamamlandı" : `${biten} / ${isaretli.length} hedef`}
      {p.test !== undefined && `, test ${p.test}/${d.test.length}`}
    </span>
  );
}

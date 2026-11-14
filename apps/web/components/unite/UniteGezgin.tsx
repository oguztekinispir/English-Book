"use client";
import { useEffect, useState } from "react";
import type { Unite } from "@ti/icerik";
import { useIlerleme, type UniteIlerleme } from "./ortak";

export const BOLUMLER = [
  { id: "kelimeler", ad: "Kelimeler" },
  { id: "kaliplar", ad: "Kalıplar" },
  { id: "gramer", ad: "Gramer" },
  { id: "diyaloglar", ad: "Diyaloglar" },
  { id: "okuma", ad: "Okuma" },
  { id: "alistirmalar", ad: "Alıştırmalar" },
  { id: "cumle", ad: "Cümle kur" },
  { id: "konusma", ad: "Konuşma" },
  { id: "test", ad: "Test" },
] as const;

function tamam(id: string, p: UniteIlerleme, u: Unite): boolean {
  switch (id) {
    case "kelimeler":
      return (p.kart ?? 0) >= 10;
    case "okuma":
      return (p.okuma ?? 0) >= u.okuma.sorular.length - 1;
    case "alistirmalar":
      return (p.bosluk ?? 0) >= u.alistirmalar.bosluk.length - 1 && (p.siralama ?? 0) >= u.alistirmalar.siralama.length - 1;
    case "cumle":
      return (p.motor ?? 0) >= 10;
    case "test":
      return (p.test ?? 0) >= 8;
    default:
      return false; // okuma bölümleri (kalıp, gramer, diyalog, konuşma): işaret yok
  }
}

/** Yapışkan bölüm menüsü: hangi bölümdesin, hangileri bitti */
export function UniteGezgin({ u }: { u: Unite }) {
  const [p] = useIlerleme(u.kod);
  const [aktif, setAktif] = useState<string>("kelimeler");

  useEffect(() => {
    const gozlem = new IntersectionObserver(
      (girdiler) => {
        const gorunen = girdiler.filter((g) => g.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (gorunen) setAktif(gorunen.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    BOLUMLER.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) gozlem.observe(el);
    });
    return () => gozlem.disconnect();
  }, []);

  const biten = BOLUMLER.filter((b) => tamam(b.id, p, u)).length;
  const isaretli = BOLUMLER.filter((b) => ["kelimeler", "okuma", "alistirmalar", "cumle", "test"].includes(b.id)).length;

  return (
    <nav className="unite-gezgin" aria-label="Ünite bölümleri">
      <ol>
        {BOLUMLER.map((b, i) => (
          <li key={b.id}>
            <a href={`#${b.id}`} aria-current={aktif === b.id ? "true" : undefined} className={tamam(b.id, p, u) ? "bitti" : ""}>
              <span className="ug-no">{tamam(b.id, p, u) ? "✓" : i + 1}</span>
              {b.ad}
            </a>
          </li>
        ))}
      </ol>
      <p className="ug-ozet">
        {biten} / {isaretli} hedef tamam
      </p>
    </nav>
  );
}

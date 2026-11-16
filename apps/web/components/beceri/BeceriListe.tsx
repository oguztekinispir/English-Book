"use client";
/** Okuma ve yazma dersleri listesi; bu tarayıcıdaki durumla */
import { useEffect, useState } from "react";
import Link from "next/link";
import { BECERI_DERSLERI, type BeceriDersi } from "@ti/icerik";
import { oku } from "@/lib/depo";
import { beceriAnahtari, type BeceriKaydi } from "./BeceriDersi";

export function BeceriListe({ tur }: { tur: BeceriDersi["tur"] }) {
  const [kayit, setKayit] = useState<Record<string, BeceriKaydi>>({});
  useEffect(() => setKayit(Object.fromEntries(BECERI_DERSLERI.map((d) => [d.kod, oku<BeceriKaydi>(beceriAnahtari(d.kod), {})]))), []);
  return (
    <ul className="bl">
      {BECERI_DERSLERI.filter((d) => d.tur === tur).map((d) => {
        const r = kayit[d.kod] ?? {};
        return (
          <li key={d.kod}>
            <Link href={`/beceriler/${d.kod}`} className={`bl-kart yaprak${r.bitti ? " tamam" : ""}`}>
              <span className="bl-ust">
                <span className="rozet">{d.seviye}</span>
                <span className="bl-tur">{d.metinTuru}</span>
              </span>
              <b>{d.baslik}</b>
              <span className="bl-aciklama">{d.aciklama}</span>
              <span className="bl-durum">{r.bitti ? (r.toplam ? `Bitti: ${r.puan} / ${r.toplam}` : "Bitti") : "Başlamadın"}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

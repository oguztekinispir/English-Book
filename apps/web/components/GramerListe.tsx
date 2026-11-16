"use client";
/** Gramer konuları listesi; her konunun yanında bu tarayıcıdaki son sonuç */
import { useEffect, useState } from "react";
import Link from "next/link";
import { GRAMER_KONULARI } from "@ti/icerik";
import { oku } from "@/lib/depo";
import { gramerAnahtari, type GramerKaydi } from "./GramerKonuCalis";

export function GramerListe() {
  const [kayit, setKayit] = useState<Record<string, GramerKaydi>>({});
  useEffect(() => setKayit(Object.fromEntries(GRAMER_KONULARI.map((k) => [k.kod, oku<GramerKaydi>(gramerAnahtari(k.kod), {})]))), []);
  return (
    <ul className="gk-liste">
      {GRAMER_KONULARI.map((k) => {
        const r = kayit[k.kod] ?? {};
        const durum = r.son === undefined ? (r.on === undefined ? "Başlamadın" : `İlk deneme ${r.on} / 5`) : r.son >= 4 ? `Tamam: ${r.son} / 5` : `Son deneme ${r.son} / 5`;
        return (
          <li key={k.kod}>
            <Link href={`/gramer/${k.kod}`} className={`gk-kart yaprak${r.son !== undefined && r.son >= 4 ? " tamam" : ""}`}>
              <span className="rozet">{k.seviye}</span>
              <span className="gk-kart-ic">
                <b>{k.baslik}</b>
                <span className="gk-merak-k">{k.merak}</span>
              </span>
              <span className="gk-durum">{durum}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

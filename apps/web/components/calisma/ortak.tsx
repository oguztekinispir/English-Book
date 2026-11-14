"use client";
import Link from "next/link";
import { UNITELER } from "@ti/icerik";
import { useKalici } from "@/lib/depo";
import { dersAcildi } from "@/lib/tekrar";

/** Açılan dersler (canlı: ders sayfası açılınca güncellenir) */
export function useAcilanlar() {
  const [a, , hazir] = useKalici<string[]>("acilan-dersler", []);
  return { acilan: a, hazir };
}

/** Kartı olan (dersi açılmış) üniteler */
export function acikUniteler(acilan: string[]) {
  return UNITELER.filter((u) => u.dersler.some((d) => acilan.includes(d.kod)));
}

export function UniteSecimi({ id, deger, degistir, acilan }: { id: string; deger: string; degistir: (v: string) => void; acilan: string[] }) {
  return (
    <label htmlFor={id} className="alan">
      Ünite
      <select id={id} value={deger} onChange={(e) => degistir(e.target.value)}>
        <option value="all">Tüm açtığın üniteler</option>
        {acikUniteler(acilan).map((u) => (
          <option key={u.kod} value={u.kod}>
            Ünite {u.sira}: {u.baslik}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Hiç ders açılmadıysa: nereden başlayacağını söyler */
export function HenuzDersYok({ ne }: { ne: string }) {
  const u = UNITELER[0];
  return (
    <div className="bos yaprak">
      <h3>Önce bir ders aç</h3>
      <p>
        {ne} açtığın derslerin kelimelerinden gelir. Bir dersin sayfasına girdiğinde o dersin kelimeleri buraya eklenir. Böylece hiç görmediğin bir kelime karşına çıkmaz.
      </p>
      <div className="dugmeler">
        <Link href={`/uniteler/${u.kod}/1`} className="dugme ana">
          Ders {u.sira}.1: {u.dersler[0].baslik}
        </Link>
        <button type="button" className="dugme" onClick={() => u.dersler.forEach((d) => dersAcildi(d.kod))}>
          Ünite {u.sira}&apos;in hepsini ekle
        </button>
      </div>
    </div>
  );
}

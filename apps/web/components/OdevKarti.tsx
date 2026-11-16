/** Öğretmen ekranında bir ödev ve öğrencilerinin ilerlemesi */
import Link from "next/link";
import type { OdevSatiri } from "@/lib/odev-veri";
import { gecikti, odevTarifi } from "@/lib/odev";
import { OdevSil } from "./OdevFormu";

const tarihYaz = (t: string) => new Date(t.length === 10 ? t + "T12:00:00Z" : t).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

export function OdevKarti({ o, tekOgrenci = false }: { o: OdevSatiri; tekOgrenci?: boolean }) {
  const biten = o.atamalar.filter((a) => a.ilerleme.bitti).length;
  const gec = gecikti(o.son_tarih);
  return (
    <li className="odev-karti yaprak">
      <div className="odev-ust">
        <div>
          <h3>{o.baslik}</h3>
          <p className="not">
            {odevTarifi(o.hedef)} Verildi: {tarihYaz(o.olusturma)}
            {o.son_tarih && (
              <>
                {" · "}
                <span className={gec && biten < o.atamalar.length ? "gecikti" : ""}>Son gün: {tarihYaz(o.son_tarih)}</span>
              </>
            )}
          </p>
          {o.aciklama && <p className="odev-not">Not: {o.aciklama}</p>}
        </div>
        <div className="odev-sag">
          {!tekOgrenci && (
            <span className={`odev-sayac${biten === o.atamalar.length ? " tamam" : ""}`}>
              {biten} / {o.atamalar.length} bitirdi
            </span>
          )}
          <OdevSil id={o.id} />
        </div>
      </div>
      <ul className="odev-ogrenciler">
        {o.atamalar.map((a) => {
          const { yapilan, gereken, bitti } = a.ilerleme;
          return (
            <li key={a.ogrenci_id} className={bitti ? "bitti" : gec ? "gecikti" : ""}>
              {!tekOgrenci && <Link href={`/ogretmen/ogrenci/${a.ogrenci_id}`}>{a.ad}</Link>}
              <span className="odev-cubuk" aria-hidden="true">
                <i style={{ width: `${(yapilan / gereken) * 100}%` }} />
              </span>
              <span className="odev-durum">{bitti ? "Bitti" : `${yapilan} / ${gereken}${gec ? ", gecikti" : ""}`}</span>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

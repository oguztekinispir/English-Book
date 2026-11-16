"use client";
/** Öğretmen: öğrencinin yazma derslerinde yazdıkları ve öğretmen notu */
import { useState } from "react";
import { beceriBul } from "@ti/icerik";
import { supabaseTarayici } from "@/lib/supabase/istemci";

export interface YaziSatiri {
  id: string;
  ders: string;
  metin: string;
  olusturma: string;
  ogretmen_notu: string | null;
}

export function OgrenciYazilari({ yazilar }: { yazilar: YaziSatiri[] }) {
  return (
    <ul className="yazi-liste">
      {yazilar.map((y) => (
        <Yazi key={y.id} y={y} />
      ))}
    </ul>
  );
}

function Yazi({ y }: { y: YaziSatiri }) {
  const [not, setNot] = useState(y.ogretmen_notu ?? "");
  const [durum, setDurum] = useState<"" | "kaydediliyor" | "kaydedildi" | "hata">("");
  const ders = beceriBul(y.ders);
  const kaydet = async () => {
    setDurum("kaydediliyor");
    const { error } = await supabaseTarayici().from("yazilar").update({ ogretmen_notu: not.trim() || null }).eq("id", y.id);
    setDurum(error ? "hata" : "kaydedildi");
  };
  return (
    <li className="yazi">
      <p className="not">
        {ders?.baslik ?? y.ders}, {new Date(y.olusturma).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
      </p>
      <p className="yazi-metin" lang="en">
        {y.metin}
      </p>
      <label className="yazi-not">
        <span>Öğrenciye not</span>
        <textarea rows={2} maxLength={1000} value={not} onChange={(e) => (setNot(e.target.value), setDurum(""))} placeholder="Ör. Çok iyi! Sadece “I late” değil, “I'm late”." />
      </label>
      <p className="yazi-alt">
        <button type="button" className="dugme kucuk" onClick={kaydet} disabled={durum === "kaydediliyor"}>
          Notu kaydet
        </button>
        {durum === "kaydedildi" && <span className="not">Kaydedildi.</span>}
        {durum === "hata" && <span className="form-hata">Kaydedilemedi.</span>}
      </p>
    </li>
  );
}

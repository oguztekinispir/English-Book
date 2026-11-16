import type { Metadata } from "next";
import { UNITELER } from "@ti/icerik";
import { DersIcerik } from "@/components/unite/DersIcerik";

export const metadata: Metadata = {
  title: "Ücretsiz deneme dersi",
  description: "Kayıt olmadan ilk dersi baştan sona çalış: kelimeler, hikâyeli diyaloglar, alıştırmalar.",
};

/** Girişsiz açık ilk ders (Ders 1.1). Middleware'de korunmaz. */
export default function Deneme() {
  const u = UNITELER[0];
  return <DersIcerik u={u} d={u.dersler[0]} deneme />;
}

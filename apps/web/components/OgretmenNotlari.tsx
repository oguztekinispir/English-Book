"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";

export function NotFormu({ ogrenciId }: { ogrenciId: string }) {
  const router = useRouter();
  const [metin, setMetin] = useState("");
  const [durum, setDurum] = useState<"" | "gonder" | string>("");
  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metin.trim()) return;
    setDurum("gonder");
    const { error } = await supabaseTarayici().from("ogretmen_notlari").insert({ ogrenci_id: ogrenciId, metin: metin.trim() });
    if (error) return setDurum(/ogretmen_notlari/.test(error.message) ? "Notlar için Supabase'de 0005 göçünü çalıştırın." : hataTr(error.message));
    setMetin("");
    setDurum("");
    router.refresh();
  };
  return (
    <form className="not-formu" onSubmit={kaydet}>
      <label htmlFor="not-metin" className="gizli-etiket">
        Yeni not
      </label>
      <textarea id="not-metin" rows={3} maxLength={2000} value={metin} onChange={(e) => setMetin(e.target.value)} placeholder="Ör. 14 Kasım: Ders 1.2 bitti. He/she ile is'i karıştırıyor." />
      {durum && durum !== "gonder" && <p className="form-hata">{durum}</p>}
      <button type="submit" className="dugme kucuk" disabled={!metin.trim() || durum === "gonder"}>
        Notu kaydet
      </button>
    </form>
  );
}

export function NotSil({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="dugme sade kucuk"
      onClick={async () => {
        await supabaseTarayici().from("ogretmen_notlari").delete().eq("id", id);
        router.refresh();
      }}
    >
      Sil
    </button>
  );
}

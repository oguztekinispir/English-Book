"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";

/** Öğrenci: öğretmen koduyla bağlan */
export function BaglanFormu({ otomatikKod }: { otomatikKod?: string }) {
  const router = useRouter();
  const [kod, setKod] = useState("");
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState("");
  const [bekle, setBekle] = useState(false);
  const calisti = useRef(false);

  const baglan = async (k: string, otomatik = false) => {
    setHata("");
    setBilgi("");
    if (!/^[A-Z0-9]{6}$/.test(k)) return setHata("Kod 6 karakter olmalı (harf ve rakam).");
    setBekle(true);
    const sb = supabaseTarayici();
    const { data, error } = await sb.rpc("koda_baglan", { kod: k });
    if (otomatik) await sb.auth.updateUser({ data: { ogretmen_kodu: "" } });
    setBekle(false);
    if (error) return setHata(otomatik ? `Kayıtta yazdığın kod (${k}) ile bağlanamadık: ${hataTr(error.message)}` : hataTr(error.message));
    setKod("");
    setBilgi(`${(data as { ad?: string })?.ad || "Öğretmenin"} artık çalışmalarını görebilir.`);
    router.refresh();
  };

  useEffect(() => {
    if (otomatikKod && !calisti.current) {
      calisti.current = true;
      baglan(otomatikKod, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otomatikKod]);

  return (
    <form
      className="baglan"
      onSubmit={(e) => {
        e.preventDefault();
        baglan(kod.trim().toUpperCase());
      }}
    >
      <label htmlFor="ogretmen-kodu">Öğretmen kodu</label>
      <div className="baglan-satir">
        <input
          id="ogretmen-kodu"
          className="kod-girdi"
          value={kod}
          onChange={(e) => setKod(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
          maxLength={6}
          placeholder="K7M2QX"
          autoCapitalize="characters"
          autoComplete="off"
        />
        <button className="dugme ana" disabled={bekle}>
          {bekle ? "Bağlanıyor…" : "Bağlan"}
        </button>
      </div>
      {hata && (
        <p className="form-hata" role="alert">
          {hata}
        </p>
      )}
      {bilgi && (
        <p className="form-bilgi" role="status">
          {bilgi}
        </p>
      )}
    </form>
  );
}

/** Öğretmen: davet kodu kartı (kopyala, link paylaş, yenile) */
export function KodKarti({ kod: ilk }: { kod: string }) {
  const router = useRouter();
  const [kod, setKod] = useState(ilk);
  const [mesaj, setMesaj] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(location.origin), []);
  const link = `${origin}/kayit?kod=${kod}`;

  const kopyala = async (t: string, m: string) => {
    try {
      await navigator.clipboard.writeText(t);
      setMesaj(m);
    } catch {
      setMesaj("Kopyalanamadı. Elle seçip kopyala.");
    }
  };
  const yenile = async () => {
    if (!confirm("Yeni kod alırsan eski kod çalışmaz. Bağlı öğrencilerin listende kalır. Devam edilsin mi?")) return;
    const { data, error } = await supabaseTarayici().rpc("davet_kodunu_yenile");
    if (error) return setMesaj(hataTr(error.message));
    setKod(data as string);
    setMesaj("Yeni kod hazır.");
    router.refresh();
  };

  return (
    <section className="kod-karti yaprak" aria-labelledby="kod-baslik">
      <h2 id="kod-baslik">Öğrencilerini bağla</h2>
      <p className="not">Öğrencin bu kodu kayıt olurken ya da panelinde girer. Ya da linki gönder, kod kendiliğinden dolar.</p>
      <p className="kod-buyuk" aria-label={`Davet kodun: ${kod.split("").join(" ")}`}>
        {kod.split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </p>
      <div className="dugmeler">
        <button type="button" className="dugme ana" onClick={() => kopyala(kod, "Kod kopyalandı.")}>
          Kodu kopyala
        </button>
        <button type="button" className="dugme" onClick={() => kopyala(link, "Davet linki kopyalandı. WhatsApp'tan gönderebilirsin.")}>
          Davet linkini kopyala
        </button>
        <button type="button" className="dugme sade" onClick={yenile}>
          Yeni kod al
        </button>
      </div>
      {mesaj && (
        <p className="form-bilgi" role="status">
          {mesaj}
        </p>
      )}
    </section>
  );
}

"use client";
/** Hesabım sayfasının formları (tarayıcıdan Supabase'e, RLS ile kendi satırına yazar). */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";
import { useKalici } from "@/lib/depo";
import { konus } from "@/lib/ses";

function Mesaj({ m }: { m: { tur: "hata" | "bilgi"; t: string } | null }) {
  if (!m) return null;
  return (
    <p className={m.tur === "hata" ? "form-hata" : "form-bilgi"} role={m.tur === "hata" ? "alert" : "status"}>
      {m.t}
    </p>
  );
}
type M = { tur: "hata" | "bilgi"; t: string } | null;

/* ---------- Profil ---------- */
export function ProfilFormu({ id, ad: ilkAd, ayarlar, rol, veliEposta, kucuk }: { id: string; ad: string; ayarlar: Record<string, unknown>; rol: string; veliEposta: string | null; kucuk: boolean }) {
  const router = useRouter();
  const [ad, setAd] = useState(ilkAd);
  const [okul, setOkul] = useState((ayarlar.okul as string) ?? "");
  const [veli, setVeli] = useState(veliEposta ?? "");
  const [m, setM] = useState<M>(null);
  const [bekle, setBekle] = useState(false);
  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setM(null);
    if (ad.trim().length < 2) return setM({ tur: "hata", t: "Adın en az 2 harf olmalı." });
    if (kucuk && !/^\S+@\S+\.\S+$/.test(veli.trim())) return setM({ tur: "hata", t: "Velinin e-posta adresi geçerli görünmüyor." });
    setBekle(true);
    const yeni: Record<string, unknown> = { ad: ad.trim(), ayarlar: { ...ayarlar, ...(rol !== "ogrenci" ? { okul: okul.trim() } : {}) } };
    if (kucuk) yeni.veli_eposta = veli.trim();
    const { error } = await supabaseTarayici().from("profiller").update(yeni).eq("id", id);
    setBekle(false);
    if (error) return setM({ tur: "hata", t: hataTr(error.message) });
    setM({ tur: "bilgi", t: "Kaydedildi." });
    router.refresh();
  };
  return (
    <form className="hesap-form" onSubmit={kaydet}>
      <label>
        <span>Adın soyadın</span>
        <input value={ad} onChange={(e) => setAd(e.target.value)} autoComplete="name" maxLength={80} />
        <small>{rol === "ogrenci" ? "Öğretmenin seni bu adla görür." : "Öğrencilerin seni bu adla görür."}</small>
      </label>
      {rol !== "ogrenci" && (
        <label>
          <span>
            Okul ya da kurum <em>(isteğe bağlı)</em>
          </span>
          <input value={okul} onChange={(e) => setOkul(e.target.value)} maxLength={120} placeholder="Ör. Kadıköy Anadolu Lisesi, özel ders" />
        </label>
      )}
      {kucuk && (
        <label>
          <span>Velinin e-postası</span>
          <input type="email" value={veli} onChange={(e) => setVeli(e.target.value)} autoComplete="off" />
          <small>18 yaşından küçük olduğun için onay bu adrese gider.</small>
        </label>
      )}
      <Mesaj m={m} />
      <button className="dugme ana" disabled={bekle}>
        {bekle ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}

/* ---------- E-posta ve şifre ---------- */
export function EpostaFormu({ eposta }: { eposta: string }) {
  const [yeni, setYeni] = useState("");
  const [m, setM] = useState<M>(null);
  const [bekle, setBekle] = useState(false);
  return (
    <form
      className="hesap-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setM(null);
        if (!/^\S+@\S+\.\S+$/.test(yeni.trim())) return setM({ tur: "hata", t: "E-posta adresi geçerli görünmüyor." });
        setBekle(true);
        const { error } = await supabaseTarayici().auth.updateUser({ email: yeni.trim() }, { emailRedirectTo: `${location.origin}/auth/callback?sonra=/hesap` });
        setBekle(false);
        if (error) return setM({ tur: "hata", t: hataTr(error.message) });
        setYeni("");
        setM({ tur: "bilgi", t: "Onay linki gönderdik. Değişiklik, linke tıklayınca geçerli olur (iki adrese de mail gidebilir)." });
      }}
    >
      <p className="hesap-satir">
        Şu anki adresin: <b>{eposta}</b>
      </p>
      <label>
        <span>Yeni e-posta</span>
        <input type="email" value={yeni} onChange={(e) => setYeni(e.target.value)} autoComplete="email" />
      </label>
      <Mesaj m={m} />
      <button className="dugme" disabled={bekle || !yeni}>
        {bekle ? "Gönderiliyor…" : "E-postamı değiştir"}
      </button>
    </form>
  );
}

export function SifreFormu() {
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [m, setM] = useState<M>(null);
  const [bekle, setBekle] = useState(false);
  return (
    <form
      className="hesap-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setM(null);
        if (s1.length < 8) return setM({ tur: "hata", t: "Şifre en az 8 karakter olmalı." });
        if (s1 !== s2) return setM({ tur: "hata", t: "İki şifre aynı değil." });
        setBekle(true);
        const { error } = await supabaseTarayici().auth.updateUser({ password: s1 });
        setBekle(false);
        if (error) return setM({ tur: "hata", t: hataTr(error.message) });
        setS1("");
        setS2("");
        setM({ tur: "bilgi", t: "Şifren değişti." });
      }}
    >
      <label>
        <span>Yeni şifre</span>
        <input type="password" value={s1} onChange={(e) => setS1(e.target.value)} autoComplete="new-password" minLength={8} />
      </label>
      <label>
        <span>Yeni şifre (tekrar)</span>
        <input type="password" value={s2} onChange={(e) => setS2(e.target.value)} autoComplete="new-password" />
      </label>
      <Mesaj m={m} />
      <button className="dugme" disabled={bekle || !s1}>
        {bekle ? "Değiştiriliyor…" : "Şifremi değiştir"}
      </button>
    </form>
  );
}

/* ---------- Tercihler (bu cihazda) ---------- */
export function Tercihler() {
  const [hiz, setHiz] = useKalici<number>("ses-hizi", 0.82);
  return (
    <div className="hesap-form">
      <fieldset className="secim-grubu">
        <legend>İngilizce okuma hızı</legend>
        {[
          [0.65, "Yavaş"],
          [0.82, "Normal"],
          [1, "Doğal hız"],
        ].map(([v, ad]) => (
          <label key={v} className={hiz === v ? "secili" : ""}>
            <input type="radio" name="hiz" checked={hiz === v} onChange={() => setHiz(v as number)} />
            {ad}
          </label>
        ))}
      </fieldset>
      <button type="button" className="dugme kucuk" onClick={() => konus("Hello! How are you today?", { hiz })}>
        Dinleyip dene
      </button>
      <small className="not">Bu ayar bu cihazda saklanır. Kelime kartları, diyaloglar ve oyunlar bu hızla okunur.</small>
    </div>
  );
}

/* ---------- Öğrenci: öğretmen bağlantısından ayrılma ---------- */
export function OgretmendenAyril({ ogretmenId, ad }: { ogretmenId: string; ad: string }) {
  const router = useRouter();
  const [emin, setEmin] = useState(false);
  if (!emin)
    return (
      <button type="button" className="dugme sade kucuk" onClick={() => setEmin(true)}>
        Bağlantıyı kaldır
      </button>
    );
  return (
    <span className="emin-misin">
      {ad} artık çalışmalarını göremeyecek.
      <button
        type="button"
        className="dugme kucuk tehlike"
        onClick={async () => {
          const sb = supabaseTarayici();
          const { data } = await sb.auth.getUser();
          await sb.from("baglantilar").update({ durum: "ayrildi" }).eq("ogretmen_id", ogretmenId).eq("ogrenci_id", data.user!.id);
          router.refresh();
        }}
      >
        Kaldır
      </button>
      <button type="button" className="dugme sade kucuk" onClick={() => setEmin(false)}>
        Vazgeç
      </button>
    </span>
  );
}

/* ---------- KVKK: verilerimi indir, hesabımı sil ---------- */
export function VerilerimiIndir({ rol }: { rol: string }) {
  const [bekle, setBekle] = useState(false);
  return (
    <button
      type="button"
      className="dugme"
      disabled={bekle}
      onClick={async () => {
        setBekle(true);
        const sb = supabaseTarayici();
        const { data: u } = await sb.auth.getUser();
        const id = u.user!.id;
        const [profil, cevaplar, kartlar, durum, baglantilar, notlar] = await Promise.all([
          sb.from("profiller").select("*").eq("id", id).maybeSingle(),
          sb.from("cevaplar").select("*").eq("ogrenci_id", id).order("zaman"),
          sb.from("tekrar_kartlari").select("*").eq("ogrenci_id", id),
          sb.from("ogrenci_durumu").select("*").eq("ogrenci_id", id).maybeSingle(),
          sb.from("baglantilar").select("*").or(`ogrenci_id.eq.${id},ogretmen_id.eq.${id}`),
          rol === "ogrenci" ? Promise.resolve({ data: null }) : sb.from("ogretmen_notlari").select("*"),
        ]);
        const yerel: Record<string, unknown> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i)!;
          if (k.startsWith("ti:")) yerel[k.slice(3)] = JSON.parse(localStorage.getItem(k) || "null");
        }
        const veri = {
          aciklama: "Türkçeden İngilizce: hesabındaki bütün veriler (KVKK m.11).",
          tarih: new Date().toISOString(),
          eposta: u.user!.email,
          profil: profil.data,
          cevaplar: cevaplar.data,
          tekrar_kartlari: kartlar.data,
          ogrenci_durumu: durum.data,
          baglantilar: baglantilar.data,
          ogretmen_notlari: notlar.data,
          bu_cihazdaki_kayitlar: yerel,
        };
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(veri, null, 2)], { type: "application/json" }));
        a.download = `verilerim-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        setBekle(false);
      }}
    >
      {bekle ? "Hazırlanıyor…" : "Verilerimi indir"}
    </button>
  );
}

export function HesabiSil({ rol }: { rol: string }) {
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const [yazi, setYazi] = useState("");
  const [m, setM] = useState<M>(null);
  const [bekle, setBekle] = useState(false);
  if (!acik)
    return (
      <button type="button" className="dugme tehlike-cerceve" onClick={() => setAcik(true)}>
        Hesabımı sil
      </button>
    );
  return (
    <form
      className="hesap-form sil-kutusu"
      onSubmit={async (e) => {
        e.preventDefault();
        setBekle(true);
        const sb = supabaseTarayici();
        const { error } = await sb.rpc("hesabimi_sil");
        if (error) {
          setBekle(false);
          return setM({ tur: "hata", t: /hesabimi_sil/.test(error.message) ? "Bu özellik için Supabase'de 0005 göçünü çalıştırın." : hataTr(error.message) });
        }
        await sb.auth.signOut();
        Object.keys(localStorage)
          .filter((k) => k.startsWith("ti:"))
          .forEach((k) => localStorage.removeItem(k));
        router.replace("/?silindi=1");
        router.refresh();
      }}
    >
      <p>
        <b>Bu geri alınamaz.</b>{" "}
        {rol === "ogrenci"
          ? "Bütün çalışmaların, tekrar kartların ve öğretmen bağlantıların silinir."
          : "Hesabın, öğrenci bağlantıların ve notların silinir. Öğrencilerinin kendi hesapları ve çalışmaları kalır."}
      </p>
      <label>
        <span>Onaylamak için SİL yaz</span>
        <input value={yazi} onChange={(e) => setYazi(e.target.value)} autoComplete="off" />
      </label>
      <Mesaj m={m} />
      <div className="dugmeler">
        <button className="dugme tehlike" disabled={bekle || yazi.trim().toLocaleUpperCase("tr") !== "SİL"}>
          {bekle ? "Siliniyor…" : "Hesabımı kalıcı olarak sil"}
        </button>
        <button type="button" className="dugme sade" onClick={() => setAcik(false)}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}

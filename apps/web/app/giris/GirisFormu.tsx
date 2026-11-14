"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";

export function GirisFormu({ sonra, ilkHata }: { sonra?: string; ilkHata?: string }) {
  const router = useRouter();
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState(ilkHata || "");
  const [bilgi, setBilgi] = useState("");
  const [bekle, setBekle] = useState(false);

  const gir = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    setBilgi("");
    setBekle(true);
    const { error } = await supabaseTarayici().auth.signInWithPassword({ email: eposta.trim(), password: sifre });
    setBekle(false);
    if (error) return setHata(hataTr(error.message));
    router.replace(sonra && sonra.startsWith("/") ? sonra : "/panel");
    router.refresh();
  };

  const sifremiUnuttum = async () => {
    setHata("");
    if (!eposta.trim()) return setHata("Önce e-posta adresini yaz, sonra bu bağlantıya bas.");
    setBekle(true);
    const { error } = await supabaseTarayici().auth.resetPasswordForEmail(eposta.trim(), {
      redirectTo: `${location.origin}/auth/callback?sonra=/sifre`,
    });
    setBekle(false);
    if (error) return setHata(hataTr(error.message));
    setBilgi("Şifre yenileme linkini e-postana gönderdik. Linke tıklayınca yeni şifreni belirleyeceksin.");
  };

  return (
    <form className="hesap-form" onSubmit={gir} noValidate>
      <label>
        <span>E-posta</span>
        <input type="email" autoComplete="email" required value={eposta} onChange={(e) => setEposta(e.target.value)} />
      </label>
      <label>
        <span>Şifre</span>
        <input type="password" autoComplete="current-password" required value={sifre} onChange={(e) => setSifre(e.target.value)} />
      </label>
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
      <button type="submit" className="dugme ana buyuk" disabled={bekle}>
        {bekle ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
      <div className="form-alt">
        <button type="button" className="dugme sade" onClick={sifremiUnuttum} disabled={bekle}>
          Şifremi unuttum
        </button>
        <span>
          Hesabın yok mu? <Link href="/kayit">Kayıt ol</Link>
        </span>
      </div>
    </form>
  );
}

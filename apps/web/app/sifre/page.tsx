"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";
import "../hesap.css";

/** Şifre yenileme linkinden sonra yeni şifre belirleme */
export default function Sifre() {
  const router = useRouter();
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [bekle, setBekle] = useState(false);
  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sifre.length < 8) return setHata("Şifre en az 8 karakter olmalı.");
    setBekle(true);
    const { error } = await supabaseTarayici().auth.updateUser({ password: sifre });
    setBekle(false);
    if (error) return setHata(hataTr(error.message));
    router.replace("/panel");
  };
  return (
    <div className="sayfa">
      <main className="hesap">
        <div className="hesap-kart yaprak">
          <h1>Yeni şifre</h1>
          <form className="hesap-form" onSubmit={kaydet}>
            <label>
              <span>Yeni şifren</span>
              <input type="password" autoComplete="new-password" value={sifre} onChange={(e) => setSifre(e.target.value)} />
              <small>En az 8 karakter</small>
            </label>
            {hata && (
              <p className="form-hata" role="alert">
                {hata}
              </p>
            )}
            <button className="dugme ana buyuk" disabled={bekle}>
              Şifreyi kaydet
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

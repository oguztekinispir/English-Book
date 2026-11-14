"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";

type Rol = "ogrenci" | "ogretmen";
const BU_YIL = new Date().getFullYear();

export function KayitFormu({ ilkKod }: { ilkKod?: string }) {
  const router = useRouter();
  const [rol, setRol] = useState<Rol>("ogrenci");
  const [ad, setAd] = useState("");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [yil, setYil] = useState("");
  const [veli, setVeli] = useState("");
  const [kod, setKod] = useState(ilkKod || "");
  const [kvkk, setKvkk] = useState(false);
  const [hata, setHata] = useState("");
  const [bitti, setBitti] = useState(false);
  const [bekle, setBekle] = useState(false);

  const yas = useMemo(() => {
    const y = parseInt(yil, 10);
    return y >= 1900 && y <= BU_YIL ? BU_YIL - y : null;
  }, [yil]);
  const kucuk = rol === "ogrenci" && yas !== null && yas < 18;

  const kaydol = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    if (ad.trim().length < 2) return setHata("Adını yaz.");
    if (!/^\S+@\S+\.\S+$/.test(eposta.trim())) return setHata("E-posta adresi geçerli görünmüyor.");
    if (sifre.length < 8) return setHata("Şifre en az 8 karakter olmalı.");
    if (yas === null) return setHata("Doğum yılını yaz (örneğin 1990).");
    if (yas < 7) return setHata("Doğum yılını kontrol et.");
    if (kucuk && !/^\S+@\S+\.\S+$/.test(veli.trim())) return setHata("18 yaşından küçüksen anne, baba ya da velinin e-posta adresi gerekli.");
    if (!kvkk) return setHata("Devam etmek için aydınlatma metnini okuyup onaylaman gerekiyor.");

    setBekle(true);
    const { data, error } = await supabaseTarayici().auth.signUp({
      email: eposta.trim(),
      password: sifre,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?sonra=/panel`,
        data: {
          ad: ad.trim(),
          rol,
          dogum_yili: yil,
          kvkk: "true",
          veli_eposta: kucuk ? veli.trim() : "",
          ogretmen_kodu: rol === "ogrenci" ? kod.trim().toUpperCase() : "",
        },
      },
    });
    setBekle(false);
    if (error) return setHata(hataTr(error.message));
    if (data.session) {
      router.replace("/panel");
      router.refresh();
    } else setBitti(true);
  };

  if (bitti)
    return (
      <div className="form-bilgi buyuk" role="status">
        <b>Neredeyse tamam.</b> <span>{eposta}</span> adresine bir doğrulama linki gönderdik. Linke tıklayınca hesabın açılır. Birkaç dakika içinde gelmezse spam
        klasörüne bak.
      </div>
    );

  return (
    <form className="hesap-form" onSubmit={kaydol} noValidate>
      <fieldset className="rol-sec">
        <legend>Hesap türü</legend>
        <label className={rol === "ogrenci" ? "secili" : ""}>
          <input type="radio" name="rol" checked={rol === "ogrenci"} onChange={() => setRol("ogrenci")} />
          <b>Öğrenciyim</b>
          <small>İngilizce öğreniyorum</small>
        </label>
        <label className={rol === "ogretmen" ? "secili" : ""}>
          <input type="radio" name="rol" checked={rol === "ogretmen"} onChange={() => setRol("ogretmen")} />
          <b>Öğretmenim</b>
          <small>Öğrencilerimi takip edeceğim</small>
        </label>
      </fieldset>

      <label>
        <span>Adın</span>
        <input autoComplete="name" value={ad} onChange={(e) => setAd(e.target.value)} maxLength={80} />
      </label>
      <label>
        <span>E-posta</span>
        <input type="email" autoComplete="email" value={eposta} onChange={(e) => setEposta(e.target.value)} />
      </label>
      <label>
        <span>Şifre</span>
        <input type="password" autoComplete="new-password" value={sifre} onChange={(e) => setSifre(e.target.value)} />
        <small>En az 8 karakter</small>
      </label>
      <label>
        <span>Doğum yılın</span>
        <input inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="1990" value={yil} onChange={(e) => setYil(e.target.value.replace(/\D/g, ""))} />
      </label>

      {kucuk && (
        <label className="veli">
          <span>Velinin e-posta adresi</span>
          <input type="email" value={veli} onChange={(e) => setVeli(e.target.value)} />
          <small>18 yaşından küçük olduğun için velinin onayı gerekiyor. Ona bilgi vereceğiz.</small>
        </label>
      )}

      {rol === "ogrenci" && (
        <label>
          <span>
            Öğretmen kodu <em>(varsa)</em>
          </span>
          <input value={kod} onChange={(e) => setKod(e.target.value.toUpperCase())} maxLength={6} placeholder="K7M2QX" className="kod-girdi" autoCapitalize="characters" />
          <small>Öğretmenin bir kod verdiyse yaz. Sonra da ekleyebilirsin.</small>
        </label>
      )}

      <label className="onay">
        <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} />
        <span>
          <Link href="/kvkk" target="_blank">
            Aydınlatma metnini
          </Link>{" "}
          okudum. Kişisel verilerimin bu metinde anlatıldığı şekilde işlenmesine onay veriyorum.
        </span>
      </label>

      {hata && (
        <p className="form-hata" role="alert">
          {hata}
        </p>
      )}
      <button type="submit" className="dugme ana buyuk" disabled={bekle}>
        {bekle ? "Hesap açılıyor…" : "Hesap aç"}
      </button>
      <div className="form-alt">
        <span>
          Hesabın var mı? <Link href="/giris">Giriş yap</Link>
        </span>
      </div>
    </form>
  );
}

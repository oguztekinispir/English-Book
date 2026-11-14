"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";

type Rol = "ogrenci" | "ogretmen";
const BU_YIL = new Date().getFullYear();
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const YILLAR = Array.from({ length: 95 }, (_, i) => BU_YIL - 4 - i);

/** Gün/ay/yıl → gerçek bir tarihse "YYYY-AA-GG" ve tam yaş */
function tarihVeYas(g: string, a: string, y: string): { iso: string; yas: number } | null {
  const G = +g, A = +a, Y = +y;
  if (!G || !A || !Y) return null;
  const d = new Date(Y, A - 1, G);
  if (d.getFullYear() !== Y || d.getMonth() !== A - 1 || d.getDate() !== G) return null; // 30 Şubat vb.
  const b = new Date();
  let yas = b.getFullYear() - Y;
  if (b.getMonth() < A - 1 || (b.getMonth() === A - 1 && b.getDate() < G)) yas--;
  return { iso: `${Y}-${String(A).padStart(2, "0")}-${String(G).padStart(2, "0")}`, yas };
}

export function KayitFormu({ ilkKod }: { ilkKod?: string }) {
  const router = useRouter();
  const [rol, setRol] = useState<Rol>("ogrenci");
  const [ad, setAd] = useState("");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [gun, setGun] = useState("");
  const [ay, setAy] = useState("");
  const [yil, setYil] = useState("");
  const [veli, setVeli] = useState("");
  const [kod, setKod] = useState(ilkKod || "");
  const [kvkk, setKvkk] = useState(false);
  const [hata, setHata] = useState("");
  const [bitti, setBitti] = useState(false);
  const [bekle, setBekle] = useState(false);

  const dogum = useMemo(() => tarihVeYas(gun, ay, yil), [gun, ay, yil]);
  const yas = dogum?.yas ?? null;
  const kucuk = rol === "ogrenci" && yas !== null && yas < 18;

  const kaydol = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    if (ad.trim().length < 2) return setHata("Adını yaz.");
    if (!/^\S+@\S+\.\S+$/.test(eposta.trim())) return setHata("E-posta adresi geçerli görünmüyor.");
    if (sifre.length < 8) return setHata("Şifre en az 8 karakter olmalı.");
    if (!gun || !ay || !yil) return setHata("Doğum tarihini gün, ay ve yıl olarak seç.");
    if (yas === null) return setHata("Bu tarih takvimde yok. Günü kontrol et (örneğin 30 Şubat olmaz).");
    if (yas < 5) return setHata("Doğum tarihini kontrol et.");
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
          dogum_tarihi: dogum!.iso,
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
      <fieldset className="dogum">
        <legend>Doğum tarihin</legend>
        <div className="dogum-satir">
          <select aria-label="Gün" value={gun} onChange={(e) => setGun(e.target.value)}>
            <option value="">Gün</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select aria-label="Ay" value={ay} onChange={(e) => setAy(e.target.value)}>
            <option value="">Ay</option>
            {AYLAR.map((x, i) => (
              <option key={x} value={i + 1}>
                {x}
              </option>
            ))}
          </select>
          <select aria-label="Yıl" value={yil} onChange={(e) => setYil(e.target.value)}>
            <option value="">Yıl</option>
            {YILLAR.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

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

import Link from "next/link";
import { oturum } from "@/lib/supabase/sunucu";

type Aktif = "ana" | "uniteler" | "tekrar" | "oyun" | "gramer" | "pratik" | "panel" | "hesap" | "giris" | "kayit" | "deneme" | "seviye" | "beceriler";

export async function Ust({ aktif }: { aktif: Aktif }) {
  const { user, profil } = await oturum().catch(() => ({ user: null, profil: null }));
  const panelAd = profil?.rol === "ogretmen" || profil?.rol === "yonetici" ? "Öğrencilerim" : "Panelim";
  return (
    <header className="ust">
      <Link href="/" className="marka" aria-label="Türkçeden İngilizce, ana sayfa">
        Türkçe<span className="tire">-</span>
        <span className="marka-ek">den</span>
        <span style={{ marginLeft: 6 }}>İngilizce</span>
      </Link>
      <nav aria-label="Ana menü">
        {!user && (
          <>
            <Link href="/deneme" aria-current={aktif === "deneme" ? "page" : undefined} className="ust-ikincil">
              Ücretsiz dene
            </Link>
            <Link href="/seviye-testi" aria-current={aktif === "seviye" ? "page" : undefined} className="ust-ikincil">
              Seviye testi
            </Link>
          </>
        )}
        {user && (
          <>
        <Link href="/uniteler" aria-current={aktif === "uniteler" ? "page" : undefined}>
          Üniteler
        </Link>
        <Link href="/tekrar" aria-current={aktif === "tekrar" ? "page" : undefined}>
          Tekrar
        </Link>
        <Link href="/oyun" aria-current={aktif === "oyun" ? "page" : undefined}>
          Oyun
        </Link>
        <Link href="/gramer" aria-current={aktif === "gramer" ? "page" : undefined}>
          Gramer
        </Link>
        <Link href="/beceriler" aria-current={aktif === "beceriler" ? "page" : undefined}>
          Okuma ve yazma
        </Link>
        <Link href="/pratik" aria-current={aktif === "pratik" ? "page" : undefined} className="ust-ikincil">
          Pratik
        </Link>
          </>
        )}
        {user ? (
          <>
            <Link href="/panel" aria-current={aktif === "panel" ? "page" : undefined}>
              {panelAd}
            </Link>
            <Link href="/hesap" aria-current={aktif === "hesap" ? "page" : undefined} className="ust-hesap" title={profil?.ad ? `${profil.ad} olarak giriş yaptın` : undefined}>
              Hesabım
            </Link>
          </>
        ) : (
          <>
            <Link href="/giris" aria-current={aktif === "giris" ? "page" : undefined}>
              Giriş yap
            </Link>
            <Link href="/kayit" aria-current={aktif === "kayit" ? "page" : undefined} className="ust-kayit">
              Ücretsiz kayıt ol
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

import Link from "next/link";
import { oturum } from "@/lib/supabase/sunucu";

type Aktif = "ana" | "uniteler" | "tekrar" | "oyun" | "gramer" | "pratik" | "panel" | "giris" | "kayit";

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
          <Link href="/" aria-current={aktif === "ana" ? "page" : undefined} className="ust-ikincil">
            Nasıl çalışır
          </Link>
        )}
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
        <Link href="/pratik" aria-current={aktif === "pratik" ? "page" : undefined}>
          Pratik
        </Link>
        {user ? (
          <>
            <Link href="/panel" aria-current={aktif === "panel" ? "page" : undefined}>
              {panelAd}
            </Link>
            <form action="/cikis" method="post" className="ust-cikis">
              <button type="submit" title={profil?.ad ? `${profil.ad} olarak giriş yaptın` : undefined}>
                Çıkış
              </button>
            </form>
          </>
        ) : (
          <Link href="/giris" aria-current={aktif === "giris" || aktif === "kayit" ? "page" : undefined}>
            Giriş yap
          </Link>
        )}
      </nav>
    </header>
  );
}

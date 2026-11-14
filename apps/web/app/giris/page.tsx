import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import { GirisFormu } from "./GirisFormu";
import "../hesap.css";

export const metadata: Metadata = { title: "Giriş yap" };

export default async function Giris({ searchParams }: { searchParams: Promise<{ sonra?: string; hata?: string }> }) {
  const q = await searchParams;
  return (
    <div className="sayfa">
      <Ust aktif="giris" />
      <main className="hesap">
        <div className="hesap-kart yaprak">
          <h1>Giriş yap</h1>
          <p className="hesap-giris">Kaldığın yerden devam et. İlerlemen telefonda ve bilgisayarda aynı.</p>
          <GirisFormu sonra={q.sonra} ilkHata={q.hata === "dogrulama" ? "Doğrulama linkinin süresi dolmuş ya da daha önce kullanılmış. Giriş yapmayı dene." : undefined} />
        </div>
      </main>
    </div>
  );
}

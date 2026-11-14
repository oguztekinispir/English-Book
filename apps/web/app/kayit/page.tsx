import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import { KayitFormu } from "./KayitFormu";
import "../hesap.css";

export const metadata: Metadata = { title: "Kayıt ol" };

export default async function Kayit({ searchParams }: { searchParams: Promise<{ kod?: string }> }) {
  const q = await searchParams;
  return (
    <div className="sayfa">
      <Ust aktif="kayit" />
      <main className="hesap">
        <div className="hesap-kart yaprak">
          <h1>Hesap aç</h1>
          <p className="hesap-giris">Ücretsiz. İlerlemen kaydedilir, öğretmenin varsa çalışmalarını görebilir.</p>
          <KayitFormu ilkKod={q.kod?.slice(0, 6).toUpperCase()} />
        </div>
      </main>
    </div>
  );
}

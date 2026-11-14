import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import { Oyunlar } from "@/components/calisma/Oyun";
import "../uniteler/unite.css";
import "../calisma.css";

export const metadata: Metadata = { title: "Oyun" };

export default function OyunSayfasi() {
  return (
    <div className="sayfa">
      <Ust aktif="oyun" />
      <main className="calisma">
        <header className="calisma-kapak">
          <h1>Oyun</h1>
          <p className="giris">Kısa, hızlı turlar. Beş dakikan varsa bir tur at: kelimeler oynarken de yerine oturur.</p>
        </header>
        <div className="calisma-tek">
          <Oyunlar />
        </div>
      </main>
    </div>
  );
}

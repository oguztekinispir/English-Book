import type { Metadata } from "next";
import { BECERI_YAKINDA } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { BeceriListe } from "@/components/beceri/BeceriListe";
import "../uniteler/unite.css";
import "../calisma.css";
import "../gramer/gramer.css";
import "./beceriler.css";

export const metadata: Metadata = { title: "Okuma ve yazma" };

const TUR_AD = { okuma: "Okuma", yazma: "Yazma", dinleme: "Dinleme", konusma: "Konuşma" } as const;

export default function Beceriler() {
  return (
    <div className="sayfa">
      <Ust aktif="beceriler" />
      <main className="calisma">
        <header className="calisma-kapak">
          <h1>Okuma ve yazma</h1>
          <p className="giris">
            Gerçek hayattan kısa metinler: duyuru, mesaj, kartvizit, form. Her derste önce kelimelere hazırlanır, metni okur, görevleri çözersin. Yazma derslerinde
            sonunda kendi metnini yazarsın; bağlı bir öğretmenin varsa okur ve not bırakır.
          </p>
        </header>
        <div className="calisma-tek">
          <section aria-labelledby="okuma-b">
            <h2 id="okuma-b" className="gk-bolum">
              Okuma
            </h2>
            <BeceriListe tur="okuma" />
          </section>
          <section aria-labelledby="yazma-b">
            <h2 id="yazma-b" className="gk-bolum">
              Yazma
            </h2>
            <BeceriListe tur="yazma" />
          </section>
          <section className="calisma-blok yaprak" aria-labelledby="yakinda-b">
            <h2 id="yakinda-b">Hazırlanıyor</h2>
            <ul className="gk-yakinda">
              {BECERI_YAKINDA.map((y) => (
                <li key={y.baslik}>
                  <span className="rozet sade">{y.seviye}</span> {TUR_AD[y.tur]}: {y.baslik}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

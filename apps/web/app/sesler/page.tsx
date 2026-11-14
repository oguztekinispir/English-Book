import type { Metadata } from "next";
import Link from "next/link";
import { SES_REHBERI, ipaBul } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { SesDugmesi } from "@/components/Kucukler";
import "../uniteler/unite.css";
import "../calisma.css";

export const metadata: Metadata = { title: "Sesler ve okunuş" };

export default function Sesler() {
  return (
    <div className="sayfa">
      <Ust aktif="gramer" />
      <main className="calisma">
        <header className="calisma-kapak">
          <p>
            <Link href="/gramer" className="geri">
              Gramer
            </Link>
          </p>
          <h1>Sesler ve okunuş</h1>
          <p className="giris">
            Kelimelerin yanındaki <span className="okunus-ipa">/ˈmʌðə/</span> gibi yazılar IPA'dır: bütün sözlüklerin kullandığı okunuş yazısı. Her işaret tek bir sestir. Bu sayfadaki işaretleri
            bir kez öğrenince her sözlükte her kelimeyi okuyabilirsin.
          </p>
          <p className="not">
            Türkçe harflerle yazılan okunuş (ör. “madhı”) sadece yaklaşık bir ipucudur, çünkü bazı İngilizce sesler Türkçede yok. Asıl ölçü sestir: dinle, sesli tekrar et.
          </p>
        </header>
        <div className="calisma-tek">
          {SES_REHBERI.map((b) => (
            <section key={b.baslik} className="calisma-blok yaprak">
              <h2>{b.baslik}</h2>
              <p className="not">{b.aciklama}</p>
              {b.sesler.length > 0 && (
                <ul className="ses-liste">
                  {b.sesler.map((s) => (
                    <li key={s.ipa} className={s.zor ? "zor" : ""}>
                      <span className="ses-ipa">{s.ipa}</span>
                      <span className="ses-tr">≈ {s.tr}</span>
                      <span className="ses-ornek">
                        <SesDugmesi metin={s.ornek} />
                        <b lang="en">{s.ornek}</b> <span className="okunus-ipa">/{ipaBul(s.ornek)}/</span>
                      </span>
                      {s.not && <span className="ses-not">{s.not}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="not">Okunuş verisi: Britfone (İngiliz İngilizcesi, MIT lisansı) ve elle düzeltmeler.</p>
        </div>
      </main>
    </div>
  );
}

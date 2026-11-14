import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import { Tekrar } from "@/components/calisma/Tekrar";
import "../uniteler/unite.css";
import "../calisma.css";

export const metadata: Metadata = { title: "Günlük tekrar" };

export default function TekrarSayfasi() {
  return (
    <div className="sayfa">
      <Ust aktif="tekrar" />
      <main className="calisma">
        <header className="calisma-kapak">
          <h1>Günlük tekrar</h1>
          <p className="giris">Okuyup geçmek yerine burada çalış. Günde iki kez 10 dakika yeter: sabah kartlar, akşam ya da yolda dinleme.</p>
        </header>
        <div className="calisma-duzen">
          <div className="calisma-ana">
            <Tekrar />
          </div>
          <aside className="neden yaprak" aria-labelledby="neden-baslik">
            <h2 id="neden-baslik">Neden unutuyorsun?</h2>
            <p>Okurken her şey tanıdık gelir, &quot;tamam, biliyorum&quot; dersin. Ama beyin sadece hatırlamaya çalıştığı şeyi saklar. Unutman yöntemden, senden değil.</p>
            <ul>
              <li>
                <b>Okuma, kendini yokla.</b> Türkçesini gör, İngilizcesini sesli söyle, sonra kontrol et. Zorlanmak öğrendiğini gösterir.
              </li>
              <li>
                <b>Az ama sık.</b> Günde 2 kez 10 dakika, bir kerede 1 saatten daha kalıcı.
              </li>
              <li>
                <b>Unutmak normal.</b> Bilemediğin kart bugün yine gelir, bildiğin birkaç gün sonra. Her hatırlayışta biraz daha kalıcı olur.
              </li>
              <li>
                <b>Çağrışım kur.</b> Kelimeyi komik bir Türkçe şeye bağla. Ne kadar komikse o kadar akılda kalır.
              </li>
              <li>
                <b>Kendi hayatından cümle kur.</b> Seninle ilgili cümleler daha kalıcı olur.
              </li>
              <li>
                <b>Yatmadan 5 dakika.</b> Uyku, gün içinde öğrendiğini kalıcı hafızaya taşır.
              </li>
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}

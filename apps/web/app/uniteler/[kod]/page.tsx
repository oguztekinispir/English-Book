import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { A1_PLAN, uniteBul, uniteKelimeleri } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { Kelimeler } from "@/components/unite/Kelimeler";
import { Gramer, Kaliplar } from "@/components/unite/Gramer";
import { DiyalogOkuyucu, OkumaOkuyucu } from "@/components/unite/Metin";
import { BoslukDoldur, Eslestir, SiraylaKur } from "@/components/unite/Alistirmalar";
import { Konusma, UniteMotoru, UniteTesti } from "@/components/unite/Digerleri";
import { UniteGezgin } from "@/components/unite/UniteGezgin";
import "../../pratik/pratik.css";
import "../unite.css";

export async function generateMetadata({ params }: { params: Promise<{ kod: string }> }): Promise<Metadata> {
  const u = uniteBul((await params).kod);
  return { title: u ? `Ünite ${u.sira}: ${u.baslik}` : "Ünite" };
}

export default async function UniteSayfasi({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const u = uniteBul(kod);
  if (!u) notFound();
  const sonraki = A1_PLAN.find((x) => x.sira === u.sira + 1);

  return (
    <div className="sayfa">
      <Ust aktif="uniteler" />
      <main className="unite">
        <header className="unite-kapak">
          <p className="unite-ust">
            <Link href="/uniteler" className="geri">
              Üniteler
            </Link>
            <span className="tur-etiket">
              {u.seviye}, ünite {u.sira}
            </span>
          </p>
          <h1>
            {u.baslik} <span lang="en">{u.baslikEn}</span>
          </h1>
          <div className="hedefler">
            <p>Bu ünitenin sonunda:</p>
            <ul>
              {u.hedefler.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <p className="not">
            {uniteKelimeleri(u).length} kelime, {u.kaliplar.length} kalıp, {u.diyaloglar.length} diyalog, 1 okuma, {u.alistirmalar.bosluk.length + u.alistirmalar.siralama.length}{" "}
            alıştırma, 10 soruluk test.
          </p>
        </header>

        <div className="unite-duzen">
          <UniteGezgin u={u} />
          <div className="unite-icerik">
            <section id="kelimeler" className="ub">
              <h2>
                <span className="ub-no">1</span>Kelimeler
              </h2>
              <Kelimeler u={u} />
            </section>

            <section id="kaliplar" className="ub">
              <h2>
                <span className="ub-no">2</span>Hazır kalıplar
              </h2>
              <p className="not ub-giris">Bunları tek parça ezberle. Gramerini sonra öğreneceksin, şimdilik kullan.</p>
              <Kaliplar kaliplar={u.kaliplar} />
            </section>

            <section id="gramer" className="ub">
              <h2>
                <span className="ub-no">3</span>Gramer: {u.gramerEtiketi}
              </h2>
              <Gramer bolumler={u.gramer} />
            </section>

            <section id="diyaloglar" className="ub">
              <h2>
                <span className="ub-no">4</span>Diyaloglar
              </h2>
              <p className="not ub-giris">Önce dinle, sonra oku. Anlamadığın satırda Çöz'e bas: her kelimenin altında Türkçesi çıkar.</p>
              <div className="ub-yigin">
                {u.diyaloglar.map((d) => (
                  <DiyalogOkuyucu key={d.baslik} u={u} d={d} />
                ))}
              </div>
            </section>

            <section id="okuma" className="ub">
              <h2>
                <span className="ub-no">5</span>Okuma
              </h2>
              <div className="ub-yigin">
                <OkumaOkuyucu u={u} o={u.okuma} />
              </div>
            </section>

            <section id="alistirmalar" className="ub">
              <h2>
                <span className="ub-no">6</span>Alıştırmalar
              </h2>
              <div className="ub-yigin">
                <BoslukDoldur u={u} />
                <SiraylaKur u={u} />
                <Eslestir u={u} />
              </div>
            </section>

            <section id="cumle" className="ub">
              <h2>
                <span className="ub-no">7</span>Cümle kur
              </h2>
              <UniteMotoru u={u} />
            </section>

            <section id="konusma" className="ub">
              <h2>
                <span className="ub-no">8</span>Konuşma
              </h2>
              <Konusma u={u} />
            </section>

            <section id="test" className="ub">
              <h2>
                <span className="ub-no">9</span>Ünite testi
              </h2>
              <UniteTesti u={u} />
            </section>

            {sonraki && (
              <p className="sonraki-unite">
                Sıradaki: <b>Ünite {sonraki.sira}, {sonraki.baslik}</b>. {sonraki.hedef} (hazırlanıyor)
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

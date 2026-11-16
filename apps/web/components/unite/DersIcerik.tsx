/**
 * Bir dersin bütün bölümleri. Hem /uniteler/[kod]/[ders] hem de girişsiz /deneme sayfası kullanır.
 * deneme: üstte "kayıt gerekmez" notu, sonda dersler arası geçiş yerine kayıt çağrısı.
 */
import Link from "next/link";
import { dersKelimeleri, type Ders, type Unite } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { Kelimeler } from "@/components/unite/Kelimeler";
import { Gramer, Kaliplar } from "@/components/unite/Gramer";
import { OkumaOkuyucu } from "@/components/unite/Metin";
import { DiyalogCalis, MiniDiyaloglar } from "@/components/unite/Diyalog";
import { BoslukDoldur, Eslestir, SiraylaKur } from "@/components/unite/Alistirmalar";
import { Konusma, UniteMotoru, UniteTesti } from "@/components/unite/Digerleri";
import { DersGezgin } from "@/components/unite/UniteGezgin";
import { dersBolumleri } from "@/components/unite/bolumler";
import "@/app/pratik/pratik.css";
import "@/app/uniteler/unite.css";

export function DersIcerik({ u, d, deneme = false }: { u: Unite; d: Ders; deneme?: boolean }) {
  const bolumler = dersBolumleri(d);
  const no = (id: string) => bolumler.findIndex((x) => x.id === id) + 1;
  const ad = (id: string) => bolumler.find((x) => x.id === id)?.ad ?? "";
  const onceki = u.dersler.find((x) => x.no === d.no - 1);
  const sonraki = u.dersler.find((x) => x.no === d.no + 1);
  const yeni = dersKelimeleri(d).length;

  const Baslik = ({ id, children }: { id: string; children?: React.ReactNode }) => (
    <h2>
      <span className="ub-no">{no(id)}</span>
      {children ?? ad(id)}
    </h2>
  );

  return (
    <div className="sayfa">
      <Ust aktif={deneme ? "deneme" : "uniteler"} />
      <main className="unite">
        <header className="unite-kapak">
          <p className="unite-ust">
            {deneme ? (
              <span className="geri">Ücretsiz deneme dersi</span>
            ) : (
              <Link href={`/uniteler/${u.kod}`} className="geri">
                Ünite {u.sira}: {u.baslik}
              </Link>
            )}
            <span className="tur-etiket">
              Ders {u.sira}.{d.no}
            </span>
          </p>
          <h1>{d.baslik}</h1>
          <p className="ders-hedef">{d.hedef}</p>
          {deneme && (
            <p className="deneme-not">
              Kayıt olmadan çalışabilirsin. Bu dersin her bölümü açık; sadece ilerlemen kaydedilmez. Beğenirsen ücretsiz kayıt olup kaldığın yerden devam edersin.
            </p>
          )}
          <p className="not">
            {d.tekrar ? "Tekrar dersi: yeni kelime yok." : `${yeni} yeni kelime, ${d.kaliplar.length} kalıp.`} Yaklaşık 30 dakika.
            {!deneme && " Başladığın bu dersin kelimeleri Günlük tekrar kartlarına eklenir."}
          </p>
        </header>

        <div className="unite-duzen">
          <DersGezgin d={d} />
          <div className="unite-icerik">
            {d.kelimeGruplari.length > 0 && (
              <section id="kelimeler" className="ub">
                <Baslik id="kelimeler" />
                <Kelimeler u={u} d={d} />
              </section>
            )}
            {d.kaliplar.length > 0 && (
              <section id="kaliplar" className="ub">
                <Baslik id="kaliplar">Hazır kalıplar</Baslik>
                <p className="not ub-giris">Bunları tek parça ezberle. Gramerini sonra öğreneceksin, şimdilik kullan.</p>
                <Kaliplar kaliplar={d.kaliplar} />
              </section>
            )}
            {d.gramer.length > 0 && (
              <section id="gramer" className="ub">
                <Baslik id="gramer" />
                <Gramer bolumler={d.gramer} kesfet={!d.tekrar} />
              </section>
            )}
            {d.diyaloglar.length > 0 && (
              <section id="diyaloglar" className="ub">
                <Baslik id="diyaloglar" />
                <p className="not ub-giris">Her diyaloğu dört adımda çalış: önce sadece dinle, sonra oku, sonra boşlukları doldur, en son bir kişinin yerine sen konuş.</p>
                <div className="ub-yigin">
                  {d.diyaloglar.map((x) => (
                    <DiyalogCalis key={x.baslik} u={u} d={d} x={x} />
                  ))}
                  <MiniDiyaloglar u={u} d={d} />
                </div>
              </section>
            )}
            {d.okuma && (
              <section id="okuma" className="ub">
                <Baslik id="okuma" />
                <div className="ub-yigin">
                  <OkumaOkuyucu u={u} o={d.okuma} dersKod={d.kod} />
                </div>
              </section>
            )}
            <section id="alistirmalar" className="ub">
              <Baslik id="alistirmalar" />
              <div className="ub-yigin">
                <BoslukDoldur u={u} d={d} />
                <SiraylaKur u={u} d={d} />
                <Eslestir u={u} d={d} />
              </div>
            </section>
            {d.motor && (
              <section id="cumle" className="ub">
                <Baslik id="cumle" />
                <UniteMotoru u={u} d={d} />
              </section>
            )}
            {d.konusma.length > 0 && (
              <section id="konusma" className="ub">
                <Baslik id="konusma" />
                <Konusma d={d} />
              </section>
            )}
            <section id="test" className="ub">
              <Baslik id="test" />
              <UniteTesti u={u} d={d} />
            </section>

            {deneme ? (
              <section className="deneme-son" aria-labelledby="deneme-son-baslik">
                <h2 id="deneme-son-baslik">İlk dersi bitirdin</h2>
                <p>
                  Ünite 1'de {u.dersler.length - 1} ders daha var, sonra Ünite 2 başlıyor. Ücretsiz kayıt olursan ilerlemen kaydedilir, öğrendiğin kelimeler günlük tekrar kartlarına
                  eklenir ve sıradaki derse geçersin.
                </p>
                <div className="cta">
                  <Link href={`/kayit?sonra=/uniteler/${u.kod}/${d.no + 1}`} className="dugme ana buyuk">
                    Ücretsiz kayıt ol, devam et
                  </Link>
                  <Link href="/seviye-testi" className="dugme buyuk">
                    Seviyeni öğren
                  </Link>
                </div>
                <p className="not">Kart bilgisi istenmez.</p>
              </section>
            ) : (
            <nav className="ders-gecis" aria-label="Dersler arası">
              {onceki ? (
                <Link href={`/uniteler/${u.kod}/${onceki.no}`} className="dugme">
                  Önceki: {u.sira}.{onceki.no} {onceki.baslik}
                </Link>
              ) : (
                <span />
              )}
              {sonraki ? (
                <Link href={`/uniteler/${u.kod}/${sonraki.no}`} className="dugme ana">
                  Sıradaki: {u.sira}.{sonraki.no} {sonraki.baslik}
                </Link>
              ) : (
                <Link href="/uniteler" className="dugme ana">
                  Ünitelere dön
                </Link>
              )}
            </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

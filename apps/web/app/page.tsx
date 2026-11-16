import Link from "next/link";
import { CAMP_L, M_SUBJ, M_VERB, aorTR, diagnose, isaretParcala, type Soru } from "@ti/motor";
import { A1_PLAN, UNITELER } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { Hero } from "@/components/Hero";
import { oturum } from "@/lib/supabase/sunucu";
import "./ana.css";

// "Nasıl çalışır" örneği: gerçek motor çıktısı (sunucuda hesaplanır)
const ORNEK: Soru = (() => {
  const v = M_VERB.find((x) => x.en === "drink")!,
    s = M_SUBJ.find((x) => x.en === "You")!;
  return {
    tr: `Kahve ${aorTR(v, 1, true)}.`,
    en: "You don't drink coffee.",
    kind: "Geniş zaman · olumsuz",
    chips: [],
    alts: [],
    meta: { form: "simple", pol: "neg", s, third: false, gizli: true, v, comp: "coffee", compTr: "kahve", alt: [] },
  };
})();
const ORNEK_CEVAP = "You not drink coffee";
const ORNEK_TESHIS = diagnose(ORNEK, ORNEK_CEVAP);

const GRUPLAR = [...new Set(CAMP_L.map((x) => x.g))];

function Vurgulu({ metin }: { metin: string }) {
  return (
    <>
      {isaretParcala(metin).map((p, i) => (p.vurgu ? <mark key={i}>{p.t === "i" ? "I" : p.t}</mark> : <span key={i}>{p.t}</span>))}
    </>
  );
}

export default async function Ana() {
  const { user } = await oturum().catch(() => ({ user: null }));
  const basla = user ? { href: "/uniteler", ad: "Derslere devam et" } : { href: "/kayit", ad: "Ücretsiz kayıt ol" };
  return (
    <div className="sayfa">
      <Ust aktif="ana" />
      <main>
        <section className="kahraman" aria-labelledby="baslik">
          <div className="kahraman-metin">
            <h1 id="baslik">Türkçedeki ek, İngilizcede ayrı bir kelimedir.</h1>
            <p className="giris">
              Türkçe düşünenler için sıfırdan İngilizce. Hikâyeli dersler, sesli diyaloglar ve günlük tekrar kartlarıyla öğrenirsin; yanlış yaptığında nedenini kendi
              dilinin ekleriyle anlarsın.
            </p>
            <div className="cta">
              {user ? (
                <Link href={basla.href} className="dugme ana buyuk">
                  {basla.ad}
                </Link>
              ) : (
                <>
                  <Link href="/deneme" className="dugme ana buyuk">
                    İlk dersi ücretsiz dene
                  </Link>
                  <Link href="/seviye-testi" className="dugme buyuk">
                    Seviyeni öğren
                  </Link>
                </>
              )}
            </div>
            {!user && <p className="not kahraman-not">Kayıt gerekmez. İlk ders herkese açık; beğenirsen ücretsiz hesap açarsın.</p>}
          </div>
          <div className="kahraman-gosteri yaprak">
            <Hero />
          </div>
        </section>

        <section className="nasil-bolum" id="nasil" aria-labelledby="nasil-baslik">
          <h2 id="nasil-baslik">Bir cümle, üç adım</h2>
          <ol className="adimlar">
            <li>
              <span className="adim-no">1</span>
              <h3>Türkçe cümleyi görürsün</h3>
              <p className="adim-metin">Her seferinde motorun kurduğu yeni bir cümle. Binlerce farklı cümle var, ezber olmaz.</p>
              <div className="mini yaprak">
                <p className="mini-tr">{ORNEK.tr}</p>
              </div>
            </li>
            <li>
              <span className="adim-no">2</span>
              <h3>İngilizcesini yazarsın</h3>
              <p className="adim-metin">Takılırsan Türkçe cümleyi parçalarına ayırıp hangi ekin nereye gittiğine bakabilirsin.</p>
              <div className="mini yaprak">
                <p className="mini-girdi" lang="en">
                  {ORNEK_CEVAP}
                  <span className="imlec" aria-hidden="true" />
                </p>
              </div>
            </li>
            <li>
              <span className="adim-no">3</span>
              <h3>Nedenini kendi dilinle öğrenirsin</h3>
              <p className="adim-metin">“Yanlış” demekle kalmaz. Hatayı Türkçedeki ekten yola çıkarak anlatır.</p>
              <div className="mini yaprak">
                <ul className="mini-teshis">
                  {ORNEK_TESHIS.map((d, i) => (
                    <li key={i}>
                      <Vurgulu metin={d.metin} />
                    </li>
                  ))}
                </ul>
                <p className="mini-dogru" lang="en">
                  {ORNEK.en}
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="icinde" aria-labelledby="icinde-baslik">
          <h2 id="icinde-baslik">İçinde ne var?</h2>
          <p className="giris">Sıfırdan başlayan biri için A1 programı. Her ders yaklaşık 30 dakika; telefonda da bilgisayarda da çalışır.</p>
          <ul className="ozellikler">
            <li>
              <h3>Hikâyeli dersler</h3>
              <p>Moda Apartmanı'na taşınan Deniz ve komşuları. Her ders hikâyenin bir bölümü; aynı kişiler, aynı kelimeler tekrar tekrar karşına çıkar.</p>
            </li>
            <li>
              <h3>Diyalog: dinle, oku, doldur, konuş</h3>
              <p>Her diyaloğu dört adımda çalışırsın. Son adımda karakterin yerine sen konuşursun. Derste görmediğin kelime çıkmaz.</p>
            </li>
            <li>
              <h3>Günlük tekrar kartları</h3>
              <p>Bildiğin kelime 1, 2, 4, 7, 14 gün sonra tekrar sorulur; bilemediğin aynı gün döner. Günde 10 dakika yeter.</p>
            </li>
            <li>
              <h3>Cümle motoru</h3>
              <p>Türkçe cümleyi görür, İngilizcesini yazarsın. Yanlışında neyi neden yanlış yaptığını Türkçedeki eklerle açıklar.</p>
            </li>
            <li>
              <h3>Okunuş ve sesler</h3>
              <p>Her kelime sesli. Okunuşlar sözlüklerdeki standart yazıyla (IPA) verilir; Türkçede olmayan sesler ayrıca anlatılır.</p>
            </li>
            <li>
              <h3>Öğretmenin seni görür</h3>
              <p>Öğretmeninin koduyla bağlanırsın; hangi derste olduğunu, nerede zorlandığını o da görür. Öğretmenin yoksa tek başına da çalışırsın.</p>
            </li>
          </ul>
        </section>

        <section className="program" aria-labelledby="program-baslik">
          <h2 id="program-baslik">A1 programı: {A1_PLAN.length} ünite, {A1_PLAN.reduce((t, x) => t + x.dersSayisi, 0)} ders</h2>
          <p className="giris">Her ünite bir konu ve Türkçedeki bir ekin İngilizce karşılığı. Program yazıldıkça açılıyor.</p>
          <ol className="program-liste">
            {A1_PLAN.map((x) => {
              const hazir = UNITELER.some((u) => u.kod === x.kod);
              return (
                <li key={x.kod} className={hazir ? "hazir" : ""}>
                  <span className="pl-no">{x.sira}</span>
                  <span className="pl-govde">
                    <b>{x.baslik}</b>
                    <small>{x.gramerEtiketi}</small>
                  </span>
                  <span className="pl-durum">{hazir ? "Hazır" : "Hazırlanıyor"}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="ogretmenlere" aria-labelledby="ogr-baslik">
          <div>
            <h2 id="ogr-baslik">Öğretmen misiniz?</h2>
            <p>
              Öğretmen hesabı ücretsiz. Öğrencileriniz kodunuzla bağlanır; her öğrencinin hangi derste olduğunu, kaç gün çalıştığını, hangi kelimelerde ve hangi kuralda zorlandığını
              görürsünüz. Derste neyin üzerinde duracağınızı önceden bilirsiniz.
            </p>
          </div>
          <Link href="/kayit" className="dugme buyuk">
            Öğretmen hesabı aç
          </Link>
        </section>

        <section className="sss" aria-labelledby="sss-baslik">
          <h2 id="sss-baslik">Sık sorulanlar</h2>
          <details>
            <summary>Ücretli mi?</summary>
            <p>Şu an erken erişim dönemindeyiz ve her şey ücretsiz. Kart bilgisi istenmez. Ücretli üyelik başlarsa önceden haber veririz; kendiliğinden ödeme alınmaz.</p>
          </details>
          <details>
            <summary>Hiç İngilizce bilmiyorum, uygun mu?</summary>
            <p>Evet. Program “Hello” ile başlar. Her şey Türkçe anlatılır ve her derste sadece o derse kadar öğrendiğin kelimeler kullanılır.</p>
          </details>
          <details>
            <summary>Günde ne kadar zaman ayırmalıyım?</summary>
            <p>Bir ders yaklaşık 30 dakika. Ders yapmadığın günlerde 10 dakikalık tekrar kartları yeterli. Az ama sık çalışmak, haftada bir uzun çalışmaktan daha kalıcıdır.</p>
          </details>
          <details>
            <summary>Telefonda çalışır mı?</summary>
            <p>Evet, uygulama indirmeden tarayıcıda çalışır. Sesli okuma ve konuşarak cevap verme için Android'de Chrome önerilir.</p>
          </details>
          <details>
            <summary>Verilerim ne oluyor?</summary>
            <p>
              Sadece çalışma kayıtların tutulur; öğretmenin dışında kimseyle paylaşılmaz. Hesabım sayfasından bütün verini indirebilir, hesabını kalıcı olarak silebilirsin. 18 yaşından
              küçükler için veli onayı istenir.
            </p>
          </details>
          <Link href={basla.href} className="dugme ana buyuk">
            {basla.ad}
          </Link>
          {!user && <p className="not">Ücretsiz. Kart gerekmez.</p>}
        </section>


        <footer className="alt">
          <p>İlerlemen hesabına kaydedilir; telefonda başladığın derse bilgisayarda devam edersin.</p>
          <p className="not">Deneme sürümü, 2026.</p>
        </footer>
      </main>
    </div>
  );
}

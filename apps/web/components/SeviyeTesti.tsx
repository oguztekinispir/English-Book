"use client";
/**
 * Seviye testi: basamak basamak ilerler, bir basamakta 3'ten az doğru yapılınca biter.
 * Sonuç tarayıcıda saklanır (ti:seviye). Girişsiz de çözülür.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { A1_PLAN, SEVIYE_GECME, SEVIYE_TESTI, UNITELER, seviyeSonucu, type SeviyeSoru, type SeviyeSonucu } from "@ti/icerik";
import { konus, sesVar } from "@/lib/ses";
import { durumGuncelle } from "@/lib/kayit";

const ANAHTAR = "ti:seviye";
const TOPLAM = SEVIYE_TESTI.reduce((t, b) => t + b.sorular.length, 0);

const karistir = <T,>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

const YONERGE: Record<SeviyeSoru["tur"], string> = {
  cevir: "Bu cümlenin İngilizcesi hangisi?",
  bosluk: "Boşluğa ne gelir?",
  dinle: "Dinle. Ne diyor?",
};

type Durum = { asama: "giris" } | { asama: "soru"; b: number; s: number; puanlar: number[] } | { asama: "sonuc"; sonuc: SeviyeSonucu };

export function SeviyeTesti({ girisli }: { girisli: boolean }) {
  const [durum, setDurum] = useState<Durum>({ asama: "giris" });
  const [onceki, setOnceki] = useState<{ unite: number; tarih: string } | null>(null);

  useEffect(() => {
    try {
      const x = localStorage.getItem(ANAHTAR);
      if (x) setOnceki(JSON.parse(x));
    } catch {}
  }, []);

  const basla = () => setDurum({ asama: "soru", b: 0, s: 0, puanlar: [0] });

  if (durum.asama === "giris")
    return (
      <div className="seviye-giris">
        <ul className="seviye-maddeler">
          <li>En fazla {TOPLAM} kısa soru, yaklaşık 5 dakika.</li>
          <li>Kolaydan zora gider; zorlandığın yerde test kendiliğinden biter.</li>
          <li>Bilmediğin soruda tahmin etme, “Bilmiyorum” de. Sonuç böylece daha doğru çıkar.</li>
        </ul>
        <button type="button" className="dugme ana buyuk" onClick={basla}>
          Teste başla
        </button>
        {onceki && (
          <p className="not">
            Daha önce çözdün: Ünite {onceki.unite > 14 ? "A2" : onceki.unite} önerilmişti ({new Date(onceki.tarih).toLocaleDateString("tr-TR")}).
          </p>
        )}
      </div>
    );

  if (durum.asama === "sonuc") return <Sonuc sonuc={durum.sonuc} girisli={girisli} tekrar={basla} />;

  const { b, s, puanlar } = durum;
  const basamak = SEVIYE_TESTI[b];
  const soru = basamak.sorular[s];
  const cozulen = SEVIYE_TESTI.slice(0, b).reduce((t, x) => t + x.sorular.length, 0) + s;

  const ilerle = (dogru: boolean) => {
    const p = [...puanlar];
    p[b] += dogru ? 1 : 0;
    if (s + 1 < basamak.sorular.length) return setDurum({ asama: "soru", b, s: s + 1, puanlar: p });
    // Basamak bitti: geçemediyse ya da son basamaksa sonuç
    if (p[b] < SEVIYE_GECME || b + 1 === SEVIYE_TESTI.length) {
      const sonuc = seviyeSonucu(p);
      const tarih = new Date().toISOString();
      try {
        localStorage.setItem(ANAHTAR, JSON.stringify({ unite: sonuc.unite, puanlar: p, tarih }));
      } catch {}
      // Giriş yapılmışsa öğretmen de görsün
      if (girisli) durumGuncelle({ seviye_unite: sonuc.unite, seviye_puanlar: p, seviye_tarih: tarih });
      return setDurum({ asama: "sonuc", sonuc });
    }
    setDurum({ asama: "soru", b: b + 1, s: 0, puanlar: [...p, 0] });
  };

  return (
    <div className="seviye-soru-alan">
      <div className="seviye-ilerleme" aria-hidden="true">
        <span style={{ width: `${(cozulen / TOPLAM) * 100}%` }} />
      </div>
      <p className="seviye-ust">
        <span className="tur-etiket">
          Basamak {b + 1} / {SEVIYE_TESTI.length}: {basamak.ad}
        </span>
        <span className="not">
          Soru {s + 1} / {basamak.sorular.length}
        </span>
      </p>
      <SoruKutusu key={`${b}-${s}`} soru={soru} bitince={ilerle} />
    </div>
  );
}

function SoruKutusu({ soru, bitince }: { soru: SeviyeSoru; bitince: (dogru: boolean) => void }) {
  const secenekler = useMemo(() => karistir(soru.secenekler), [soru]);
  const dogru = soru.secenekler[0];
  const [secim, setSecim] = useState<string | null>(null);
  const [ses, setSes] = useState(false);
  const [yaziAcik, setYaziAcik] = useState(false);

  useEffect(() => setSes(sesVar()), []);

  const cevaplandi = secim !== null;
  const bildi = secim === dogru;
  const dinle = soru.tur === "dinle";
  const yaziGorunur = !dinle || yaziAcik || !ses || cevaplandi;

  return (
    <div className="seviye-kart yaprak">
      <p className="seviye-yonerge">{YONERGE[soru.tur]}</p>
      {dinle && ses && (
        <div className="seviye-dinle">
          <button type="button" className="dugme ana" onClick={() => konus(soru.soru)}>
            Dinle
          </button>
          {!yaziAcik && !cevaplandi && (
            <button type="button" className="dugme sade kucuk" onClick={() => setYaziAcik(true)}>
              Sesi duyamıyorum, yazıyı göster
            </button>
          )}
        </div>
      )}
      {yaziGorunur && (
        <p className="seviye-cumle" lang={soru.tur === "cevir" ? "tr" : "en"}>
          {soru.tur === "bosluk"
            ? soru.soru.split("___").map((p, i) => (
                <span key={i}>
                  {i > 0 && <span className="seviye-bosluk">{cevaplandi ? dogru : "  "}</span>}
                  {p}
                </span>
              ))
            : soru.soru}
        </p>
      )}
      <div className="seviye-secenekler">
        {secenekler.map((x) => (
          <button
            key={x}
            type="button"
            className={`secenek-dugme${cevaplandi && x === dogru ? " dogru" : ""}${cevaplandi && x === secim && !bildi ? " yanlis" : ""}`}
            disabled={cevaplandi}
            lang={dinle ? "tr" : "en"}
            onClick={() => setSecim(x)}
          >
            {x}
          </button>
        ))}
        <button type="button" className="secenek-dugme bilmiyorum" disabled={cevaplandi} onClick={() => setSecim("")}>
          Bilmiyorum
        </button>
      </div>
      {cevaplandi && (
        <div className={`seviye-geri ${bildi ? "iyi" : "kotu"}`} role="status">
          <p>
            <b>{bildi ? "Doğru." : secim === "" ? "Sorun değil." : "Doğrusu bu:"}</b> {!bildi && <span lang={dinle ? "tr" : "en"}>{dogru}</span>}
          </p>
          <p className="not">{soru.aciklama}</p>
          <button type="button" className="dugme ana" onClick={() => bitince(bildi)} autoFocus>
            Devam
          </button>
        </div>
      )}
    </div>
  );
}

function Sonuc({ sonuc, girisli, tekrar }: { sonuc: SeviyeSonucu; girisli: boolean; tekrar: () => void }) {
  const plan = A1_PLAN.find((u) => u.sira === sonuc.unite);
  const hazir = UNITELER.find((u) => u.sira === sonuc.unite);
  const sonHazir = UNITELER[UNITELER.length - 1];
  const hedef = hazir ? `/uniteler/${hazir.kod}` : `/uniteler/${sonHazir.kod}`;

  return (
    <div className="seviye-sonuc">
      <div className="seviye-oneri yaprak">
        <p className="not">Önerimiz</p>
        {plan ? (
          <>
            <h2>
              Ünite {plan.sira}: {plan.baslik}
            </h2>
            <p>{plan.hedef}</p>
          </>
        ) : (
          <>
            <h2>A1'in konularını biliyorsun</h2>
            <p>Bir sonraki adım A2. A2 üniteleri hazırlanıyor.</p>
          </>
        )}
        {!hazir && (
          <p className="seviye-uyari">
            {plan ? `Ünite ${plan.sira} henüz hazırlanıyor.` : ""} Şimdilik açık olan ilk {UNITELER.length} üniteyi hızlıca geçebilirsin: bildiğin derslerde sadece sondaki testi çözmen yeterli.
            Yeni üniteler açıldıkça kaldığın yerden devam edersin.
          </p>
        )}
        <div className="cta">
          {girisli ? (
            <Link href={hedef} className="dugme ana buyuk">
              {hazir ? `Ünite ${hazir.sira}'den başla` : "Ünitelere git"}
            </Link>
          ) : (
            <>
              <Link href={`/kayit?sonra=${encodeURIComponent(hedef)}`} className="dugme ana buyuk">
                Ücretsiz kayıt ol, başla
              </Link>
              <Link href="/deneme" className="dugme buyuk">
                Önce ilk dersi dene
              </Link>
            </>
          )}
        </div>
      </div>

      <h3 className="seviye-ozet-baslik">Basamak basamak sonucun</h3>
      <ol className="seviye-ozet">
        {SEVIYE_TESTI.map((b, i) => {
          const p = sonuc.puanlar[i];
          const durum = p === undefined ? "cozulmedi" : p >= SEVIYE_GECME ? "gecti" : "kaldi";
          return (
            <li key={b.ad} className={durum}>
              <b>{b.ad}</b>
              <span className="not">{b.konu}</span>
              <span className="seviye-puan">{p === undefined ? "Sorulmadı" : `${p} / ${b.sorular.length}`}</span>
            </li>
          );
        })}
      </ol>
      <button type="button" className="dugme sade" onClick={tekrar}>
        Testi yeniden çöz
      </button>
    </div>
  );
}

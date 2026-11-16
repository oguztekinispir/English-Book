"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ekiBulHavuzu, UNITELER, type EkiBulSorusu, type Kart } from "@ti/icerik";
import { useKalici } from "@/lib/depo";
import { konus, sesVar } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { bilemedi, havuz } from "@/lib/tekrar";
import { SesDugmesi } from "@/components/Kucukler";
import { karistir } from "@/components/unite/ortak";
import { HenuzDersYok, UniteSecimi, useAcilanlar } from "./ortak";

/** Türkçesi birbirinden farklı n kart (aynı anlamlı iki kelime aynı turda çıkmasın) */
function farkliSec(kartlar: Kart[], n: number): Kart[] {
  const out: Kart[] = [];
  const goruldu = new Set<string>();
  for (const k of karistir(kartlar)) {
    const t = k.tr.toLocaleLowerCase("tr");
    if (goruldu.has(t) || goruldu.has(k.en.toLowerCase())) continue;
    goruldu.add(t);
    goruldu.add(k.en.toLowerCase());
    out.push(k);
    if (out.length === n) break;
  }
  return out;
}

export function Oyunlar() {
  const { acilan, hazir } = useAcilanlar();
  const [unite, setUnite] = useKalici("oyun-unite", "all");
  if (!hazir) return <div className="yaprak bos-yer" aria-hidden="true" />;
  const kelimeler = havuz({ unite, tur: "kelime" });
  return (
    <>
      {acilan.length ? (
        <>
          <div className="suzgecler oyun-suzgec">
            <UniteSecimi id="oy-u" deger={unite} degistir={setUnite} acilan={acilan} />
            <p className="not">Oyunlar açtığın derslerin kelimeleriyle oynanır ({kelimeler.length} kelime). Bilemediğin kelime bugünkü tekrar kartlarına eklenir.</p>
          </div>
          <Eslestirme kelimeler={kelimeler} rekorAnahtar={`rekor-eslestir-${unite}`} />
          <DinleBul kelimeler={kelimeler} rekorAnahtar={`rekor-dinle-${unite}`} />
        </>
      ) : (
        <HenuzDersYok ne="Eşleştirme ve dinle-bul oyunları" />
      )}
      <KalipBul acilan={acilan} />
    </>
  );
}

/* ---------- Eşleştir: zamana karşı ---------- */

function Eslestirme({ kelimeler, rekorAnahtar }: { kelimeler: Kart[]; rekorAnahtar: string }) {
  const [rekor, setRekor] = useKalici<number | null>(rekorAnahtar, null);
  const [tur, setTur] = useState<{ kartlar: Kart[]; sag: Kart[]; t0: number } | null>(null);
  const [secili, setSecili] = useState<string | null>(null);
  const [eslesen, setEslesen] = useState<Set<string>>(new Set());
  const [yanlis, setYanlis] = useState<string | null>(null);
  const [hata, setHata] = useState(0);
  const [son, setSon] = useState<{ sn: number; hata: number; rekor: boolean } | null>(null);
  const [sn, setSn] = useState(0);
  const yeterli = kelimeler.length >= 4;

  useEffect(() => {
    if (!tur) return;
    const t = setInterval(() => setSn(Math.floor((Date.now() - tur.t0) / 1000)), 250);
    return () => clearInterval(t);
  }, [tur]);

  const basla = () => {
    const k = farkliSec(kelimeler, 6);
    setTur({ kartlar: k, sag: karistir(k), t0: Date.now() });
    setEslesen(new Set());
    setSecili(null);
    setHata(0);
    setSon(null);
    setSn(0);
  };

  const sagaBas = (k: Kart) => {
    if (!tur || !secili || eslesen.has(k.anahtar)) return;
    if (k.anahtar === secili) {
      const yeni = new Set(eslesen).add(k.anahtar);
      setEslesen(yeni);
      setSecili(null);
      if (yeni.size === tur.kartlar.length) {
        const s = Math.round((Date.now() - tur.t0) / 1000);
        const r = rekor === null || s < rekor;
        if (r) setRekor(s);
        setSon({ sn: s, hata, rekor: r });
        setTur(null);
      }
    } else {
      setHata((h) => h + 1);
      setYanlis(k.anahtar);
      setTimeout(() => setYanlis(null), 450);
      const sol = tur.kartlar.find((x) => x.anahtar === secili)!;
      bilemedi(sol.anahtar);
      cevapKaydet({ kaynak: "oyun", dogru: false, soru: sol.en, cevap: k.tr, beklenen: sol.tr, ders: sol.dersKod });
    }
  };

  return (
    <section className="calisma-blok yaprak" aria-labelledby="es-baslik">
      <h2 id="es-baslik">Eşleştir</h2>
      <p className="not">Soldan bir İngilizce kelime seç, sağda Türkçesini bul. Altı çifti ne kadar hızlı bitireceksin?</p>
      {!tur ? (
        <>
          {son && (
            <p className="oyun-sonuc" role="status">
              <b>{son.sn} saniye</b> <span>{son.hata ? `${son.hata} hata` : "hatasız"}</span>
              {son.rekor && <span className="tur-etiket">Yeni rekor</span>}
            </p>
          )}
          <div className="dugmeler">
            <button type="button" className="dugme ana" onClick={basla} disabled={!yeterli}>
              {son ? "Bir tur daha" : "Başla"}
            </button>
            {rekor !== null && <span className="not">Rekorun: {rekor} sn</span>}
            {!yeterli && <span className="not">En az 4 kelime lazım. Bir ders daha aç.</span>}
          </div>
        </>
      ) : (
        <>
          <p className="oyun-hud">
            <span>{sn} sn</span>
            <span>
              {eslesen.size} / {tur.kartlar.length}
            </span>
            <span>{hata} hata</span>
          </p>
          <div className="es-izgara">
            <div className="es-sutun">
              {tur.kartlar.map((k) => (
                <button
                  key={k.anahtar}
                  type="button"
                  lang="en"
                  className={`es-kart${secili === k.anahtar ? " secili" : ""}${eslesen.has(k.anahtar) ? " tamam" : ""}`}
                  disabled={eslesen.has(k.anahtar)}
                  aria-pressed={secili === k.anahtar}
                  onClick={() => {
                    setSecili(k.anahtar);
                    konus(k.en);
                  }}
                >
                  {k.en}
                </button>
              ))}
            </div>
            <div className="es-sutun">
              {tur.sag.map((k) => (
                <button
                  key={k.anahtar}
                  type="button"
                  className={`es-kart${eslesen.has(k.anahtar) ? " tamam" : ""}${yanlis === k.anahtar ? " yanlis" : ""}`}
                  disabled={eslesen.has(k.anahtar) || !secili}
                  onClick={() => sagaBas(k)}
                >
                  {k.tr}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ---------- Dinle, bul: 3 can ---------- */

function DinleBul({ kelimeler, rekorAnahtar }: { kelimeler: Kart[]; rekorAnahtar: string }) {
  const [rekor, setRekor] = useKalici(rekorAnahtar, 0);
  const [oyun, setOyun] = useState<{ deste: Kart[]; i: number; can: number; puan: number } | null>(null);
  const [secenek, setSecenek] = useState<Kart[]>([]);
  const [secim, setSecim] = useState<string | null>(null);
  const [bitis, setBitis] = useState<{ puan: number; rekor: boolean } | null>(null);
  const [ses, setSes] = useState(true);
  useEffect(() => setSes(sesVar()), []);
  const yeterli = kelimeler.length >= 4;
  const k = oyun?.deste[oyun.i];

  const hazirla = (deste: Kart[], i: number) => {
    const dogru = deste[i];
    const digerleri = farkliSec(
      kelimeler.filter((x) => x.anahtar !== dogru.anahtar && x.tr !== dogru.tr),
      3,
    );
    setSecenek(karistir([dogru, ...digerleri]));
    setSecim(null);
    setTimeout(() => konus(dogru.en), 150);
  };

  const basla = () => {
    const deste = karistir(kelimeler);
    setOyun({ deste, i: 0, can: 3, puan: 0 });
    setBitis(null);
    hazirla(deste, 0);
  };

  const sec = (x: Kart) => {
    if (!oyun || !k || secim) return;
    setSecim(x.anahtar);
    const ok = x.anahtar === k.anahtar;
    cevapKaydet({ kaynak: "oyun", dogru: ok, soru: k.en, cevap: x.tr, beklenen: k.tr, ders: k.dersKod });
    if (ok) setOyun({ ...oyun, puan: oyun.puan + 1 });
    else {
      bilemedi(k.anahtar);
      setOyun({ ...oyun, can: oyun.can - 1 });
      konus(k.en);
    }
  };

  const ileri = () => {
    if (!oyun) return;
    const i = oyun.i + 1;
    if (oyun.can <= 0 || i >= oyun.deste.length) {
      const r = oyun.puan > rekor;
      if (r) setRekor(oyun.puan);
      setBitis({ puan: oyun.puan, rekor: r && oyun.puan > 0 });
      setOyun(null);
      return;
    }
    setOyun({ ...oyun, i });
    hazirla(oyun.deste, i);
  };

  return (
    <section className="calisma-blok yaprak" aria-labelledby="db-baslik">
      <h2 id="db-baslik">Dinle, bul</h2>
      <p className="not">Kelimeyi dinle, Türkçesini seç. Üç canın var. Ekrana bakmadan, sadece kulağınla.</p>
      {!ses && <p className="uyari-kutu">Bu tarayıcı sesli okumayı desteklemiyor. Telefonda Chrome ile açmayı dene.</p>}
      {!oyun || !k ? (
        <>
          {bitis && (
            <p className="oyun-sonuc" role="status">
              <b>{bitis.puan} puan</b> <span>Bilemediklerin tekrar kartlarına eklendi.</span>
              {bitis.rekor && <span className="tur-etiket">Yeni rekor</span>}
            </p>
          )}
          <div className="dugmeler">
            <button type="button" className="dugme ana" onClick={basla} disabled={!yeterli || !ses}>
              {bitis ? "Tekrar oyna" : "Başla"}
            </button>
            {rekor > 0 && <span className="not">Rekorun: {rekor} puan</span>}
          </div>
        </>
      ) : (
        <>
          <p className="oyun-hud">
            <span className="canlar" aria-label={`${oyun.can} can`}>
              {"♥".repeat(Math.max(oyun.can, 0))}
              <span className="sonmus">{"♥".repeat(3 - Math.max(oyun.can, 0))}</span>
            </span>
            <span>{oyun.puan} puan</span>
          </p>
          <div className="db-alan">
            <button type="button" className="db-dinle" onClick={() => konus(k.en)} aria-label="Tekrar dinle">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
                <path d="M10.5 5.2a3.8 3.8 0 0 1 0 5.6M12.4 3.4a6.3 6.3 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
              Tekrar dinle
            </button>
            <div className="secenekler">
              {secenek.map((x) => (
                <button
                  key={x.anahtar}
                  type="button"
                  className={`secenek${secim && x.anahtar === k.anahtar ? " dogru" : ""}${secim === x.anahtar && x.anahtar !== k.anahtar ? " yanlis" : ""}`}
                  disabled={!!secim}
                  onClick={() => sec(x)}
                >
                  {x.tr}
                </button>
              ))}
            </div>
            {secim && (
              <div className="db-cevap">
                <p>
                  <b lang="en">{k.en}</b> = {k.tr}
                </p>
                <button type="button" className="dugme ana" autoFocus onClick={ileri}>
                  {oyun.can > 0 && oyun.i + 1 < oyun.deste.length ? "Sonraki" : "Sonucu gör"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

/* ---------- Kalıp bul ---------- */

/** "We [are] hungry." → "are" */
const kelimesi = (t: string) => t.match(/\[(.+?)\]/)?.[1] ?? "";

/** Türkçe cümle verilir, İngilizce kalıptaki boşluğa doğru kelime seçilir. Yanlış şıklar önce aynı aileden (am / is / are gibi). */
function KalipBul({ acilan }: { acilan: string[] }) {
  const enUst = Math.max(0, ...UNITELER.filter((u) => u.dersler.some((d) => acilan.includes(d.kod))).map((u) => u.sira));
  const [hepsi, setHepsi] = useKalici("eki-bul-hepsi", false);
  const havuz = ekiBulHavuzu(hepsi || enUst === 0 ? 14 : enUst);
  const tumKelimeler = [...new Set(havuz.map((x) => kelimesi(x.s)))];
  const TUR = Math.min(10, havuz.length);
  const [rekor, setRekor] = useKalici<number | null>(`rekor-eki-bul-${hepsi ? "hepsi" : enUst}`, null);
  const [deste, setDeste] = useState<EkiBulSorusu[] | null>(null);
  const [i, setI] = useState(0);
  const [puan, setPuan] = useState(0);
  const [secim, setSecim] = useState<string | null>(null);
  const [son, setSon] = useState<number | null>(null);
  const s = deste?.[i];
  const dogruKelime = s ? kelimesi(s.s) : "";
  const secenekler = useMemo(() => {
    if (!s) return [];
    const aile = [...new Set(havuz.filter((x) => x.a === s.a).map((x) => kelimesi(x.s)))].filter((x) => x.toLowerCase() !== dogruKelime.toLowerCase());
    const diger = tumKelimeler.filter((x) => x.toLowerCase() !== dogruKelime.toLowerCase() && !aile.includes(x));
    // Boşluk cümle başındaysa büyük harf, ortadaysa küçük harf (I hariç)
    const basta = s.s.startsWith("[");
    const bicim = (x: string) => (/^I\b|^I'/.test(x) ? x : basta ? x.charAt(0).toUpperCase() + x.slice(1) : x.toLowerCase());
    const yanlis = [...new Set([...karistir(aile), ...karistir(diger)].map(bicim))].filter((x) => x !== bicim(dogruKelime)).slice(0, 3);
    return karistir([bicim(dogruKelime), ...yanlis]);
  }, [s]); // eslint-disable-line react-hooks/exhaustive-deps
  const kayit = useRef(0);

  const basla = () => {
    setDeste(karistir(havuz).slice(0, TUR));
    setI(0);
    setPuan(0);
    setSecim(null);
    setSon(null);
    kayit.current = 0;
  };
  const sec = (x: string) => {
    if (!s || secim) return;
    setSecim(x);
    const ok = x.toLowerCase() === dogruKelime.toLowerCase();
    if (ok) setPuan((p) => p + 1);
    cevapKaydet({ kaynak: "oyun", kural: "kalip-bul", dogru: ok, soru: s.s, cevap: x, beklenen: dogruKelime });
  };
  const ileri = () => {
    if (i + 1 >= TUR) {
      if (rekor === null || puan > rekor) setRekor(puan);
      setSon(puan);
      setDeste(null);
    } else {
      setI(i + 1);
      setSecim(null);
    }
  };
  /** Boşluklu cümle; cevaplanınca doğru kelime yerine oturur */
  const cumle = (t: string, dolu: boolean) => {
    const m = t.match(/^(.*?)\[(.+?)\](.*)$/);
    return m ? (
      <>
        {m[1]}
        <mark className="kb-bosluk">{dolu ? m[2] : "\u2003\u2003\u2003"}</mark>
        {m[3]}
      </>
    ) : (
      t
    );
  };

  return (
    <section className="calisma-blok yaprak" aria-labelledby="eb-baslik">
      <h2 id="eb-baslik">Kalıp bul</h2>
      <p className="not">
        Türkçe cümleyi oku, İngilizce kalıptaki boşluğa doğru kelimeyi seç. {TUR} soru,{" "}
        {hepsi || enUst === 0 ? "A1'in bütün kalıpları (henüz görmediklerin de var)." : `Ünite ${enUst}'e kadar öğrendiğin kalıplar.`}
      </p>
      {enUst > 0 && enUst < 14 && !deste && (
        <label className="alan yatay">
          <input type="checkbox" checked={hepsi} onChange={(e) => setHepsi(e.target.checked)} /> Henüz görmediğim kalıpları da sor
        </label>
      )}
      {!deste || !s ? (
        <>
          {son !== null && (
            <p className="oyun-sonuc" role="status">
              <b>
                {son} / {TUR}
              </b>{" "}
              <span>{son === TUR ? "Kusursuz." : "Yanlış yaptığın kalıplar için Gramer sayfasına bak."}</span>
            </p>
          )}
          <div className="dugmeler">
            <button type="button" className="dugme ana" onClick={basla}>
              {son !== null ? "Yeni tur" : "Başla"}
            </button>
            {rekor !== null && (
              <span className="not">
                Rekorun: {rekor} / {TUR}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="oyun-hud">
            <span>
              {i + 1} / {TUR}
            </span>
            <span>{puan} doğru</span>
          </p>
          <p className="kb-tr">{s.tr}</p>
          <p className="eb-cumle" lang="en">
            {cumle(s.s, !!secim)}
          </p>
          <div className="secenekler">
            {secenekler.map((x) => (
              <button
                key={x}
                type="button"
                lang="en"
                className={`secenek${secim && x.toLowerCase() === dogruKelime.toLowerCase() ? " dogru" : ""}${secim === x && x.toLowerCase() !== dogruKelime.toLowerCase() ? " yanlis" : ""}`}
                disabled={!!secim}
                onClick={() => sec(x)}
              >
                {x}
              </button>
            ))}
          </div>
          {secim && (
            <div className="db-cevap">
              <p>
                <b lang="en">{s.s.replace(/[[\]]/g, "")}</b> <SesDugmesi metin={s.s.replace(/[[\]]/g, "")} />
              </p>
              <button type="button" className="dugme ana" autoFocus onClick={ileri}>
                {i + 1 < TUR ? "Sonraki" : "Sonucu gör"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import type { Kart } from "@ti/icerik";
import { useKalici } from "@/lib/depo";
import { konus, sesVar, soyle, sustur, trSesVar } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { buluttanBirlestir, havuz, istatistik, notla, oturumKartlari, TEKRAR_OTURUM, YENI_OTURUM, type Suzgec } from "@/lib/tekrar";
import { SesDugmesi } from "@/components/Kucukler";
import { HenuzDersYok, UniteSecimi, useAcilanlar } from "./ortak";

type Yon = "tr" | "en";
interface Ayar extends Suzgec {
  yon: Yon;
}

export function Tekrar() {
  const { acilan, hazir } = useAcilanlar();
  const [, yenile] = useState(0);
  useEffect(() => {
    buluttanBirlestir().then((d) => d && yenile((x) => x + 1));
  }, []);
  if (!hazir) return <div className="yaprak bos-yer" aria-hidden="true" />;
  if (!acilan.length) return <HenuzDersYok ne="Tekrar kartları" />;
  return (
    <>
      <HatirlaKartlari acilan={acilan} />
      <Dinleme acilan={acilan} />
    </>
  );
}

/* ---------- 1. Hatırla kartları ---------- */

function HatirlaKartlari({ acilan }: { acilan: string[] }) {
  const [ayar, setAyar] = useKalici<Ayar>("tekrar-ayar", { unite: "all", tur: "all", yon: "tr" });
  const [deste, setDeste] = useState<Kart[] | null>(null);
  const [sira, setSira] = useState(0);
  const [acik, setAcik] = useState(false);
  const [bilemedik, setBilemedik] = useState<Record<string, number>>({});
  const [calisilan, setCalisilan] = useState(0);
  const st = istatistik(ayar);

  const basla = () => {
    setDeste(oturumKartlari(ayar));
    setSira(0);
    setAcik(false);
    setBilemedik({});
    setCalisilan(0);
  };

  const notVer = (bildi: boolean) => {
    if (!deste) return;
    const k = deste[sira];
    notla(k.anahtar, bildi, !!bilemedik[k.anahtar]);
    cevapKaydet({ kaynak: "tekrar", dogru: bildi, soru: ayar.yon === "tr" ? k.tr : k.en, beklenen: ayar.yon === "tr" ? k.en : k.tr, ders: k.dersKod });
    if (!bildi) {
      const n = (bilemedik[k.anahtar] ?? 0) + 1;
      setBilemedik({ ...bilemedik, [k.anahtar]: n });
      if (n <= 2) setDeste([...deste, k]); // bu oturumda iki kez daha gelir
    }
    setCalisilan((c) => c + 1);
    setAcik(false);
    setSira((s) => s + 1);
  };

  const k = deste?.[sira];
  const trOnce = ayar.yon === "tr";

  return (
    <section className="calisma-blok yaprak" aria-labelledby="hk-baslik">
      <h2 id="hk-baslik">Hatırla kartları</h2>
      <p className="not">
        Her gün en fazla {TEKRAR_OTURUM} tekrar ve {YENI_OTURUM} yeni kart gelir. Bildiğin kart 1, 2, 4, 7, sonra 14 gün sonra gelir. Bilemediğin kart yarın değil, bugün yine gelir.
      </p>

      {!deste ? (
        <>
          <div className="suzgecler">
            <UniteSecimi id="hk-u" deger={ayar.unite} degistir={(v) => setAyar({ ...ayar, unite: v })} acilan={acilan} />
            <label htmlFor="hk-t" className="alan">
              Ne çalışayım
              <select id="hk-t" value={ayar.tur} onChange={(e) => setAyar({ ...ayar, tur: e.target.value as Ayar["tur"] })}>
                <option value="all">Kelime ve kalıp</option>
                <option value="kelime">Sadece kelimeler</option>
                <option value="kalip">Sadece kalıplar</option>
              </select>
            </label>
            <label htmlFor="hk-y" className="alan">
              Yön
              <select id="hk-y" value={ayar.yon} onChange={(e) => setAyar({ ...ayar, yon: e.target.value as Yon })}>
                <option value="tr">Türkçe → İngilizce</option>
                <option value="en">İngilizce → Türkçe (kolay)</option>
              </select>
            </label>
          </div>
          <div className="sayaclar">
            <div>
              <b>{st.vadesi}</b>
              <span>bugün tekrar</span>
            </div>
            <div>
              <b>{Math.min(st.yeni, YENI_OTURUM)}</b>
              <span>yeni ({st.yeni} içinden)</span>
            </div>
            <div>
              <b>
                {st.ogrenildi}
                <small> / {st.toplam}</small>
              </b>
              <span>öğrenildi</span>
            </div>
          </div>
          <div className="dugmeler">
            <button type="button" className="dugme ana buyuk" onClick={basla} disabled={!st.vadesi && !st.yeni}>
              {st.vadesi || st.yeni ? "Tekrara başla" : "Bugünlük bitti"}
            </button>
          </div>
          {!st.vadesi && !st.yeni && <p className="not">Bu seçimde bugün kart kalmadı. Yarın {st.yarin} kart seni bekliyor. Yeni kart için bir sonraki dersi aç.</p>}
        </>
      ) : !k ? (
        <div className="hk-kart bitti" role="status">
          <p className="hk-soru">Bugünlük bitti.</p>
          <p>
            {calisilan} kart çalıştın. Yarın <b>{istatistik(ayar).yarin}</b> kart seni bekliyor.
          </p>
          <p className="not">Bilemediklerin yarın yine gelecek. Bildiklerin daha seyrek gelecek.</p>
          <button type="button" className="dugme" onClick={() => setDeste(null)}>
            Tamam
          </button>
        </div>
      ) : (
        <>
          <p className="hk-ilerleme">
            {sira + 1} / {deste.length}
            <span className="tur-etiket">{k.tur === "kelime" ? "Kelime" : "Kalıp"}</span>
            {bilemedik[k.anahtar] ? <span className="tur-etiket uyari">Tekrar</span> : null}
          </p>
          <div className="hk-kart">
            <p className="hk-soru" lang={trOnce ? "tr" : "en"}>
              {trOnce ? k.tr : k.en}
            </p>
            {!trOnce && <p className="kk-ok">{k.ok}</p>}
            {acik ? (
              <>
                <p className="hk-cevap" lang={trOnce ? "en" : "tr"}>
                  {trOnce ? k.en : k.tr}
                </p>
                {trOnce && k.ok && <p className="kk-ok">{k.ok}</p>}
                {k.ornek && (
                  <p className="hk-ornek">
                    <span lang="en">{k.ornek[0]}</span> <span className="not">{k.ornek[1]}</span>
                  </p>
                )}
                {k.ipucu && <p className="hk-ipucu">Akılda tut: {k.ipucu}</p>}
                <SesDugmesi metin={k.en} etiket="Tekrar dinle" />
                <p className="not">Doğru bildin mi? Dürüst ol, bunu kimse görmüyor.</p>
                <div className="dugmeler orta-yatay">
                  <button type="button" className="dugme bilemedim" onClick={() => notVer(false)}>
                    Bilemedim
                  </button>
                  <button type="button" className="dugme bildim" autoFocus onClick={() => notVer(true)}>
                    Bildim
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="not">{trOnce ? "İngilizcesini sesli söyle. Bilmiyorsan tahmin et." : "Türkçesini söyle."} Sonra cevaba bak.</p>
                <button
                  type="button"
                  className="dugme ana buyuk"
                  autoFocus
                  onClick={() => {
                    setAcik(true);
                    if (trOnce) konus(k.en);
                  }}
                >
                  Cevabı göster
                </button>
              </>
            )}
          </div>
          <div className="dugmeler">
            <button type="button" className="dugme sade kucuk" onClick={() => setDeste(null)}>
              Ara ver
            </button>
          </div>
        </>
      )}
    </section>
  );
}

/* ---------- 2. Dinleyerek çalış ---------- */

const bekle = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Dinleme({ acilan }: { acilan: string[] }) {
  const [ayar, setAyar] = useKalici<Suzgec & { basaDon: boolean }>("dinleme-ayar", { unite: "all", tur: "kelime", basaDon: false });
  const [calisiyor, setCalisiyor] = useState(false);
  const [simdi, setSimdi] = useState<{ i: number; n: number; k: Kart } | null>(null);
  const [bitti, setBitti] = useState(false);
  const [ses, setSes] = useState({ var: false, tr: false });
  const acikRef = useRef(false);
  const kilit = useRef<WakeLockSentinel | null>(null);
  const liste = havuz(ayar);

  useEffect(() => {
    const kontrol = () => setSes({ var: sesVar(), tr: trSesVar() });
    kontrol();
    if (sesVar()) speechSynthesis.addEventListener?.("voiceschanged", kontrol);
    return () => {
      acikRef.current = false;
      sustur();
      kilit.current?.release().catch(() => {});
      if (sesVar()) speechSynthesis.removeEventListener?.("voiceschanged", kontrol);
    };
  }, []);

  const durdur = () => {
    acikRef.current = false;
    setCalisiyor(false);
    sustur();
    kilit.current?.release().catch(() => {});
    kilit.current = null;
  };

  const baslat = async () => {
    if (!liste.length) return;
    acikRef.current = true;
    setCalisiyor(true);
    setBitti(false);
    try {
      kilit.current = (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      kilit.current = null;
    }
    const tr = trSesVar();
    let i = 0;
    while (acikRef.current) {
      if (i >= liste.length) {
        if (ayar.basaDon) i = 0;
        else {
          durdur();
          setSimdi(null);
          setBitti(true);
          return;
        }
      }
      const k = liste[i];
      setSimdi({ i, n: liste.length, k });
      await soyle(k.en, "en-US", 0.75);
      if (!acikRef.current) break;
      await bekle(1000);
      if (tr) await soyle(k.tr, "tr-TR", 1);
      else await bekle(1500);
      if (!acikRef.current) break;
      await bekle(700);
      await soyle(k.en, "en-US", 0.75);
      if (!acikRef.current) break;
      await bekle(2600); // sen tekrar et
      i++;
    }
  };

  return (
    <section className="calisma-blok yaprak" aria-labelledby="dn-baslik">
      <h2 id="dn-baslik">Dinleyerek çalış</h2>
      <p className="not">
        Önce İngilizcesi, sonra Türkçesi, sonra yine İngilizcesi okunur. Arada kalan boşlukta sen de sesli tekrar et. Yürürken, mutfakta, yolda dinleyebilirsin. Ekran açık kalır; telefonu
        kilitlersen ses durabilir.
      </p>
      {!ses.var && <p className="uyari-kutu">Bu tarayıcı sesli okumayı desteklemiyor. Telefonda Chrome ile açmayı dene.</p>}
      {ses.var && !ses.tr && <p className="not">Bu cihazda Türkçe ses yok. Türkçesi ekranda yazar, okunmaz.</p>}
      <div className="suzgecler">
        <UniteSecimi id="dn-u" deger={ayar.unite} degistir={(v) => setAyar({ ...ayar, unite: v })} acilan={acilan} />
        <label htmlFor="dn-t" className="alan">
          Ne dinleyeyim
          <select id="dn-t" value={ayar.tur} disabled={calisiyor} onChange={(e) => setAyar({ ...ayar, tur: e.target.value as Suzgec["tur"] })}>
            <option value="kelime">Kelimeler</option>
            <option value="kalip">Kalıplar</option>
            <option value="all">Kelime ve kalıp</option>
          </select>
        </label>
        <label className="alan yatay">
          <input type="checkbox" checked={ayar.basaDon} onChange={(e) => setAyar({ ...ayar, basaDon: e.target.checked })} /> Bitince başa dön
        </label>
      </div>
      <div className="dugmeler">
        <button type="button" className="dugme ana buyuk" onClick={calisiyor ? durdur : baslat} disabled={!ses.var || !liste.length}>
          {calisiyor ? "Durdur" : "Başlat"}
        </button>
      </div>
      <div className="dinleme-ekran" aria-live="polite">
        {simdi ? (
          <>
            <p className="not">
              {simdi.i + 1} / {simdi.n}
            </p>
            <p className="dn-en" lang="en">
              {simdi.k.en}
            </p>
            <p className="dn-tr">{simdi.k.tr}</p>
          </>
        ) : bitti ? (
          <p>Bitti. Bir tur daha için Başlat&apos;a bas.</p>
        ) : (
          <p className="not">{liste.length} öğe hazır. Başlat&apos;a bas, telefonu bırak, dinle ve sesli tekrar et.</p>
        )}
      </div>
    </section>
  );
}

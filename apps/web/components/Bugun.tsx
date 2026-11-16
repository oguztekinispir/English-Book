"use client";
/**
 * Öğrencinin "Bugün" kutusu: seri, günlük hedef, son 7 gün ve bugünün planı.
 * Seri ve sayılar sunucudan (cevaplar) gelir; tekrar kartı sayısı ve kaldığı ders tarayıcıdan okunur.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { A1_PLAN, UNITELER, type Ders, type Unite } from "@ti/icerik";
import { HEDEFLER, VARSAYILAN_HEDEF, type SeriBilgisi } from "@/lib/seri";
import { acilanlar, buluttanBirlestir, istatistik, YENI_OTURUM } from "@/lib/tekrar";
import { oku, yaz } from "@/lib/depo";
import { durumGuncelle } from "@/lib/kayit";

export interface BugunOdev {
  id: string;
  baslik: string;
  son_tarih: string | null;
}

interface Props {
  seri: SeriBilgisi;
  /** Veritabanındaki hedef (0006 göçü yoksa null) */
  hedef: number | null;
  /** Veritabanındaki seviye testi önerisi */
  seviye: { unite: number; tarih: string } | null;
  odevler: BugunOdev[];
}

const GUN_KISA = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

/** Ders sırasıyla bütün dersler */
const DERSLER: { u: Unite; d: Ders }[] = UNITELER.flatMap((u) => u.dersler.map((d) => ({ u, d })));

/** Kaldığı yer: en son sıradaki açılmış ders. Testi iyi bittiyse bir sonraki ders. */
function kaldigiDers(seviyeUnite: number | null): { u: Unite; d: Ders; durum: "yeni" | "devam" | "sonraki" } {
  const acik = new Set(acilanlar());
  const son = [...DERSLER].reverse().find((x) => acik.has(x.d.kod));
  if (!son) {
    const hedef = DERSLER.find((x) => x.u.sira === seviyeUnite) ?? DERSLER[0];
    return { ...hedef, durum: "yeni" };
  }
  const ilerleme = oku<{ test?: number }>(`ders:${son.d.kod}`, {});
  const n = son.d.test.length;
  if (ilerleme.test !== undefined && n && ilerleme.test >= n * 0.8) {
    const i = DERSLER.indexOf(son);
    if (DERSLER[i + 1]) return { ...DERSLER[i + 1], durum: "sonraki" };
  }
  return { ...son, durum: "devam" };
}

export function Bugun({ seri, hedef: dbHedef, seviye: dbSeviye, odevler }: Props) {
  const [hedef, setHedef] = useState(dbHedef ?? VARSAYILAN_HEDEF);
  const [hedefAcik, setHedefAcik] = useState(false);
  const [kart, setKart] = useState<number | null>(null);
  const [ders, setDers] = useState<ReturnType<typeof kaldigiDers> | null>(null);
  const [seviye, setSeviye] = useState(dbSeviye);

  useEffect(() => {
    // Tarayıcıdaki seviye testi sonucu: veritabanında yoksa oraya da yaz
    const yerel = oku<{ unite: number; puanlar: number[]; tarih: string } | null>("seviye", null);
    let sv = dbSeviye;
    if (yerel && (!dbSeviye || yerel.tarih > dbSeviye.tarih)) {
      sv = { unite: yerel.unite, tarih: yerel.tarih };
      durumGuncelle({ seviye_unite: yerel.unite, seviye_puanlar: yerel.puanlar, seviye_tarih: yerel.tarih });
    }
    setSeviye(sv);
    if (dbHedef === null) setHedef(oku("gunluk-hedef", VARSAYILAN_HEDEF));

    const hesapla = () => {
      const s = istatistik({ unite: "all", tur: "all" });
      setKart(s.vadesi + Math.min(s.yeni, YENI_OTURUM));
      setDers(kaldigiDers(sv?.unite ?? null));
    };
    hesapla();
    buluttanBirlestir().then((degisti) => degisti && hesapla());
  }, [dbHedef, dbSeviye]);

  const hedefSec = (n: number) => {
    setHedef(n);
    setHedefAcik(false);
    yaz("gunluk-hedef", n);
    durumGuncelle({ gunluk_hedef: n });
  };

  const oran = Math.min(1, seri.bugunAdet / hedef);
  const tamam = seri.bugunAdet >= hedef;
  const kalan = Math.max(0, hedef - seri.bugunAdet);
  const R = 34,
    C = 2 * Math.PI * R;

  const seriMetni = seri.bugunVar
    ? `${seri.seri} gündür aralıksız çalışıyorsun.`
    : seri.seri > 0
      ? `Serin ${seri.seri} gün. Bugün çalışırsan ${seri.seri + 1} olur.`
      : "Bugün başla, serin 1 gün olsun.";

  const plan = A1_PLAN.find((u) => u.sira === seviye?.unite);
  const dersHref = ders ? `/uniteler/${ders.u.kod}/${ders.d.no}` : "/uniteler";

  return (
    <section className="bugun yaprak" aria-labelledby="bugun-b">
      <div className="bugun-ust">
        <div className="bugun-hedef">
          <svg viewBox="0 0 80 80" className="halka" aria-hidden="true">
            <circle cx="40" cy="40" r={R} className="halka-iz" />
            <circle cx="40" cy="40" r={R} className={`halka-dolu${tamam ? " tamam" : ""}`} strokeDasharray={C} strokeDashoffset={C * (1 - oran)} />
          </svg>
          <div className="halka-yazi">
            <b>{seri.bugunAdet}</b>
            <span>/ {hedef}</span>
          </div>
        </div>
        <div className="bugun-metin">
          <h2 id="bugun-b">Bugün</h2>
          <p className="bugun-durum">
            {tamam ? <b>Günlük hedef tamam.</b> : seri.bugunAdet ? <>Hedefe {kalan} cevap kaldı.</> : <>Günlük hedefin {hedef} cevap.</>}{" "}
            <button type="button" className="metin-dugme" onClick={() => setHedefAcik((x) => !x)} aria-expanded={hedefAcik}>
              Hedefi değiştir
            </button>
          </p>
          <p className="bugun-seri">
            <svg viewBox="0 0 16 16" aria-hidden="true" className={`alev${seri.bugunVar ? " yanik" : ""}`}>
              <path d="M8 1c.5 2.6 3.5 4 3.5 7.5A3.5 3.5 0 0 1 8 15a3.5 3.5 0 0 1-3.5-3.5c0-1.6.8-2.6 1.6-3.4.2 1.2.9 1.9 1.6 2.1C7 8.3 7.2 5.4 8 1z" />
            </svg>
            <span>
              {seriMetni}
              {seri.enUzun > seri.seri && seri.enUzun > 1 && <span className="not"> En uzun serin: {seri.enUzun} gün.</span>}
            </span>
          </p>
        </div>
      </div>

      {hedefAcik && (
        <div className="hedef-sec" role="group" aria-label="Günlük hedef">
          {HEDEFLER.map((h) => (
            <button key={h.adet} type="button" className={`hedef-secenek${h.adet === hedef ? " secili" : ""}`} aria-pressed={h.adet === hedef} onClick={() => hedefSec(h.adet)}>
              <b>
                {h.ad}: {h.adet} cevap
              </b>
              <small>{h.aciklama}</small>
            </button>
          ))}
          <p className="not hedef-not">Hedef her gün çözdüğün kart, alıştırma ve test sorularını sayar. Pazar dinlenme günü: o gün çalışmazsan serin bozulmaz.</p>
        </div>
      )}

      <ol className="yedi" aria-label="Son 7 gün">
        {seri.son7.map((g, i) => {
          const gun = GUN_KISA[new Date(g.gun + "T12:00:00Z").getUTCDay()];
          const bugun = i === 6;
          return (
            <li key={g.gun} className={`${g.adet >= hedef ? "dolu" : g.adet ? "yari" : ""}${bugun ? " simdi" : ""}`}>
              <span className="nokta" aria-hidden="true" />
              <span>{bugun ? "Bugün" : gun}</span>
              <span className="gizli-etiket">{g.adet ? `${g.adet} cevap` : "çalışılmadı"}</span>
            </li>
          );
        })}
      </ol>

      <h3 className="plan-baslik">Bugünün planı</h3>
      <ol className="plan">
        {odevler.map((o) => (
          <li key={o.id} className="plan-oge odev">
            <div>
              <b>Ödev: {o.baslik}</b>
              {o.son_tarih && <small>Son gün {new Date(o.son_tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</small>}
            </div>
          </li>
        ))}
        <li className={`plan-oge${kart === 0 ? " bitti" : ""}`}>
          <div>
            <b>Günlük tekrar</b>
            <small>
              {kart === null
                ? "Kartlar hesaplanıyor…"
                : kart > 0
                  ? `${kart} kart seni bekliyor. Yaklaşık ${Math.max(2, Math.round(kart / 4))} dakika.`
                  : ders?.durum === "yeni"
                    ? "İlk dersi açınca kelimeler buraya gelir."
                    : "Bugünlük kart kalmadı."}
            </small>
          </div>
          {!!kart && (
            <Link href="/tekrar" className="dugme ana">
              Başla
            </Link>
          )}
        </li>
        <li className="plan-oge">
          <div>
            <b>{ders ? (ders.durum === "devam" ? "Kaldığın ders" : ders.durum === "sonraki" ? "Sıradaki ders" : "İlk dersin") : "Ders"}</b>
            <small>{ders ? `Ders ${ders.u.sira}.${ders.d.no}: ${ders.d.baslik}` : "…"}</small>
          </div>
          <Link href={dersHref} className={`dugme${kart ? "" : " ana"}`}>
            {ders?.durum === "devam" ? "Devam et" : "Başla"}
          </Link>
        </li>
        <li className="plan-oge kucuk">
          <div>
            <b>Seviye testi</b>
            <small>
              {seviye
                ? plan
                  ? `Önerilen başlangıç: Ünite ${plan.sira}, ${plan.baslik} (${new Date(seviye.tarih).toLocaleDateString("tr-TR")})`
                  : "A1 konularını biliyorsun."
                : "Hangi üniteden başlaman gerektiğini 5 dakikada öğren."}
            </small>
          </div>
          <Link href="/seviye-testi" className="dugme sade">
            {seviye ? "Yeniden çöz" : "Çöz"}
          </Link>
        </li>
      </ol>
    </section>
  );
}

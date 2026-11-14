"use client";
/**
 * Hikâye diyaloğu: dört adım.
 *  1 Dinle: metin kapalı.  2 Oku: okunan kelime yanar, kelimeye dokununca anlamı çıkar.
 *  3 Boşluklu: dersin anahtar kelimeleri gizli.  4 Rol yap: bir karakterin yerine sen konuşursun.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { acKisaltma, sozlukteBul, uniteSozlugu, UNITELER, type Ders, type Diyalog, type Unite } from "@ti/icerik";
import { lev, tokz } from "@ti/motor";
import { useKalici } from "@/lib/depo";
import { konus, sustur } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { Avatar } from "@/components/hikaye/Avatar";
import { SahneCizimi } from "@/components/hikaye/Sahne";

type Adim = "dinle" | "oku" | "bosluk" | "rol";
const ADIMLAR: { id: Adim; ad: string; aciklama: string }[] = [
  { id: "dinle", ad: "Dinle", aciklama: "Metin kapalı" },
  { id: "oku", ad: "Oku", aciklama: "Kelimeye dokun" },
  { id: "bosluk", ad: "Boşluklu", aciklama: "Eksik kelimeyi bul" },
  { id: "rol", ad: "Rol yap", aciklama: "Bir kişi sensin" },
];
const NOT: Record<Adim, string> = {
  dinle: "Önce sadece dinle. Kim konuşuyor, ne anlıyorsun? Gerekirse iki kez dinle, sonra Oku adımına geç.",
  oku: "Ses çalarken okunan kelime sarı yanar. Anlamadığın kelimeye dokun: anlamı üstte çıkar.",
  bosluk: "Önemli kelimeler gizlendi. Dinle ve boşluklara yaz, sonra Kontrol et'e bas.",
  rol: "Bir kişiyi seç. Diğer kişi konuşur; sıra sana gelince cevabını İngilizce söyle ya da yaz. Önce Türkçesini düşünmeden dene.",
};

const temiz = (w: string) => w.replace(/[.,!?;:"“”]/g, "");
const anahtarMi = (w: string, a: Set<string>) => a.has(temiz(w).toLowerCase());

/** Cevap kontrolü: kısaltmalar açılır, noktalama atılır, uzun kelimede 1 harf hata affedilir */
function benzer(cevap: string, dogru: string) {
  const a = tokz(acKisaltma(cevap)),
    b = tokz(acKisaltma(dogru));
  if (a.length !== b.length) return false;
  return a.every((w, i) => w === b[i] || (b[i].length > 3 && lev(w, b[i]) <= 1));
}

type Konusma = { start: () => void; stop: () => void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; lang: string; interimResults: boolean };
function tanimaVar(): (new () => Konusma) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Konusma; webkitSpeechRecognition?: new () => Konusma };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function DiyalogCalis({ u, d, x, kompakt = false }: { u: Unite; d: Ders; x: Diyalog; kompakt?: boolean }) {
  const [ilerleme, setIlerleme] = useKalici<Partial<Record<Adim, boolean>>>(`diyalog:${d.kod}:${x.baslik}`, {});
  const [adim, setAdim] = useState<Adim>("dinle");
  const [tr, setTr] = useState(false);
  const [calan, setCalan] = useState<{ satir: number; kelime: number } | null>(null);
  const [secili, setSecili] = useState<{ w: string; anlam: string } | null>(null);
  const durdu = useRef(true);
  const zaman = useRef<ReturnType<typeof setInterval> | null>(null);

  const anahtar = useMemo(() => new Set((x.anahtar ?? []).map((a) => a.toLowerCase())), [x.anahtar]);
  const kisiAd = (k?: string) => (k ? x.kisiler[k]?.ad ?? k : "");
  const kisiSes = (k?: string) => (k ? x.kisiler[k]?.ses : undefined);
  const satirlar = useMemo(() => x.satirlar.map((s) => ({ ...s, kelimeler: s.en.split(/\s+/) })), [x.satirlar]);

  // Kelime anlamları: önceki üniteler + bu derse kadarki kelimeler + bonus
  const anlamBul = useMemo(() => {
    const onceki = UNITELER.filter((v) => v.sira < u.sira);
    const sozluk = uniteSozlugu(u, onceki, d.no);
    const ozel = new Set([...onceki, u].flatMap((v) => v.ozelIsimler.map((y) => y.toLowerCase())));
    const bonus = new Map((x.bonus ?? []).map((b) => [b.en.toLowerCase(), b.tr]));
    const kisa = (t: string) => t.split(/[,;]/)[0].replace(/\s*\(.*?\)\s*/g, " ").trim() || t;
    return (w: string) => {
      const t = temiz(w);
      if (bonus.has(t.toLowerCase())) return `${bonus.get(t.toLowerCase())} (bonus kelime)`;
      if (ozel.has(t.toLowerCase().replace(/'s$/, ""))) return "özel isim";
      const parca = acKisaltma(t).split(" ");
      const anlam = parca.map((p) => sozlukteBul(sozluk, p)?.tr).map((a, i) => (a ? kisa(a) : parca[i]));
      return parca.length > 1 ? `${t} = ${acKisaltma(t)}: ${anlam.join(" + ")}` : anlam[0];
    };
  }, [u, d.no, x.bonus]);

  useEffect(
    () => () => {
      durdu.current = true;
      sustur();
      if (zaman.current) clearInterval(zaman.current);
    },
    [],
  );

  /** Bir satırı okur; okunan kelimeyi takip eder (tarayıcı söylerse onu, söylemezse tahmini) */
  const satirOku = (i: number, bitince: () => void) => {
    const s = satirlar[i];
    const ofset: number[] = [];
    s.kelimeler.reduce((o, w) => (ofset.push(o), o + w.length + 1), 0);
    let gercek = false;
    const bas = Date.now();
    const sure = s.en.length * 75; // yaklaşık
    if (zaman.current) clearInterval(zaman.current);
    setCalan({ satir: i, kelime: 0 });
    zaman.current = setInterval(() => {
      if (gercek) return;
      const oran = Math.min(0.999, (Date.now() - bas) / sure);
      const c = oran * s.en.length;
      setCalan({ satir: i, kelime: Math.max(0, ofset.filter((o) => o <= c).length - 1) });
    }, 90);
    konus(s.en, {
      kim: kisiSes(s.kim),
      kelime: (c) => {
        gercek = true;
        setCalan({ satir: i, kelime: Math.max(0, ofset.filter((o) => o <= c).length - 1) });
      },
      bitince: () => {
        if (zaman.current) clearInterval(zaman.current);
        bitince();
      },
    });
  };

  const hepsiniOku = (i = 0) => {
    if (durdu.current) return;
    if (i >= satirlar.length) {
      setCalan(null);
      durdu.current = true;
      if (adim === "dinle" || adim === "oku") setIlerleme((p) => ({ ...p, [adim]: true }));
      return;
    }
    satirOku(i, () => setTimeout(() => hepsiniOku(i + 1), 450));
  };
  const oynat = () => {
    durdu.current = false;
    hepsiniOku(0);
  };
  const durdur = () => {
    durdu.current = true;
    sustur();
    if (zaman.current) clearInterval(zaman.current);
    setCalan(null);
  };
  const adimSec = (a: Adim) => {
    durdur();
    setSecili(null);
    setAdim(a);
  };

  const yapilan = ADIMLAR.filter((a) => ilerleme[a.id]).length;

  return (
    <article className={`dyl yaprak${kompakt ? " kompakt" : ""}`}>
      {!kompakt && (
        <header className="dyl-sahne">
          <div className="dyl-cizim">
            <SahneCizimi yer={x.yer} />
          </div>
          <div className="dyl-sahne-metin">
            {x.bolum && <p className="dyl-bolum">Moda Apartmanı, bölüm {x.bolum}</p>}
            <h3>{x.baslik}</h3>
            <p>{x.sahne}</p>
            {x.onceki && <p className="dyl-onceki">Geçen bölümde: {x.onceki}</p>}
            <div className="dyl-kisiler">
              {Object.values(x.kisiler).map((k) => (
                <span key={k.ad}>
                  <Avatar ad={k.ad} boyut={28} />
                  {k.ad}
                </span>
              ))}
            </div>
          </div>
        </header>
      )}

      <nav className="dyl-adimlar" aria-label={`${x.baslik}: adımlar`}>
        {ADIMLAR.map((a, i) => (
          <button key={a.id} type="button" aria-pressed={adim === a.id} className={ilerleme[a.id] ? "bitti" : ""} onClick={() => adimSec(a.id)}>
            <b>
              <span className="dyl-no">{ilerleme[a.id] ? "✓" : `${i + 1}.`}</span> {a.ad}
            </b>
            <small>{a.aciklama}</small>
          </button>
        ))}
      </nav>

      <div className="dyl-govde">
        {adim !== "rol" && (
          <div className="dyl-arac">
            <div className="dugmeler">
              {calan ? (
                <button type="button" className="dugme ana" onClick={durdur}>
                  Durdur
                </button>
              ) : (
                <button type="button" className="dugme ana" onClick={oynat}>
                  {adim === "dinle" ? "Dinle" : "Baştan dinle"}
                </button>
              )}
              {adim !== "dinle" && (
                <button type="button" className={`dugme${tr ? " acik" : ""}`} aria-pressed={tr} onClick={() => setTr((v) => !v)}>
                  Türkçesi {tr ? "açık" : "kapalı"}
                </button>
              )}
            </div>
            <span className="dyl-sayac">{yapilan} / 4 adım</span>
          </div>
        )}
        <p className="not dyl-not">{NOT[adim]}</p>

        {adim === "oku" && (
          <p className={`dyl-anlam${secili ? " dolu" : ""}`} aria-live="polite">
            {secili ? (
              <>
                <b lang="en">{temiz(secili.w)}</b> {secili.anlam}
              </>
            ) : (
              "Bir kelimeye dokun, anlamı burada çıksın."
            )}
          </p>
        )}

        {adim === "rol" ? (
          <RolYap u={u} d={d} x={x} satirlar={satirlar} kisiAd={kisiAd} kisiSes={kisiSes} bitti={() => setIlerleme((p) => ({ ...p, rol: true }))} />
        ) : adim === "bosluk" ? (
          <Boslukla u={u} d={d} x={x} satirlar={satirlar} anahtar={anahtar} kisiAd={kisiAd} tr={tr} calan={calan} satirOku={(i) => satirOku(i, () => setCalan(null))} bitti={() => setIlerleme((p) => ({ ...p, bosluk: true }))} />
        ) : (
          <ol className="dyl-satirlar">
            {satirlar.map((s, i) => {
              const ad = kisiAd(s.kim);
              const sag = s.kim !== satirlar[0].kim;
              return (
                <li key={i} className={`dyl-satir${sag ? " sag" : ""}${calan?.satir === i ? " calan" : ""}`}>
                  <Avatar ad={ad} />
                  <div className="dyl-balon">
                    <span className="dyl-ad">{ad}</span>
                    {adim === "dinle" ? (
                      <span className="dyl-cubuklar" aria-label="Metin gizli">
                        {s.kelimeler.map((w, j) => (
                          <i key={j} style={{ width: Math.max(22, w.length * 10) }} className={calan?.satir === i && calan.kelime >= j ? "gecti" : ""} />
                        ))}
                      </span>
                    ) : (
                      <p className="dyl-en" lang="en">
                        {s.kelimeler.map((w, j) => (
                          <button
                            key={j}
                            type="button"
                            className={`dyl-k${calan?.satir === i && calan.kelime === j ? " yanan" : ""}${secili?.w === w ? " secili" : ""}`}
                            onClick={() => setSecili({ w, anlam: anlamBul(w) })}
                          >
                            {w}
                          </button>
                        ))}
                      </p>
                    )}
                    {tr && adim !== "dinle" && <p className="dyl-tr">{s.tr}</p>}
                  </div>
                  <button type="button" className="ses dyl-satir-ses" onClick={() => satirOku(i, () => setCalan(null))} aria-label="Bu satırı dinle">
                    <SesIkon />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
        {x.sorular?.length && (adim === "oku" || adim === "dinle") ? <Anladinmi key={x.baslik} u={u} d={d} x={x} /> : null}
        {x.bonus?.length ? (
          <p className="dyl-bonus">
            Bonus kelime:{" "}
            {x.bonus.map((b) => (
              <span key={b.en}>
                <b lang="en">{b.en}</b> = {b.tr}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function SesIkon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
      <path d="M10.5 5.2a3.8 3.8 0 0 1 0 5.6M12.4 3.4a6.3 6.3 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

type SatirK = Diyalog["satirlar"][number] & { kelimeler: string[] };

/* ---------- 3. Boşluklu ---------- */
function Boslukla({
  u,
  d,
  x,
  satirlar,
  anahtar,
  kisiAd,
  tr,
  calan,
  satirOku,
  bitti,
}: {
  u: Unite;
  d: Ders;
  x: Diyalog;
  satirlar: SatirK[];
  anahtar: Set<string>;
  kisiAd: (k?: string) => string;
  tr: boolean;
  calan: { satir: number; kelime: number } | null;
  satirOku: (i: number) => void;
  bitti: () => void;
}) {
  const [cev, setCev] = useState<Record<string, string>>({});
  const [kontrol, setKontrol] = useState(false);
  // Her anahtar kelime en fazla 2 kez, toplam en fazla 7 boşluk (sayfa boşluktan geçilmez olmasın)
  const bosluklar = useMemo(() => {
    const sayac = new Map<string, number>();
    const out: { k: string; w: string; i: number }[] = [];
    satirlar.forEach((s, i) =>
      s.kelimeler.forEach((w, j) => {
        if (!anahtarMi(w, anahtar) || out.length >= 7) return;
        const a = temiz(w).toLowerCase();
        if ((sayac.get(a) ?? 0) >= 2) return;
        sayac.set(a, (sayac.get(a) ?? 0) + 1);
        out.push({ k: `${i}-${j}`, w, i });
      }),
    );
    return out;
  }, [satirlar, anahtar]);
  const bosMu = new Set(bosluklar.map((b) => b.k));
  const dogruMu = (k: string, w: string) => (cev[k] ?? "").trim().toLowerCase() === temiz(w).toLowerCase();
  const dogruSay = bosluklar.filter((b) => dogruMu(b.k, b.w)).length;

  if (!bosluklar.length) return <p className="not">Bu diyalogda boşluk yok.</p>;
  return (
    <>
      <ol className="dyl-satirlar">
        {satirlar.map((s, i) => {
          const ad = kisiAd(s.kim);
          return (
            <li key={i} className={`dyl-satir${s.kim !== satirlar[0].kim ? " sag" : ""}${calan?.satir === i ? " calan" : ""}`}>
              <Avatar ad={ad} />
              <div className="dyl-balon">
                <span className="dyl-ad">{ad}</span>
                <p className="dyl-en" lang="en">
                  {s.kelimeler.map((w, j) => {
                    const k = `${i}-${j}`;
                    if (!bosMu.has(k))
                      return (
                        <span key={j} className="dyl-k duz">
                          {w}
                        </span>
                      );
                    const son = w.slice(temiz(w).length);
                    const durum = kontrol ? (dogruMu(k, w) ? " iyi" : " kotu") : "";
                    return (
                      <span key={j} className="dyl-bosluk-kap">
                        <input
                          className={`dyl-bosluk${durum}`}
                          aria-label={`Boşluk: ${ad} satırı`}
                          value={cev[k] ?? ""}
                          style={{ width: `${Math.max(3, temiz(w).length) + 1.5}ch` }}
                          autoCapitalize="off"
                          autoComplete="off"
                          spellCheck={false}
                          onChange={(e) => {
                            setKontrol(false);
                            setCev({ ...cev, [k]: e.target.value });
                          }}
                        />
                        {son}
                        {kontrol && !dogruMu(k, w) && <small className="dyl-dogrusu">{temiz(w)}</small>}
                      </span>
                    );
                  })}
                </p>
                {tr && <p className="dyl-tr">{s.tr}</p>}
              </div>
              <button type="button" className="ses dyl-satir-ses" onClick={() => satirOku(i)} aria-label="Bu satırı dinle">
                <SesIkon />
              </button>
            </li>
          );
        })}
      </ol>
      <div className="dugmeler">
        <button
          type="button"
          className="dugme ana"
          onClick={() => {
            setKontrol(true);
            bosluklar.forEach((b) => cevapKaydet({ kaynak: "alistirma", dogru: dogruMu(b.k, b.w), soru: `${x.baslik}: ${satirlar[b.i].en}`, cevap: cev[b.k] ?? "", beklenen: temiz(b.w), unite_id: u.id, ders: d.kod }));
            if (dogruSay === bosluklar.length) bitti();
          }}
        >
          Kontrol et
        </button>
        {kontrol && (
          <span className={`dyl-sonuc${dogruSay === bosluklar.length ? " iyi" : ""}`} role="status">
            {dogruSay} / {bosluklar.length} doğru{dogruSay === bosluklar.length ? ". Harika!" : ". Kırmızıları düzelt, tekrar kontrol et."}
          </span>
        )}
      </div>
    </>
  );
}

/* ---------- 4. Rol yap ---------- */
function RolYap({
  u,
  d,
  x,
  satirlar,
  kisiAd,
  kisiSes,
  bitti,
}: {
  u: Unite;
  d: Ders;
  x: Diyalog;
  satirlar: SatirK[];
  kisiAd: (k?: string) => string;
  kisiSes: (k?: string) => "kadin" | "erkek" | undefined;
  bitti: () => void;
}) {
  const kisiler = Object.keys(x.kisiler).filter((k) => satirlar.some((s) => s.kim === k));
  const [ben, setBen] = useState<string | null>(null);
  const [sira, setSira] = useState(0);
  const [yazi, setYazi] = useState("");
  const [sonuc, setSonuc] = useState<null | "dogru" | "yanlis" | "goster">(null);
  const [dinliyor, setDinliyor] = useState(false);
  // İlk ünitede Türkçe ipucu açık; sonra öğrenci isterse açar (Türkçeden çevirmeden cevap vermeye alışsın)
  const [ipucu, setIpucu] = useState(u.sira < 2);
  const [Tanima, setTanima] = useState<(new () => Konusma) | null>(null);
  const tanima = useRef<Konusma | null>(null);
  useEffect(() => setTanima(() => tanimaVar()), []);
  useEffect(() => () => tanima.current?.stop(), []);

  // Sıra karşıdakindeyse onun satırını oku ve ilerle
  useEffect(() => {
    if (!ben || sira >= satirlar.length) return;
    const s = satirlar[sira];
    if (s.kim === ben) return;
    let iptal = false;
    const t = setTimeout(() => konus(s.en, { kim: kisiSes(s.kim), bitince: () => !iptal && setTimeout(() => setSira((v) => v + 1), 300) }), 350);
    return () => {
      iptal = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ben, sira]);

  useEffect(() => {
    if (ben && sira >= satirlar.length) bitti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sira, ben]);

  if (!ben)
    return (
      <div className="rol-sec">
        <p>Kim olmak istersin?</p>
        <div className="dugmeler">
          {kisiler.map((k) => (
            <button
              key={k}
              type="button"
              className="dugme rol-kisi"
              onClick={() => {
                setBen(k);
                setSira(0);
              }}
            >
              <Avatar ad={kisiAd(k)} boyut={32} />
              {kisiAd(k)}
            </button>
          ))}
        </div>
      </div>
    );

  const simdiki = satirlar[sira];
  const benimSiram = simdiki && simdiki.kim === ben && sonuc !== "dogru" && sonuc !== "goster";

  const kontrolEt = (metin: string) => {
    const ok = benzer(metin, simdiki.en);
    setSonuc(ok ? "dogru" : "yanlis");
    cevapKaydet({ kaynak: "alistirma", dogru: ok, soru: `${x.baslik} (rol): ${simdiki.tr}`, cevap: metin, beklenen: simdiki.en, unite_id: u.id, ders: d.kod });
    if (ok) konus(simdiki.en, { kim: kisiSes(simdiki.kim) });
  };
  const devam = () => {
    setYazi("");
    setSonuc(null);
    setSira((v) => v + 1);
  };
  const soyle = () => {
    if (!Tanima) return;
    const r = new Tanima();
    tanima.current = r;
    r.lang = "en-US";
    r.interimResults = false;
    r.onresult = (e) => {
      const t = e.results[0]?.[0]?.transcript ?? "";
      setYazi(t);
      kontrolEt(t);
    };
    r.onend = () => setDinliyor(false);
    r.onerror = () => setDinliyor(false);
    setDinliyor(true);
    r.start();
  };

  return (
    <>
      <ol className="dyl-satirlar">
        {satirlar.slice(0, Math.min(sira + 1, satirlar.length)).map((s, i) => {
          const ad = kisiAd(s.kim);
          const benim = s.kim === ben;
          const simdi = i === sira;
          if (simdi && benimSiram)
            return (
              <li key={i} className={`dyl-satir rol-sira${s.kim !== satirlar[0].kim ? " sag" : ""}`}>
                <Avatar ad={ad} />
                <div className="dyl-balon">
                  <span className="dyl-ad">{ad} (sen)</span>
                  {ipucu ? (
                    <p className="rol-ipucu">İpucu: {s.tr}</p>
                  ) : (
                    <p className="rol-ipucu">
                      Sıra sende. Ne dersin?{" "}
                      <button type="button" className="rol-ipucu-ac" onClick={() => setIpucu(true)}>
                        Türkçe ipucu
                      </button>
                    </p>
                  )}
                  <form
                    className="rol-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (yazi.trim()) kontrolEt(yazi);
                    }}
                  >
                    <label className="gizli-etiket" htmlFor={`rol-${x.baslik}-${i}`}>
                      İngilizcesi
                    </label>
                    <input id={`rol-${x.baslik}-${i}`} value={yazi} onChange={(e) => (setYazi(e.target.value), setSonuc(null))} autoComplete="off" autoCapitalize="off" spellCheck={false} lang="en" placeholder="İngilizcesini yaz…" autoFocus />
                    <div className="dugmeler">
                      {Tanima && (
                        <button type="button" className={`dugme rol-mik${dinliyor ? " dinliyor" : ""}`} onClick={soyle} disabled={dinliyor}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <rect x="9" y="3" width="6" height="11" rx="3" />
                            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                          </svg>
                          {dinliyor ? "Dinliyorum…" : "Söyle"}
                        </button>
                      )}
                      <button type="submit" className="dugme ana" disabled={!yazi.trim()}>
                        Kontrol et
                      </button>
                      <button type="button" className="dugme sade" onClick={() => (setSonuc("goster"), konus(s.en, { kim: kisiSes(s.kim) }))}>
                        Göster
                      </button>
                    </div>
                  </form>
                  {sonuc === "yanlis" && <p className="rol-yanlis">Tam olmadı. Bir daha dene ya da Göster&apos;e bas.</p>}
                </div>
              </li>
            );
          return (
            <li key={i} className={`dyl-satir${s.kim !== satirlar[0].kim ? " sag" : ""}${benim ? " benim" : ""}`}>
              <Avatar ad={ad} />
              <div className="dyl-balon">
                <span className="dyl-ad">
                  {ad}
                  {benim && (simdi && sonuc === "goster" ? " (sen, doğrusu)" : " (sen)")}
                </span>
                <p className="dyl-en" lang="en">
                  {s.en}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      {simdiki && simdiki.kim === ben && (sonuc === "dogru" || sonuc === "goster") && (
        <div className="dugmeler">
          {sonuc === "dogru" && <span className="dyl-sonuc iyi">Doğru!</span>}
          <button type="button" className="dugme ana" onClick={devam} autoFocus>
            Devam
          </button>
        </div>
      )}
      {sira >= satirlar.length && (
        <div className="dugmeler">
          <span className="dyl-sonuc iyi">Diyalog bitti.</span>
          <button type="button" className="dugme" onClick={() => setSira(0)}>
            Tekrar oyna
          </button>
          <button type="button" className="dugme sade" onClick={() => setBen(null)}>
            Diğer kişi ol
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- Kısa diyaloglar ---------- */
export function MiniDiyaloglar({ u, d }: { u: Unite; d: Ders }) {
  const [acik, setAcik] = useState<string | null>(null);
  const liste = d.miniDiyaloglar ?? [];
  if (!liste.length) return null;
  return (
    <div className="mini-dyl">
      <div className="mini-dyl-ust">
        <h3>Aynı kalıp, başka sahne</h3>
        <p className="not">Kısa diyaloglar. Yeni kelime yok: aynı kelimeleri başka kişilerle, başka yerde duyarsın. Her biri bir dakika.</p>
      </div>
      <div className="mini-dyl-izgara">
        {liste.map((m) => (
          <MiniKart key={m.baslik} d={d} m={m} acik={acik === m.baslik} ac={() => setAcik(acik === m.baslik ? null : m.baslik)} />
        ))}
      </div>
      {acik && (
        <div className="mini-dyl-acik">
          <DiyalogCalis u={u} d={d} x={liste.find((m) => m.baslik === acik)!} kompakt />
        </div>
      )}
    </div>
  );
}

function MiniKart({ d, m, acik, ac }: { d: Ders; m: Diyalog; acik: boolean; ac: () => void }) {
  const [p] = useKalici<Partial<Record<Adim, boolean>>>(`diyalog:${d.kod}:${m.baslik}`, {});
  const n = Object.values(p).filter(Boolean).length;
  return (
    <article className={`mini-kart${acik ? " acik" : ""}`}>
      <p className={`mini-durum${n === 4 ? " bitti" : n ? " basladi" : ""}`}>{n === 4 ? "Bitti" : n ? `${n} / 4 adım` : "Başlamadın"}</p>
      <h4>{m.baslik}</h4>
      <p className="mini-sahne">{m.sahne}</p>
      <div className="mini-kisiler">
        {Object.values(m.kisiler).map((k) => (
          <Avatar key={k.ad} ad={k.ad} boyut={26} />
        ))}
      </div>
      <p className="mini-ilk" lang="en">
        “{m.satirlar[0].en}”
      </p>
      <button type="button" className={`dugme kucuk${acik ? " acik" : ""}`} aria-expanded={acik} onClick={ac}>
        {acik ? "Kapat" : "Çalış"}
      </button>
    </article>
  );
}

/* ---------- Anladın mı? (Türkçesiz) ---------- */
function Anladinmi({ u, d, x }: { u: Unite; d: Ders; x: Diyalog }) {
  const [cev, setCev] = useState<Record<number, boolean>>({});
  const sorular = x.sorular ?? [];
  return (
    <section className="dyl-anladin" aria-label="Anladın mı?">
      <h4>Anladın mı?</h4>
      <p className="not">Dinledikten sonra cevapla. Türkçeye çevirmeden, doğrudan İngilizce düşün.</p>
      <ol>
        {sorular.map((q, i) => {
          const c = cev[i];
          const bitti = c !== undefined;
          return (
            <li key={i} className={bitti ? (c === q.dogru ? "iyi" : "kotu") : ""}>
              <span lang="en">{q.en}</span>
              <span className="dyl-anladin-dugme">
                {[true, false].map((b) => (
                  <button
                    key={String(b)}
                    type="button"
                    lang="en"
                    className={`dugme kucuk${bitti && c === b ? " secildi" : ""}`}
                    disabled={bitti}
                    onClick={() => {
                      setCev({ ...cev, [i]: b });
                      cevapKaydet({ kaynak: "alistirma", dogru: b === q.dogru, soru: `${x.baslik}: ${q.en}`, cevap: b ? "True" : "False", beklenen: q.dogru ? "True" : "False", unite_id: u.id, ders: d.kod });
                    }}
                  >
                    {b ? "True" : "False"}
                  </button>
                ))}
                {bitti && <b className="dyl-anladin-sonuc">{c === q.dogru ? "✓" : `✗ ${q.dogru ? "True" : "False"}`}</b>}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

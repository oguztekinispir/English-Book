"use client";
import { useEffect, useMemo, useState } from "react";
import { uniteKelimeleri, type Bosluk, type Siralama, type Unite } from "@ti/icerik";
import { konus } from "@/lib/ses";
import { cevapKaydet } from "@/lib/kayit";
import { esit, useIlerleme, useKaristir } from "./ortak";

/* ---------------- Boşluk doldurma ---------------- */
export function BoslukDoldur({ u }: { u: Unite }) {
  const [, setIlerleme] = useIlerleme(u.kod);
  const [cev, setCev] = useState<Record<number, string>>({});
  const liste = u.alistirmalar.bosluk;
  const bitti = Object.keys(cev).length === liste.length;
  const dogru = liste.filter((b, i) => cev[i] === b.cevap).length;
  useEffect(() => {
    if (bitti) setIlerleme((p) => ({ ...p, bosluk: Math.max(p.bosluk ?? 0, dogru) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  return (
    <div className="alistirma yaprak">
      <h3>Boşluğu doldur</h3>
      <ol className="bosluk-liste">
        {liste.map((b, i) => (
          <BoslukSatir
            key={i}
            b={b}
            secim={cev[i]}
            sec={(s) => {
              setCev((x) => ({ ...x, [i]: s }));
              cevapKaydet({ kaynak: "alistirma", dogru: s === b.cevap, soru: b.cumle, cevap: s, beklenen: b.cevap, unite_id: u.id });
              if (s === b.cevap) konus(b.cumle.replace("___", b.cevap));
            }}
          />
        ))}
      </ol>
      <Sonuc bitti={bitti} dogru={dogru} toplam={liste.length} yenile={() => setCev({})} />
    </div>
  );
}

function BoslukSatir({ b, secim, sec }: { b: Bosluk; secim?: string; sec: (s: string) => void }) {
  const [on, son] = b.cumle.split("___");
  const ok = secim === b.cevap;
  return (
    <li className={secim ? (ok ? "iyi" : "kotu") : ""}>
      <p className="bosluk-cumle" lang="en">
        {on}
        <span className={`bosluk${secim ? " dolu" : ""}`}>{secim ? b.cevap : "____"}</span>
        {son}
      </p>
      <div className="dugmeler">
        {b.secenekler.map((s) => (
          <button key={s} type="button" className={`dugme kucuk${secim === s ? " secildi" : ""}`} disabled={!!secim} onClick={() => sec(s)}>
            {s}
          </button>
        ))}
      </div>
      <small className="not">
        {b.tr}
        {secim && !ok && <> Sen “{secim}” dedin.</>}
      </small>
    </li>
  );
}

/* ---------------- Kelimeleri sıraya koy ---------------- */
export function SiraylaKur({ u }: { u: Unite }) {
  const [, setIlerleme] = useIlerleme(u.kod);
  const liste = u.alistirmalar.siralama;
  const [i, setI] = useState(0);
  const [puan, setPuan] = useState(0);
  const bitti = i >= liste.length;
  useEffect(() => {
    if (bitti) setIlerleme((p) => ({ ...p, siralama: Math.max(p.siralama ?? 0, puan) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  return (
    <div className="alistirma yaprak">
      <h3>Kelimeleri sıraya koy</h3>
      {bitti ? (
        <Sonuc
          bitti
          dogru={puan}
          toplam={liste.length}
          yenile={() => {
            setI(0);
            setPuan(0);
          }}
        />
      ) : (
        <SiraSoru
          key={i}
          s={liste[i]}
          no={`${i + 1} / ${liste.length}`}
          bitir={(ok, cevap) => {
            if (ok) setPuan((p) => p + 1);
            cevapKaydet({ kaynak: "alistirma", dogru: ok, soru: liste[i].tr, cevap, beklenen: liste[i].cevap, unite_id: u.id });
          }}
          sonraki={() => setI((x) => x + 1)}
        />
      )}
    </div>
  );
}

function SiraSoru({ s, no, bitir, sonraki }: { s: Siralama; no: string; bitir: (ok: boolean, cevap: string) => void; sonraki: () => void }) {
  const noktalama = s.cevap.match(/[.?!]$/)?.[0] ?? "";
  const sirali = useMemo(() => s.cevap.replace(/[.?!]$/, "").split(" ").map((w, i) => ({ w, i })), [s]);
  const kelimeler = useKaristir(sirali, s);
  const [secilen, setSecilen] = useState<number[]>([]);
  const [sonuc, setSonuc] = useState<boolean | null>(null);
  const kurulan = secilen.map((i) => kelimeler.find((k) => k.i === i)!.w).join(" ");

  const kontrol = () => {
    const ok = esit(kurulan, s.cevap);
    setSonuc(ok);
    bitir(ok, kurulan);
    if (ok) konus(s.cevap);
  };

  return (
    <div className="sira-soru">
      <p className="not">{no}</p>
      <p className="sira-tr">{s.tr}</p>
      <div className={`kurulan${sonuc === null ? "" : sonuc ? " iyi" : " kotu"}`} aria-live="polite">
        {secilen.length ? (
          secilen.map((i) => {
            const k = kelimeler.find((x) => x.i === i)!;
            return (
              <button key={i} type="button" className="cip secili" disabled={sonuc !== null} onClick={() => setSecilen((x) => x.filter((y) => y !== i))}>
                {k.w}
              </button>
            );
          })
        ) : (
          <span className="not">Aşağıdaki kelimelere doğru sırayla dokun.</span>
        )}
        {secilen.length === kelimeler.length && <span className="nokta">{noktalama}</span>}
      </div>
      <div className="havuz">
        {kelimeler.map((k) => (
          <button key={k.i} type="button" className="cip" disabled={secilen.includes(k.i) || sonuc !== null} onClick={() => setSecilen((x) => [...x, k.i])}>
            {k.w}
          </button>
        ))}
      </div>
      {sonuc === null ? (
        <div className="dugmeler">
          <button type="button" className="dugme ana" disabled={secilen.length !== kelimeler.length} onClick={kontrol}>
            Kontrol et
          </button>
          <button type="button" className="dugme sade" disabled={!secilen.length} onClick={() => setSecilen([])}>
            Temizle
          </button>
        </div>
      ) : (
        <div className="dugmeler">
          {!sonuc && (
            <p className="form-hata">
              Doğrusu: <b lang="en">{s.cevap}</b>
            </p>
          )}
          <button type="button" className="dugme ana" autoFocus onClick={sonraki}>
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Eşleştir ---------------- */
export function Eslestir({ u }: { u: Unite }) {
  const [, setIlerleme] = useIlerleme(u.kod);
  const [tur, setTur] = useState(0);
  const tum = useMemo(() => uniteKelimeleri(u), [u]);
  const karisik = useKaristir(tum, tur);
  const kelimeler = useMemo(() => karisik.slice(0, 6), [karisik]);
  const sag = useKaristir(kelimeler, kelimeler);
  const [solSecili, setSolSecili] = useState<string | null>(null);
  const [eslesen, setEslesen] = useState<string[]>([]);
  const [yanlis, setYanlis] = useState<string | null>(null);
  const bitti = eslesen.length === kelimeler.length;
  useEffect(() => {
    if (bitti) setIlerleme((p) => ({ ...p, eslestirme: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  const sagSec = (en: string) => {
    if (!solSecili) return;
    const ok = solSecili === en;
    cevapKaydet({ kaynak: "oyun", dogru: ok, soru: solSecili, cevap: kelimeler.find((k) => k.en === en)?.tr, beklenen: kelimeler.find((k) => k.en === solSecili)?.tr, unite_id: u.id });
    if (ok) {
      setEslesen((x) => [...x, en]);
      setSolSecili(null);
    } else {
      setYanlis(en);
      setTimeout(() => setYanlis(null), 600);
    }
  };

  return (
    <div className="alistirma yaprak">
      <h3>Eşleştir</h3>
      <p className="not">Soldan bir kelime seç, sağdan Türkçesini bul.</p>
      <div className="eslestir">
        <div>
          {kelimeler.map((k) => (
            <button
              key={k.en}
              type="button"
              lang="en"
              className={`cip genis${solSecili === k.en ? " secili" : ""}${eslesen.includes(k.en) ? " tamam" : ""}`}
              disabled={eslesen.includes(k.en)}
              onClick={() => {
                setSolSecili(k.en);
                konus(k.en);
              }}
            >
              {k.en}
            </button>
          ))}
        </div>
        <div>
          {sag.map((k) => (
            <button
              key={k.en}
              type="button"
              className={`cip genis${eslesen.includes(k.en) ? " tamam" : ""}${yanlis === k.en ? " sallan" : ""}`}
              disabled={eslesen.includes(k.en)}
              onClick={() => sagSec(k.en)}
            >
              {k.tr.split(";")[0].trim()}
            </button>
          ))}
        </div>
      </div>
      {bitti && (
        <div className="dugmeler">
          <p className="form-bilgi">Hepsi eşleşti.</p>
          <button
            type="button"
            className="dugme ana"
            onClick={() => {
              setEslesen([]);
              setSolSecili(null);
              setTur((t) => t + 1);
            }}
          >
            Yeni kelimeler
          </button>
        </div>
      )}
    </div>
  );
}

function Sonuc({ bitti, dogru, toplam, yenile }: { bitti: boolean; dogru: number; toplam: number; yenile: () => void }) {
  if (!bitti) return null;
  return (
    <div className="dugmeler">
      <p className={dogru === toplam ? "form-bilgi" : "form-hata"}>
        {toplam} sorudan {dogru} doğru.{dogru === toplam ? " Tamamı doğru." : " Yanlışlara bakıp bir daha dene."}
      </p>
      <button type="button" className="dugme" onClick={yenile}>
        Bir daha
      </button>
    </div>
  );
}

"use client";
/**
 * Okuma / yazma dersi: hazırlık → metin → görevler → (okuma) konuşma / (yazma) kendi metnin.
 * Kelimeye dokununca Türkçesi alttaki çubukta çıkar. Metnin tam çevirisi görevlerden sonra açılır.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UNITELER, uniteSozlugu, sozlukteBul, type BeceriDersi as Ders, type BosluklaCumle, type DogruYanlis as DY, type MetinBlok } from "@ti/icerik";
import { konus, sesVar } from "@/lib/ses";
import { cevapKaydet, yaziKaydet } from "@/lib/kayit";
import { oku, yaz } from "@/lib/depo";
import { useKarisik } from "@/lib/karistir";
import { supabaseTarayici } from "@/lib/supabase/istemci";

export const beceriAnahtari = (kod: string) => `beceri:${kod}`;
export interface BeceriKaydi {
  bitti?: boolean;
  puan?: number;
  toplam?: number;
}


/* ---------------- metin ve dokununca anlam ---------------- */

/** Ders sözlüğü + bütün ünitelerin kelimeleri */
function useSozluk(d: Ders) {
  return useMemo(() => {
    const son = UNITELER[UNITELER.length - 1];
    const genel = uniteSozlugu(son, UNITELER.slice(0, -1));
    const ozel = new Map<string, string>();
    for (const h of d.hazirlik) ozel.set(h.en.toLowerCase(), h.tr);
    for (const [k, v] of Object.entries(d.sozluk)) ozel.set(k.toLowerCase(), v);
    return (w: string): string | undefined => {
      const k = w.toLowerCase().replace(/['’]s$/, "");
      return ozel.get(k) ?? (k.endsWith("s") ? ozel.get(k.slice(0, -1)) : undefined) ?? sozlukteBul(genel, k)?.tr;
    };
  }, [d]);
}

/** Cümleyi dokunulabilir kelimelere böler */
function Dokun({ t, bak }: { t: string; bak: (w: string) => void }) {
  return (
    <>
      {t.split(/(\s+)/).map((p, i) => {
        const w = p.replace(/^[^\p{L}']+|[^\p{L}']+$/gu, "");
        if (!w || /^\s+$/.test(p)) return <span key={i}>{p}</span>;
        const [on, son] = p.split(w);
        return (
          <span key={i} className="dokun-sar">
            {on}
            <button type="button" className="dokun" onClick={() => bak(w)}>
              {w}
            </button>
            {son}
          </span>
        );
      })}
    </>
  );
}

function MetinGorunum({ m, bak }: { m: MetinBlok; bak: (w: string) => void }) {
  const D = (t: string) => <Dokun t={t} bak={bak} />;
  switch (m.tip) {
    case "afis":
      return (
        <div className="mt-afis" lang="en">
          <h3>{D(m.baslik)}</h3>
          <p className="mt-afis-giris">{D(m.giris)}</p>
          <dl>
            {m.satirlar.map((s) => (
              <div key={s.etiket}>
                <dt>{D(s.etiket)}</dt>
                <dd>{D(s.deger)}</dd>
              </div>
            ))}
          </dl>
          {m.kapanis && <p className="mt-afis-kapanis">{D(m.kapanis)}</p>}
        </div>
      );
    case "mesajlar":
      return (
        <div className="mt-telefon" lang="en">
          <p className="mt-telefon-ust">{Object.values(m.kisiler).filter((k) => k !== m.ben).join(", ") || "Mesajlar"}</p>
          {m.satirlar.map((s, i) => {
            const ben = m.kisiler[s.kim] === m.ben;
            return (
              <div key={i} className={`mt-balon${ben ? " ben" : ""}`}>
                {!ben && <b className="mt-kim">{m.kisiler[s.kim]}</b>}
                <span>{D(s.en)}</span>
                <small>{s.saat}</small>
              </div>
            );
          })}
        </div>
      );
    case "eposta":
      return (
        <div className="mt-eposta" lang="en">
          <p>
            <b>From:</b> {m.kimden}
          </p>
          <p>
            <b>To:</b> {m.kime}
          </p>
          <p>
            <b>Subject:</b> {D(m.konu)}
          </p>
          <hr />
          {m.govde.map((g, i) => (
            <p key={i}>{D(g)}</p>
          ))}
        </div>
      );
    case "form":
      return (
        <div className="mt-form" lang="en">
          <h3>{D(m.baslik)}</h3>
          {m.alanlar.map((a) => (
            <div key={a.etiket} className="mt-form-satir">
              <span className="mt-form-etiket">{D(a.etiket)}</span>
              <span className="mt-form-deger">{a.deger}</span>
            </div>
          ))}
        </div>
      );
    case "kartvizit":
      return (
        <div className="mt-kartlar" lang="en">
          {m.kartlar.map((k) => (
            <div key={k.ad} className="mt-kart">
              <b className="mt-kart-ad">{k.ad}</b>
              {k.meslek && <span className="mt-kart-meslek">{D(k.meslek)}</span>}
              {k.yer && <span className="mt-kart-yer">{D(k.yer)}</span>}
              {k.satirlar.map((s) => (
                <small key={s}>{D(s)}</small>
              ))}
            </div>
          ))}
        </div>
      );
    case "gonderi":
      return (
        <div className="mt-gonderi" lang="en">
          <p className="mt-gonderi-ust">
            <span className="mt-avatar" aria-hidden="true">
              {m.yazar[0]}
            </span>
            <b>{m.yazar}</b> <small>{m.zaman}</small>
          </p>
          {m.govde.map((g, i) => (
            <p key={i}>{D(g)}</p>
          ))}
        </div>
      );
  }
}

/** Metni sesli okumak için düz yazı */
function duzMetin(m: MetinBlok): string {
  switch (m.tip) {
    case "afis":
      return [m.baslik, m.giris, ...m.satirlar.map((s) => `${s.etiket} ${s.deger}`), m.kapanis ?? ""].join(". ");
    case "mesajlar":
      return m.satirlar.map((s) => s.en).join(" ");
    case "eposta":
      return [m.konu, ...m.govde].join(" ");
    case "form":
      return m.alanlar.map((a) => `${a.etiket}: ${a.deger}`).join(". ");
    case "kartvizit":
      return m.kartlar.map((k) => [k.ad, k.meslek, k.yer].filter(Boolean).join(", ")).join(". ");
    case "gonderi":
      return m.govde.join(" ");
  }
}

/* ---------------- görevler ---------------- */

function Eslestir({ d, bitince }: { d: Ders; bitince: () => void }) {
  const solda = useKarisik(d.hazirlik, d.kod + "sol");
  const sagda = useKarisik(d.hazirlik, d.kod + "sag");
  const [secili, setSecili] = useState<string | null>(null);
  const [eslesen, setEslesen] = useState<Set<string>>(new Set());
  const [hata, setHata] = useState<string | null>(null);
  const tamam = eslesen.size === d.hazirlik.length;

  const sagSec = (en: string) => {
    if (!secili) return;
    if (secili === en) {
      const y = new Set(eslesen).add(en);
      setEslesen(y);
      setSecili(null);
      if (y.size === d.hazirlik.length) bitince();
    } else {
      setHata(en);
      setTimeout(() => setHata(null), 600);
    }
  };

  return (
    <div className="esles">
      <p className="not">Soldan bir İngilizce kelime, sağdan Türkçesini seç.</p>
      <div className="esles-sutunlar">
        <div className="esles-sutun" lang="en">
          {solda.map((h) => (
            <button
              key={h.en}
              type="button"
              className={`esles-kutu${secili === h.en ? " secili" : ""}${eslesen.has(h.en) ? " tamam" : ""}`}
              disabled={eslesen.has(h.en)}
              aria-pressed={secili === h.en}
              onClick={() => {
                setSecili(h.en);
                if (sesVar()) konus(h.en);
              }}
            >
              {h.en}
            </button>
          ))}
        </div>
        <div className="esles-sutun">
          {sagda.map((h) => (
            <button
              key={h.en}
              type="button"
              className={`esles-kutu${eslesen.has(h.en) ? " tamam" : ""}${hata === h.en ? " sallan" : ""}`}
              disabled={eslesen.has(h.en) || !secili}
              onClick={() => sagSec(h.en)}
            >
              {h.tr}
            </button>
          ))}
        </div>
      </div>
      {tamam && <p className="gorev-tamam">Hepsi doğru. Şimdi metni oku.</p>}
    </div>
  );
}

function BoslukBankasi({ sorular, etiket, bitince }: { sorular: BosluklaCumle[]; etiket: string; bitince: (p: number) => void }) {
  const banka = useKarisik(useMemo(() => sorular.map((s) => s.cevap), [sorular]), etiket);
  const [yer, setYer] = useState<(string | null)[]>(() => sorular.map(() => null));
  const [aktif, setAktif] = useState(0);
  const [kontrol, setKontrol] = useState(false);
  const kullanilan = new Set(yer.filter(Boolean) as string[]);

  const koy = (w: string) => {
    if (kontrol) return;
    const y = [...yer];
    y[aktif] = w;
    setYer(y);
    const sonraki = y.findIndex((x, i) => !x && i !== aktif);
    if (sonraki >= 0) setAktif(sonraki);
  };
  const bitir = () => {
    setKontrol(true);
    let p = 0;
    sorular.forEach((s, i) => {
      const ok = yer[i] === s.cevap;
      if (ok) p++;
      cevapKaydet({ kaynak: "alistirma", kural: etiket, dogru: ok, soru: s.en, cevap: yer[i] ?? "", beklenen: s.cevap });
    });
    bitince(p);
  };

  return (
    <div className="bb">
      <p className="not">Önce bir boşluğa dokun, sonra aşağıdan kelimeyi seç.</p>
      <ol className="bb-cumleler" lang="en">
        {sorular.map((s, i) => {
          const [a, b] = s.en.split("___");
          const ok = kontrol && yer[i] === s.cevap;
          return (
            <li key={i}>
              {a}
              <button
                type="button"
                className={`bb-bosluk${aktif === i && !kontrol ? " aktif" : ""}${kontrol ? (ok ? " dogru" : " yanlis") : ""}`}
                onClick={() => (kontrol ? null : yer[i] ? (setYer(yer.map((x, j) => (j === i ? null : x))), setAktif(i)) : setAktif(i))}
                aria-label={yer[i] ? `${i + 1}. boşluk: ${yer[i]}. Kaldırmak için dokun.` : `${i + 1}. boşluk, boş`}
              >
                {yer[i] ?? "   "}
              </button>
              {b}
              {kontrol && !ok && <span className="bb-dogrusu"> → {s.cevap}</span>}
            </li>
          );
        })}
      </ol>
      <div className="bb-banka" lang="en">
        {banka.map((w) => (
          <button key={w} type="button" className="bb-kelime" disabled={kullanilan.has(w) || kontrol} onClick={() => koy(w)}>
            {w}
          </button>
        ))}
      </div>
      {!kontrol ? (
        <button type="button" className="dugme ana" disabled={yer.some((x) => !x)} onClick={bitir}>
          Kontrol et
        </button>
      ) : (
        <p className="gorev-tamam">
          {sorular.filter((s, i) => yer[i] === s.cevap).length} / {sorular.length} doğru.
        </p>
      )}
    </div>
  );
}

function DogruYanlisListe({ sorular, etiket, bitince }: { sorular: DY[]; etiket: string; bitince: (p: number) => void }) {
  const [cevap, setCevap] = useState<(boolean | null)[]>(() => sorular.map(() => null));
  const sec = (i: number, v: boolean) => {
    if (cevap[i] !== null) return;
    const y = [...cevap];
    y[i] = v;
    setCevap(y);
    cevapKaydet({ kaynak: "alistirma", kural: etiket, dogru: v === sorular[i].dogru, soru: sorular[i].en, cevap: v ? "True" : "False", beklenen: sorular[i].dogru ? "True" : "False" });
    if (y.every((x) => x !== null)) bitince(y.filter((x, j) => x === sorular[j].dogru).length);
  };
  return (
    <ol className="dy">
      {sorular.map((s, i) => {
        const c = cevap[i];
        const ok = c !== null && c === s.dogru;
        return (
          <li key={i} className={c === null ? "" : ok ? "dogru" : "yanlis"}>
            <span lang="en">{s.en}</span>
            <span className="dy-dugmeler">
              {[true, false].map((v) => (
                <button key={String(v)} type="button" className={`secenek-dugme${c === v ? " secili" : ""}`} disabled={c !== null} onClick={() => sec(i, v)}>
                  {v ? "True" : "False"}
                </button>
              ))}
            </span>
            {c !== null && (
              <span className="dy-aciklama">
                {ok ? "Doğru. " : `Doğrusu: ${s.dogru ? "True" : "False"}. `}
                {s.aciklama}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Siralama({ dogruSira, etiket, bitince }: { dogruSira: string[]; etiket: string; bitince: (ok: boolean) => void }) {
  const karisik = useKarisik(dogruSira, etiket, (k) => dogruSira.length < 2 || k.join() !== dogruSira.join());
  const [sira, setSira] = useState(dogruSira);
  useEffect(() => setSira(karisik), [karisik]);
  const [sonuc, setSonuc] = useState<boolean | null>(null);
  const tasi = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= sira.length || sonuc) return;
    const y = [...sira];
    [y[i], y[j]] = [y[j], y[i]];
    setSira(y);
  };
  return (
    <div className="sira">
      <p className="not">Parçaları okları kullanarak doğru sıraya koy.</p>
      <ol className="sira-liste" lang="en">
        {sira.map((p, i) => (
          <li key={p} className={sonuc === null ? "" : p === dogruSira[i] ? "dogru" : "yanlis"}>
            <span>{p}</span>
            <span className="sira-oklar">
              <button type="button" className="dugme sade kucuk" onClick={() => tasi(i, -1)} disabled={i === 0 || sonuc !== null} aria-label="Yukarı taşı">
                ↑
              </button>
              <button type="button" className="dugme sade kucuk" onClick={() => tasi(i, 1)} disabled={i === sira.length - 1 || sonuc !== null} aria-label="Aşağı taşı">
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      {sonuc === null ? (
        <button
          type="button"
          className="dugme ana"
          onClick={() => {
            const ok = sira.every((p, i) => p === dogruSira[i]);
            setSonuc(ok);
            cevapKaydet({ kaynak: "alistirma", kural: etiket, dogru: ok, soru: "sıralama", cevap: sira.join(" | "), beklenen: dogruSira.join(" | ") });
            bitince(ok);
          }}
        >
          Kontrol et
        </button>
      ) : (
        <p className="gorev-tamam">{sonuc ? "Sıra doğru." : "Kırmızı parçaların yeri yanlış. Doğru sıra yeşil olanların yerinde; tekrar okuyup karşılaştır."}</p>
      )}
    </div>
  );
}

/* ---------------- kendi metnin ---------------- */

function YazGorevi({ d }: { d: Extract<Ders, { tur: "yazma" }> }) {
  const y = d.yaz;
  const [metin, setMetin] = useState(() => oku<string>(`taslak:${d.kod}`, ""));
  const [alanlar, setAlanlar] = useState<string[]>(() => oku<string[]>(`taslak-form:${d.kod}`, y.alanlar?.map(() => "") ?? []));
  const [isaret, setIsaret] = useState<boolean[]>(() => y.kontrol.map(() => false));
  const [durum, setDurum] = useState<"" | "gonder" | "tamam" | "yerel">("");
  const form = !!y.alanlar?.length;
  const kelime = metin.trim() ? metin.trim().split(/\s+/).length : 0;
  const hazir = form ? alanlar.every((a) => a.trim()) : kelime >= y.enAz;

  const [onceki, setOnceki] = useState<{ id: string; metin: string; olusturma: string; ogretmen_notu: string | null }[]>([]);
  useEffect(() => {
    // Önceki gönderiler ve öğretmen notları (girişli ve 0008 göçü varsa)
    supabaseTarayici()
      .from("yazilar")
      .select("id, metin, olusturma, ogretmen_notu")
      .eq("ders", d.kod)
      .order("olusturma", { ascending: false })
      .limit(3)
      .then(({ data, error }) => !error && data && setOnceki(data));
  }, [d.kod, durum]);
  useEffect(() => yaz(`taslak:${d.kod}`, metin), [d.kod, metin]);
  useEffect(() => yaz(`taslak-form:${d.kod}`, alanlar), [d.kod, alanlar]);

  const gonder = async () => {
    setDurum("gonder");
    const govde = form ? y.alanlar!.map((a, i) => `${a.etiket}: ${alanlar[i].trim()}`).join("\n") : metin.trim();
    const ok = await yaziKaydet(d.kod, govde);
    yaz(beceriAnahtari(d.kod), { ...oku<BeceriKaydi>(beceriAnahtari(d.kod), {}), bitti: true });
    setDurum(ok ? "tamam" : "yerel");
  };

  return (
    <div className="yaz">
      {onceki.length > 0 && (
        <details className="yaz-onceki" open={onceki.some((o) => o.ogretmen_notu)}>
          <summary>Önceki gönderilerin ({onceki.length})</summary>
          {onceki.map((o) => (
            <div key={o.id} className="yaz-onceki-kayit">
              <p className="yazi-metin" lang="en">
                {o.metin}
              </p>
              {o.ogretmen_notu ? <p className="yaz-ogretmen">Öğretmeninin notu: {o.ogretmen_notu}</p> : <p className="not">Öğretmen notu henüz yok.</p>}
            </div>
          ))}
        </details>
      )}
      <p className="yaz-durum">{y.durum}</p>
      <div className="yaz-kaliplar" lang="en">
        <span className="not">İşine yarayacak kalıplar{form ? "" : " (dokununca metne eklenir)"}:</span>
        {y.kaliplar.map((k) => (
          <button key={k} type="button" className="bb-kelime" disabled={form || durum === "tamam"} onClick={() => setMetin((m) => (m && !/\s$/.test(m) ? m + " " : m) + k)}>
            {k}
          </button>
        ))}
      </div>
      {form ? (
        <div className="yaz-form">
          {y.alanlar!.map((a, i) => (
            <label key={a.etiket}>
              <span lang="en">{a.etiket}</span>
              <input
                value={alanlar[i]}
                placeholder={a.ipucu}
                lang="en"
                maxLength={200}
                disabled={durum === "tamam"}
                onChange={(e) => setAlanlar(alanlar.map((x, j) => (j === i ? e.target.value : x)))}
              />
            </label>
          ))}
        </div>
      ) : (
        <>
          <label className="gizli-etiket" htmlFor="yaz-metin">
            Metnin
          </label>
          <textarea
            id="yaz-metin"
            lang="en"
            rows={7}
            maxLength={3000}
            value={metin}
            disabled={durum === "tamam"}
            onChange={(e) => setMetin(e.target.value)}
            placeholder="İngilizce yaz…"
            spellCheck={false}
          />
          <p className={`not yaz-sayac${kelime >= y.enAz ? " tamam" : ""}`}>
            {kelime} kelime{y.enAz ? ` (en az ${y.enAz})` : ""}
          </p>
        </>
      )}
      <fieldset className="yaz-kontrol">
        <legend>Göndermeden önce kontrol et</legend>
        {y.kontrol.map((k, i) => (
          <label key={k}>
            <input type="checkbox" checked={isaret[i]} onChange={() => setIsaret(isaret.map((x, j) => (j === i ? !x : x)))} /> {k}
          </label>
        ))}
      </fieldset>
      {durum !== "tamam" && durum !== "yerel" ? (
        <button type="button" className="dugme ana buyuk" disabled={!hazir || durum === "gonder"} onClick={gonder}>
          Gönder
        </button>
      ) : (
        <div className="yaz-sonuc" role="status">
          <p>
            <b>{durum === "tamam" ? "Gönderildi." : "Kaydedildi."}</b>{" "}
            {durum === "tamam" ? "Bağlı bir öğretmenin varsa yazdığını görecek ve not bırakabilecek." : "Bu cihazda kaydedildi; öğretmenine ulaşmadı."}
          </p>
          <p className="not">Bir örnek cevap, kendi metninle karşılaştır:</p>
          <p className="yaz-ornek" lang="en">
            {y.ornekCevap}
          </p>
          <button type="button" className="dugme sade kucuk" onClick={() => setDurum("")}>
            Düzeltip yeniden gönder
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- ders ---------------- */

export function BeceriDersi({ d }: { d: Ders }) {
  const bul = useSozluk(d);
  const [kelime, setKelime] = useState<{ w: string; tr?: string } | null>(null);
  const [ses, setSes] = useState(false);
  const [, setPuan] = useState<Record<string, number>>({});
  useEffect(() => setSes(sesVar()), []);

  const bak = (w: string) => {
    setKelime({ w, tr: bul(w) });
    if (ses) konus(w);
  };
  const etiket = (g: string) => `beceri:${d.kod}:${g}`;
  const not = (g: string, p: number) => {
    setPuan((x) => {
      const y = { ...x, [g]: p };
      const okumaBitti = d.tur === "okuma" && "g1" in y && "g2" in y;
      if (okumaBitti) yaz(beceriAnahtari(d.kod), { bitti: true, puan: y.g1 + y.g2, toplam: d.bosluklar.length + d.dogruYanlis.length });
      return y;
    });
  };

  const gorevNo = (n: number) => <span className="gorev-no">{n}</span>;

  return (
    <div className="beceri">
      <section className="yaprak b-blok" aria-labelledby="b-hazirlik">
        <h2 id="b-hazirlik">{gorevNo(1)} Hazırlık</h2>
        <Eslestir d={d} bitince={() => not("hazirlik", d.hazirlik.length)} />
      </section>

      <section className="yaprak b-blok" aria-labelledby="b-metin">
        <h2 id="b-metin">
          {gorevNo(2)} {d.tur === "okuma" ? "Oku" : "Örnek metni oku"}
        </h2>
        <p className="not">Anlamını bilmediğin kelimeye dokun. Önce metnin tamamını bir kez oku, sonra görevlere geç.</p>
        {ses && (
          <button type="button" className="dugme sade kucuk" onClick={() => konus(duzMetin(d.metin))}>
            Metni dinle
          </button>
        )}
        <div className="b-metin">
          <MetinGorunum m={d.metin} bak={bak} />
        </div>
        <p className="b-sozluk" role="status" aria-live="polite">
          {kelime ? (
            <>
              <b lang="en">{kelime.w}</b>: {kelime.tr ?? "Bu kelime sözlükte yok; cümleden tahmin etmeye çalış."}
            </>
          ) : (
            <span className="not">Dokunduğun kelimenin anlamı burada çıkar.</span>
          )}
        </p>
      </section>

      {d.tur === "okuma" ? (
        <>
          <section className="yaprak b-blok" aria-labelledby="b-g1">
            <h2 id="b-g1">{gorevNo(3)} Boşlukları doldur</h2>
            <BoslukBankasi sorular={d.bosluklar} etiket={etiket("g1")} bitince={(p) => not("g1", p)} />
          </section>
          <section className="yaprak b-blok" aria-labelledby="b-g2">
            <h2 id="b-g2">{gorevNo(4)} Doğru mu, yanlış mı?</h2>
            <DogruYanlisListe sorular={d.dogruYanlis} etiket={etiket("g2")} bitince={(p) => not("g2", p)} />
          </section>
          <Ceviri d={d} />
          <section className="yaprak b-blok" aria-labelledby="b-konus">
            <h2 id="b-konus">{gorevNo(5)} Sen ne dersin?</h2>
            <p className="not">Sesli cevap ver ya da bir arkadaşınla konuş. Takılırsan örneğe bak.</p>
            <ul className="b-konusma">
              {d.konusma.map((k) => (
                <li key={k.en}>
                  <p lang="en">
                    <b>{k.en}</b> <span className="not">({k.tr})</span>
                  </p>
                  <details>
                    <summary>Örnek cevap</summary>
                    <p lang="en">{k.ornek}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <>
          <section className="yaprak b-blok" aria-labelledby="b-ipucu">
            <h2 id="b-ipucu">{gorevNo(3)} Yazma ipuçları</h2>
            {d.ipuclari.map((p) => (
              <div key={p.baslik} className="b-ipucu">
                <h3>{p.baslik}</h3>
                <p>{p.metin}</p>
                {p.ornekler && (
                  <ul>
                    {p.ornekler.map((o) => (
                      <li key={o.en}>
                        <span lang="en">{o.en}</span> <span className="not">{o.tr}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
          <section className="yaprak b-blok" aria-labelledby="b-g1">
            <h2 id="b-g1">{gorevNo(4)} Örneği anladın mı?</h2>
            <DogruYanlisListe sorular={d.dogruYanlis} etiket={etiket("g1")} bitince={(p) => not("g1", p)} />
          </section>
          <section className="yaprak b-blok" aria-labelledby="b-g2">
            <h2 id="b-g2">{gorevNo(5)} Doğru sıraya koy</h2>
            <Siralama dogruSira={d.siralama} etiket={etiket("g2")} bitince={(ok) => not("g2", ok ? 1 : 0)} />
          </section>
          <section className="yaprak b-blok" aria-labelledby="b-g3">
            <h2 id="b-g3">{gorevNo(6)} Kalıpları tamamla</h2>
            <BoslukBankasi sorular={d.bosluklar} etiket={etiket("g3")} bitince={(p) => not("g3", p)} />
          </section>
          <Ceviri d={d} />
          <section className="yaprak b-blok" aria-labelledby="b-yaz">
            <h2 id="b-yaz">{gorevNo(7)} Şimdi sen yaz</h2>
            <YazGorevi d={d} />
          </section>
        </>
      )}

      <p className="b-son">
        <Link href="/beceriler" className="dugme">
          Diğer okuma ve yazma dersleri
        </Link>
      </p>
    </div>
  );
}

function Ceviri({ d }: { d: Ders }) {
  return (
    <details className="yaprak b-ceviri">
      <summary>Metnin Türkçesi (görevlerden sonra bak)</summary>
      {d.ceviri.map((c, i) => (
        <p key={i}>{c}</p>
      ))}
    </details>
  );
}

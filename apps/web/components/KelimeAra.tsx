"use client";
import { useMemo, useState } from "react";
import { M_ADJ, M_VERB, inf } from "@ti/motor";
import { SesDugmesi } from "./Kucukler";

interface Kayit {
  en: string;
  tr: string;
  tur: string;
  ek: string;
  ke: string;
  kt: string;
}

const trn = (x: string) =>
  String(x)
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[âà]/g, "a")
    .replace(/[’'.?!,]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function dizin(): Kayit[] {
  const out: Kayit[] = [],
    gor = new Set<string>();
  const ekle = (en: string, tr: string, tur: string, ek: string) => {
    const k = en.toLowerCase() + "|" + tr;
    if (gor.has(k)) return;
    gor.add(k);
    out.push({ en, tr, tur, ek, ke: trn(en), kt: trn(tr) });
  };
  M_VERB.forEach((v) => ekle(v.en === "listen" ? "listen to" : v.en, inf(v.stem), "Fiil", `he ${v.en3}, geçmişi ${v.past}${v.irr ? " (düzensiz)" : ""}`));
  M_ADJ.forEach(([e, t, alt]) => ekle(e, t, "Durum", alt?.length ? "Bu da olur: " + alt.join(", ") : ""));
  M_VERB.forEach((v) => v.cs.forEach(([e, t]) => ekle(e, t, "Tamamlayıcı", "")));
  return out;
}

export function KelimeAra() {
  const W = useMemo(dizin, []);
  const [q, setQ] = useState("");
  const s = trn(q);

  let sonuc: Kayit[] = [],
    not = "";
  if (s.length >= 2) {
    sonuc = W.filter((o) => o.ke.includes(s) || o.kt.includes(s));
    if (!sonuc.length && s.length > 3) {
      for (let L = s.length - 1; L >= 2; L--) {
        const r = s.slice(0, L);
        const f = W.filter((o) => o.kt.split(/[ ,/()]+/).some((w) => w.startsWith(r)));
        if (f.length) {
          sonuc = f;
          not = `“${q.trim()}” bulunamadı. Ekleri attım, ${q.trim().slice(0, L)}… ile başlayanlar:`;
          break;
        }
      }
    }
    const puan = (o: Kayit) =>
      o.ke === s || o.kt === s ? 0 : o.ke.startsWith(s) || o.kt.startsWith(s) ? 1 : o.kt.split(" ").some((w) => w.startsWith(s)) ? 2 : 3;
    sonuc = [...sonuc].sort((a, b) => puan(a) - puan(b) || a.en.length - b.en.length).slice(0, 20);
  }

  return (
    <section className="kenar-kutu ara yaprak" aria-labelledby="ara-baslik">
      <h3 id="ara-baslik">Kelime ara</h3>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="uyu, kahve, tired…"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Türkçe ya da İngilizce kelime ara"
      />
      {s.length < 2 ? (
        <p className="not">Türkçe ya da İngilizce yaz. Ekli kelime yazarsan (uyumadık) ekleri atıp kökü bulur.</p>
      ) : (
        <div className="ara-sonuc">
          {not && <p className="not">{not}</p>}
          {sonuc.length ? (
            sonuc.map((o) => (
              <div className="ara-satir" key={o.en + o.tr}>
                <div className="ara-ilk">
                  <b lang="en">{o.en}</b>
                  <SesDugmesi metin={o.en} />
                  <button type="button" className="dugme sade kucuk" onClick={() => window.dispatchEvent(new CustomEvent("ti-ekle", { detail: o.en }))}>
                    Cümleye ekle
                  </button>
                </div>
                <div>{o.tr}</div>
                <div className="not">
                  {o.tur}
                  {o.ek && `, ${o.ek}`}
                </div>
              </div>
            ))
          ) : (
            <p className="not">Bulunamadı. Daha kısa yaz, sadece kökü.</p>
          )}
        </div>
      )}
    </section>
  );
}

// Prototip HTML'deki motor kodunu (sadece motor bölümlerini) Node'da çalıştırır.
// Karşılaştırma testleri ve fixture üretimi için kullanılır.
import fs from "node:fs";
import vm from "node:vm";

// Prototipteki satır aralıkları (1'den başlar, iki uç dahil)
const ARALIKLAR = [
  [417, 417], // esc
  [1514, 1514], // norm
  [1750, 1849], // üreteç + Türkçe çekim + matchAns + genFresh
  [1850, 1951], // RULES + diagnose
  [1952, 1966], // kelime sırası
  [2041, 2080], // trSeg
  [2140, 2163], // cümle yolu
];

export function prototipYukle(htmlYolu) {
  const satirlar = fs.readFileSync(htmlYolu, "utf8").split("\n");
  const kod = ARALIKLAR.map(([a, b]) => satirlar.slice(a - 1, b).join("\n")).join("\n");
  const ctx = vm.createContext({ console });
  vm.runInContext(
    kod +
      "\n;globalThis.__api={genItem,genFresh,matchAns,norm,tokz,lev,diagnose,RULES,ruleKey,trSeg,orderRows,orderNote,slotOf,CAMP_L,PK_ALL,PK_HINT,ALLC,copPres,copPast,aorTR,aorQ,pastTR,pastQ,canTR,canQ,willTR,willQ,inf,M_SUBJ,M_ADJ,M_VERB};",
    ctx,
  );
  const api = ctx.__api;
  api.setRandom = (fn) => {
    vm.runInContext("Math", ctx).random = fn;
  };
  return api;
}

/** Tohumlu rastgele sayı üreteci (mulberry32) */
export function tohumlu(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Prototipin HTML çıktısını yeni motorun düz metin formatına çevirir */
export function protoIpucu(h) {
  let tur = "hata";
  const pre = '<span class="tip-i">💡</span> ';
  if (h.startsWith(pre)) {
    tur = "ipucu";
    h = h.slice(pre.length);
  }
  h = h.replace(/<mark>(.*?)<\/mark>/g, (_, x) => "[[" + x + "]]");
  h = h.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  return { tur, metin: h };
}

/**
 * Doğru cevaptan tipik öğrenci hataları üretir (teşhis testleri için).
 * Sadece cümle metnine ve fiil bilgisine bakar.
 */
export function hatalar(en, meta) {
  const w = en.replace(/[.?]$/, "").split(" ");
  const out = new Set();
  const j = (a) => a.join(" ");
  out.add(en.toLowerCase().replace(/[.?]/g, "")); // noktalamasız, küçük harf
  out.add(j(w.slice(1))); // ilk kelime yok
  out.add(j(w.slice(0, -1))); // son kelime yok
  if (w.length > 1) out.add(j([w[1], w[0], ...w.slice(2)])); // ilk ikisi yer değişmiş
  const degis = { am: "is", is: "are", are: "is", was: "were", were: "was", do: "does", does: "do", did: "do", Do: "Does", Does: "Do", Did: "Do", Is: "Are", Are: "Is", Was: "Were", Were: "Was", "don't": "doesn't", "doesn't": "don't", "didn't": "don't", can: "will", will: "can", "can't": "can", "won't": "will", not: "" };
  w.forEach((x, i) => {
    if (x in degis) out.add(j(w.map((y, k) => (k === i ? degis[x] : y)).filter(Boolean)));
  });
  out.add(j([w[0], "am", ...w.slice(1)])); // "I am work"
  out.add(j([w[0], "not", ...w.slice(1)])); // "I not work"
  out.add(j([...w.slice(0, 1), ...w.slice(2), w[1]])); // fiil / yardımcı sona (Türkçe sıra)
  if (meta.v) {
    const v = meta.v;
    for (const f of [v.en, v.en3, v.past, v.en + "ed", v.en.replace(/e$/, "") + "ed"]) {
      out.add(en.replace(new RegExp("\\b(" + [v.en, v.en3, v.past].join("|") + ")\\b"), f));
    }
    out.add(en.replace(/\b(listen) to\b/, "$1"));
    out.add(en.replace(/\bto (work|school|the park)\b/, "$1"));
    out.add(en.replace(/\bat (home|work|night)\b/, "$1"));
  }
  // içerik kelimesinde yazım hatası
  const c = meta.comp.split(" ").sort((a, b) => b.length - a.length)[0];
  if (c && c.length >= 4) {
    out.add(en.replace(c, c.slice(0, -1)));
    out.add(en.replace(c, c.slice(0, 2) + c[3] + c[2] + c.slice(4)));
  }
  out.add("x");
  out.delete(en);
  return [...out].filter((x) => x.trim());
}

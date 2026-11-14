/**
 * İçerikteki bütün İngilizce kelimelerin IPA'sını Britfone'dan (MIT) çeker → src/ipa-veri.ts
 * Çalıştır: npx vite-node scripts/ipa-uret.ts
 * Britfone "katı IPA" kullanır; sözlüklerdeki (Cambridge, Oxford) alışılmış gösterime çeviririz:
 *   ɐ → ʌ, ɹ → r, ɛ → e, g → ɡ; vurgu işareti hecenin başına alınır; tek heceli kelimede vurgu yazılmaz.
 */
import fs from "node:fs";
import { UNITELER } from "../src/index";
import { kelimelereBol } from "../src/sozluk";
import { EKI_BUL } from "../src/ekiBul";
import { SES_REHBERI } from "../src/ipa";

const ham = fs.readFileSync(new URL("../veri/britfone.main.3.0.1.csv", import.meta.url), "utf8");
const BRIT = new Map<string, string[][]>();
for (const satir of ham.split("\n")) {
  const m = satir.match(/^([^,]+?)(?:\((\d)\))?, (.+)$/);
  if (!m) continue;
  const k = m[1].toLowerCase();
  if (!BRIT.has(k)) BRIT.set(k, []);
  BRIT.get(k)!.push(m[3].trim().split(" "));
}

/** Elle seçilen / Britfone'da olmayan kelimeler (sözlük gösterimiyle) */
const ELLE: Record<string, string> = {
  a: "ə", an: "ən", the: "ðə", and: "ænd", to: "tuː", from: "frɒm", at: "æt", are: "ɑː", am: "æm", is: "ɪz", or: "ɔː", not: "nɒt",
  you: "juː", your: "jɔː", he: "hiː", she: "ʃiː", we: "wiː", they: "ðeɪ", her: "hɜː", his: "hɪz", our: "ˈaʊə", their: "ðeə", my: "maɪ", i: "aɪ",
  hello: "həˈləʊ", year: "jɪə", years: "jɪəz", restaurant: "ˈrestrɒnt", thirteen: "θɜːˈtiːn", fourteen: "fɔːˈtiːn", fifteen: "fɪfˈtiːn", sixteen: "sɪkˈstiːn",
  seventeen: "sevnˈtiːn", eighteen: "eɪˈtiːn", nineteen: "naɪnˈtiːn", ok: "əʊˈkeɪ", tv: "tiːˈviː", family: "ˈfæməli", can: "kæn", does: "dʌz", for: "fɔː", have: "hæv", was: "wɒz", will: "wɪl", afternoon: "ɑːftəˈnuːn", mum: "mʌm", goodbye: "ɡʊdˈbaɪ", too: "tuː", this: "ðɪs", that: "ðæt",
  what: "wɒt", where: "weə", who: "huː", how: "haʊ", job: "dʒɒb", police: "pəˈliːs", officer: "ˈɒfɪsə", photo: "ˈfəʊtəʊ", grandmother: "ˈɡrænmʌðə", grandfather: "ˈɡrænfɑːðə",
  excuse: "ɪkˈskjuːz", english: "ˈɪŋɡlɪʃ", england: "ˈɪŋɡlənd", turkish: "ˈtɜːkɪʃ", turkey: "ˈtɜːki", german: "ˈdʒɜːmən", germany: "ˈdʒɜːməni",
};

const UNLU = /^[ˈˌ]?(aɪ|aʊ|eɪ|ɔɪ|əʊ|ɪə|ɛə|ʊə|iː|uː|ɑː|ɔː|ɜː|æ|ɐ|ɒ|ə|ɛ|ɪ|ʊ|i)$/;
const BASLANGIC = new Set(["pl", "pɹ", "bl", "bɹ", "tɹ", "dɹ", "kl", "kɹ", "gl", "gɹ", "fl", "fɹ", "θɹ", "ʃɹ", "sp", "st", "sk", "sm", "sn", "sl", "sw", "tw", "kw", "dw", "pj", "bj", "tj", "dj", "kj", "fj", "vj", "mj", "nj", "hj", "spɹ", "stɹ", "skɹ", "spl", "skw", "stj", "skj"]);

function cevir(ses: string[]): string {
  const hece = ses.filter((x) => UNLU.test(x)).length;
  const out = [...ses];
  // Vurgu işaretini hecenin başına taşı (en uzun geçerli başlangıç)
  for (let i = 0; i < out.length; i++) {
    const m = out[i].match(/^([ˈˌ])(.+)$/);
    if (!m) continue;
    out[i] = m[2];
    if (m[1] === "ˌ" || hece < 2) continue; // ikincil vurgu yazılmaz; tek hecede vurgu yazılmaz
    let j = i;
    while (j > 0 && !UNLU.test(out[j - 1])) {
      const aday = out.slice(j - 1, i).join("");
      if (i - (j - 1) === 1 || BASLANGIC.has(aday)) j--;
      else break;
    }
    out[j] = "ˈ" + out[j];
  }
  return out.join("").replace(/ɐ/g, "ʌ").replace(/ɹ/g, "r").replace(/ɛ/g, "e").replace(/g/g, "ɡ");
}

const kelimeler = new Set<string>();
const ekle = (metin: string) => kelimelereBol(metin).forEach((w) => kelimeler.add(w.toLowerCase().replace(/'s$/, "")));
for (const u of UNITELER)
  for (const d of u.dersler) {
    d.kelimeGruplari.forEach((g) => g.kelimeler.forEach((k) => ekle(k.en)));
    d.kaliplar.forEach((k) => ekle(k.en));
    [...d.diyaloglar, ...(d.miniDiyaloglar ?? [])].forEach((x) => (x.bonus ?? []).forEach((b) => ekle(b.en)));
    (d.okuma?.bonus ?? []).forEach((b) => ekle(b.en));
  }
EKI_BUL.forEach((x) => ekle(x.s.replace(/[[\]]/g, "")));
SES_REHBERI.forEach((b) => b.sesler.forEach((s) => ekle(s.ornek)));
const ozel = new Set(UNITELER.flatMap((u) => u.ozelIsimler.map((x) => x.toLowerCase())));

const veri: Record<string, string> = {};
const eksik: string[] = [];
for (const w of [...kelimeler].sort()) {
  if (ozel.has(w)) continue;
  if (ELLE[w]) veri[w] = ELLE[w];
  else if (BRIT.has(w)) veri[w] = cevir(BRIT.get(w)![0]);
  else eksik.push(w);
}
fs.writeFileSync(
  new URL("../src/ipa-veri.ts", import.meta.url),
  `/** OTOMATİK ÜRETİLDİ: scripts/ipa-uret.ts. Kaynak: Britfone 3.0.1 (MIT, veri/BRITFONE-LICENSE.txt) + elle düzeltmeler. */\nexport const IPA_VERI: Record<string, string> = ${JSON.stringify(veri, null, 1)};\n`,
);
console.log(Object.keys(veri).length, "kelime. Eksik:", eksik.join(", ") || "yok");

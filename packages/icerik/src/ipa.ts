/**
 * Okunuş: IPA (sözlüklerdeki standart gösterim) ve ondan kurallarla üretilen yaklaşık Türkçe okunuş.
 * IPA verisi Britfone'dan (MIT lisansı, İngiliz İngilizcesi) scripts/ipa-uret.ts ile üretilir: src/ipa-veri.ts
 */
import { IPA_VERI } from "./ipa-veri";

/** Kelimenin ya da kalıbın IPA'sı: "good morning" → "ɡʊd ˈmɔːnɪŋ". Bulunamazsa null. */
export function ipaBul(en: string): string | null {
  const parca = en
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => IPA_VERI[w] ?? IPA_VERI[w.replace(/'s$/, "")]);
  return parca.length && parca.every(Boolean) ? parca.join(" ") : null;
}

/** IPA sesleri: uzun olan önce denenir */
const SESLER: [string, string][] = [
  ["tʃ", "ç"], ["dʒ", "c"],
  ["aɪ", "ay"], ["aʊ", "au"], ["eɪ", "ey"], ["ɔɪ", "oy"], ["əʊ", "ou"], ["ɪə", "iı"], ["eə", "eı"], ["ʊə", "uı"],
  ["iː", "ii"], ["uː", "uu"], ["ɑː", "aa"], ["ɔː", "oo"], ["ɜː", "öö"],
  ["æ", "e"], ["ʌ", "a"], ["ɒ", "o"], ["ə", "ı"], ["e", "e"], ["ɪ", "i"], ["ʊ", "u"], ["i", "i"],
  ["θ", "th"], ["ð", "dh"], ["ʃ", "ş"], ["ʒ", "j"], ["ŋ", "ng"], ["j", "y"], ["w", "w"], ["ɡ", "g"],
];

/**
 * IPA'dan yaklaşık Türkçe okunuş. Kesin değildir; Türkçede olmayan sesler (th, dh, w, ı gibi okunan ə)
 * ancak yaklaşık yazılabilir. Vurgulu hece BÜYÜK harfle yazılmaz; asıl ölçü sestir.
 */
export function ipaTurkce(ipa: string): string {
  let out = "";
  const s = ipa.replace(/[ˈˌ.]/g, "");
  for (let i = 0; i < s.length; ) {
    if (s[i] === " ") {
      out += " ";
      i++;
      continue;
    }
    const es = SESLER.find(([a]) => s.startsWith(a, i));
    if (es) {
      out += es[1];
      i += es[0].length;
    } else {
      out += s[i];
      i++;
    }
  }
  return out.replace(/ngk/g, "nk").replace(/ngg/g, "ng");
}

/** "Sesler" rehberi: her IPA işareti, Türkçedeki en yakın ses, örnek kelime */
export interface SesBilgisi {
  ipa: string;
  tr: string;
  ornek: string;
  not?: string;
  /** Türkçede olmayan ses */
  zor?: boolean;
}
export const SES_REHBERI: { baslik: string; aciklama: string; sesler: SesBilgisi[] }[] = [
  {
    baslik: "Türkçede olmayan sesler",
    aciklama: "Bunlara dikkat et: Türkçe harflerle tam yazılamazlar. Dinle ve taklit et.",
    sesler: [
      { ipa: "θ", tr: "th", ornek: "thank", not: "Dilin ucu dişlerin arasında, üfle. 't' ya da 's' değil.", zor: true },
      { ipa: "ð", tr: "dh", ornek: "mother", not: "Aynı yer, ama sesli: 'd' ile 'z' arası.", zor: true },
      { ipa: "w", tr: "w", ornek: "work", not: "Dudakları 'u' der gibi yuvarla, hemen aç. 'v' değil: dişler dudağa değmez.", zor: true },
      { ipa: "ə", tr: "ı", ornek: "teacher", not: "En sık duyulan ses. Çok kısa, gevşek bir 'ı'. Vurgusuz hecelerde.", zor: true },
      { ipa: "ɜː", tr: "öö", ornek: "girl", not: "Uzun, dudaklar yuvarlanmadan 'ö'.", zor: true },
      { ipa: "æ", tr: "e", ornek: "thank", not: "Ağzı geniş açarak 'e'; 'a' ile 'e' arası.", zor: true },
      { ipa: "ŋ", tr: "ng", ornek: "morning", not: "Genizden 'n'. Sondaki 'g' okunmaz.", zor: true },
      { ipa: "r", tr: "r", ornek: "friend", not: "Dil damağa değmez, titremez. Türkçe 'r' gibi vurma.", zor: true },
    ],
  },
  {
    baslik: "Uzun ünlüler",
    aciklama: "İki nokta (ː) sesi uzat demek. Kısa mı uzun mu olduğu anlamı değiştirebilir.",
    sesler: [
      { ipa: "iː", tr: "ii", ornek: "see" },
      { ipa: "uː", tr: "uu", ornek: "you" },
      { ipa: "ɑː", tr: "aa", ornek: "father" },
      { ipa: "ɔː", tr: "oo", ornek: "four" },
    ],
  },
  {
    baslik: "Kısa ünlüler",
    aciklama: "Türkçedeki seslere yakın.",
    sesler: [
      { ipa: "ɪ", tr: "i", ornek: "is", not: "Kısa, gevşek 'i'." },
      { ipa: "e", tr: "e", ornek: "ten" },
      { ipa: "ʌ", tr: "a", ornek: "husband", not: "Kısa 'a'." },
      { ipa: "ɒ", tr: "o", ornek: "job" },
      { ipa: "ʊ", tr: "u", ornek: "good", not: "Kısa 'u'." },
    ],
  },
  {
    baslik: "Kayan ünlüler",
    aciklama: "İki ünlü tek hecede, birinden ötekine kayarak söylenir.",
    sesler: [
      { ipa: "eɪ", tr: "ey", ornek: "name" },
      { ipa: "aɪ", tr: "ay", ornek: "my" },
      { ipa: "ɔɪ", tr: "oy", ornek: "boy" },
      { ipa: "əʊ", tr: "ou", ornek: "home" },
      { ipa: "aʊ", tr: "au", ornek: "now" },
      { ipa: "ɪə", tr: "iı", ornek: "here" },
      { ipa: "eə", tr: "eı", ornek: "where" },
    ],
  },
  {
    baslik: "Ünsüzler",
    aciklama: "Çoğu Türkçedeki gibi: p b t d k ɡ f v s z h m n l. Farklı yazılanlar:",
    sesler: [
      { ipa: "ʃ", tr: "ş", ornek: "she" },
      { ipa: "tʃ", tr: "ç", ornek: "child" },
      { ipa: "dʒ", tr: "c", ornek: "job" },
      { ipa: "ʒ", tr: "j", ornek: "television" },
      { ipa: "j", tr: "y", ornek: "yes", not: "IPA'da j, Türkçedeki 'y' sesidir." },
    ],
  },
  {
    baslik: "Vurgu",
    aciklama: "ˈ işareti, kendinden sonraki hecenin vurgulu (daha güçlü ve uzun) söylendiğini gösterir: /ˈmʌðə/ MA-dhı, /həˈləʊ/ hı-LOU.",
    sesler: [],
  },
];

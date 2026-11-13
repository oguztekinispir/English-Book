/** Cevap kontrolü: kısaltma normalizasyonu + küçük yazım hatası toleransı. */
import type { Soru } from "./tipler";

/** Kısaltmaları açar, noktalamayı atar: "I'm" → "i am", "dont" → "do not" */
export const norm = (s: string): string =>
  String(s)
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\b(don|doesn|didn|isn|aren|wasn|weren|can)t\b/g, "$1't")
    .replace(/\bim\b/g, "i'm")
    .replace(/\bi'm\b/g, "i am")
    .replace(/\byou're\b/g, "you are")
    .replace(/\bthey're\b/g, "they are")
    .replace(/\bwe're\b/g, "we are")
    .replace(/\bshe's\b/g, "she is")
    .replace(/\bhe's\b/g, "he is")
    .replace(/\bwhat's\b/g, "what is")
    .replace(/\bisn't\b/g, "is not")
    .replace(/\baren't\b/g, "are not")
    .replace(/\bwasn't\b/g, "was not")
    .replace(/\bweren't\b/g, "were not")
    .replace(/\bdon't\b/g, "do not")
    .replace(/\bdoesn't\b/g, "does not")
    .replace(/\bdidn't\b/g, "did not")
    .replace(/\bcan't\b/g, "can not")
    .replace(/\bcannot\b/g, "can not")
    .replace(/\bwon'?t\b/g, "will not")
    .replace(/\b(i|you|he|she|we|they)'ll\b/g, "$1 will")
    .replace(/\bit's\b/g, "it is")
    .replace(/\bthere's\b/g, "there is")
    .replace(/[^a-z0-9ğüşıöç ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const tokz = (x: string): string[] => norm(x).split(" ").filter(Boolean);

/** Levenshtein mesafesi */
export function lev(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export interface Sonuc {
  ok: boolean;
  /** [yazılan, doğrusu] — doğru sayılan küçük yazım hataları */
  typos: [string, string][];
}

/**
 * Cevabı kontrol eder. Doğru alternatifleri kabul eder (comfortable / relaxed).
 * Sadece içerik kelimelerinde (tired, coffee…) küçük yazım hatasını doğru sayar;
 * gramer kelimelerinde (am, does, didn't) hata affedilmez.
 */
export function matchAns(it: Soru, v: string): Sonuc {
  const cands = [it.en, ...(it.alts || [])];
  if (!v) return { ok: false, typos: [] };
  if (cands.some((x) => norm(x) === norm(v))) return { ok: true, typos: [] };
  const u = tokz(v),
    comp = new Set([it.meta.comp, ...(it.meta.alt || [])].flatMap(tokz));
  if (it.meta.s.nz) tokz(it.meta.s.en).forEach((w) => comp.add(w));
  for (const c of cands) {
    const e = tokz(c);
    if (e.length !== u.length) continue;
    const ty: [string, string][] = [];
    let good = true;
    for (let i = 0; i < e.length; i++) {
      if (u[i] === e[i]) continue;
      const d = lev(u[i], e[i]);
      if (comp.has(e[i]) && e[i].length >= 4 && d <= (e[i].length >= 7 ? 2 : 1)) ty.push([u[i], e[i]]);
      else {
        good = false;
        break;
      }
    }
    if (good && ty.length) return { ok: true, typos: ty };
  }
  return { ok: false, typos: [] };
}

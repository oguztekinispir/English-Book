/**
 * Türkçe çekim motoru.
 * Ünlü uyumu (2'li ve 4'lü), ünsüz sertleşmesi (d → t), k → ğ yumuşaması,
 * git → gid / ye → yi istisnaları; -ebil / -eme, -ecek / -meyecek ekleri.
 *
 * Kişi numarası (p): 0 = ben, 1 = sen, 2 = o, 3 = biz, 5 = onlar.
 * (4 = siz, şimdilik kullanılmıyor.)
 */
import type { Fiil, Kisi } from "./tipler";

export const TVOW = "aeıioöuü";

/** Kelimedeki son ünlü. */
export const lastV = (w: string): string => {
  for (let i = w.length - 1; i >= 0; i--) if (TVOW.includes(w[i])) return w[i];
  return "e";
};
/** 4'lü ünlü uyumu: ı / i / u / ü */
export const v4 = (w: string): string =>
  ({ a: "ı", ı: "ı", e: "i", i: "i", o: "u", u: "u", ö: "ü", ü: "ü" } as Record<string, string>)[lastV(w)];
/** 2'li ünlü uyumu: a / e */
export const v2 = (w: string): "a" | "e" => ("aıou".includes(lastV(w)) ? "a" : "e");
export const endsV = (w: string): boolean => TVOW.includes(w[w.length - 1]);
/** Fıstıkçı Şahap: sert ünsüzle bitiyor mu? */
export const hardC = (w: string): boolean => "çfhkpsşt".includes(w[w.length - 1]);

type Satir = [string, string, string, string, null, string];

/** Şimdiki durum: yorgun-um, yorgun-sun, yorgun, yorgun-uz, –, yorgun(lar) */
export function copPres(w: string, p: Kisi): string {
  const y = endsV(w) ? "y" : "",
    V = v4(w);
  return ([w + y + V + "m", w + "s" + V + "n", w, w + y + V + "z", null, w] as Satir)[p] as string;
}

/** Geçmiş durum: yorgun-du-m, mutlu-y-du-k … */
export function copPast(w: string, p: Kisi): string {
  const b = w + (endsV(w) ? "y" : "") + (hardC(w) && !endsV(w) ? "t" : "d") + v4(w);
  return ([b + "m", b + "n", b, b + "k", null, b] as Satir)[p] as string;
}

/** Geniş zaman: çalış-ır-ım / çalış-ma-m */
export function aorTR(v: Fiil, p: Kisi, neg?: boolean): string {
  if (!neg) {
    const a = v.aor,
      V = v4(a);
    return ([a + V + "m", a + "s" + V + "n", a, a + V + "z", null, a + "l" + v2(a) + "r"] as Satir)[p] as string;
  }
  const n = v.stem + "m" + v2(v.stem),
    V = v4(n);
  return ([n + "m", n + "zs" + V + "n", n + "z", n + "y" + V + "z", null, n + "zl" + v2(n) + "r"] as Satir)[p] as string;
}

/** Geniş zaman sorusu: çalışır mısın? */
export function aorQ(v: Fiil, p: Kisi): string {
  const base = p === 5 ? v.aor + "l" + v2(v.aor) + "r" : v.aor;
  return base + " " + copPres("m" + v4(base), p === 5 ? 2 : p);
}

/** Geçmiş zaman: çalış-tı-m / çalış-ma-dı-m */
export function pastTR(v: Fiil, p: Kisi, neg?: boolean): string {
  const b = neg
    ? v.stem + "m" + v2(v.stem) + "d" + v4(v.stem + "m" + v2(v.stem))
    : v.stem + (hardC(v.stem) ? "t" : "d") + v4(v.stem);
  return ([b + "m", b + "n", b, b + "k", null, b + "l" + v2(b) + "r"] as Satir)[p] as string;
}

/** Ünlüyle başlayan ek gelince kök değişimi: git → gid, ye → yi */
export const softS = (st: string): string =>
  /git$/.test(st) ? st.slice(0, -1) + "d" : /(^| )ye$/.test(st) ? st.slice(0, -1) + "i" : st;

export const aorPers = (B: string, p: Kisi): string => {
  const V = v4(B);
  return ([B + V + "m", B + "s" + V + "n", B, B + V + "z", null, B + "l" + v2(B) + "r"] as Satir)[p] as string;
};

/** -ebil- gövdesi: çalış-abil-ir */
export const canB = (v: Fiil): string => {
  const S = softS(v.stem);
  return S + (endsV(S) ? "y" : "") + (v2(v.stem) === "a" ? "abil" : "ebil") + "ir";
};

/** Yapabilmek: çalışabilirim / çalışamam */
export function canTR(v: Fiil, p: Kisi, neg?: boolean): string {
  if (!neg) return aorPers(canB(v), p);
  const S = softS(v.stem),
    A = v2(v.stem),
    n = S + (endsV(S) ? "y" : "") + A + "m" + A,
    V = v4(n);
  return ([n + "m", n + "zs" + V + "n", n + "z", n + "y" + V + "z", null, n + "zl" + v2(n) + "r"] as Satir)[p] as string;
}

export function canQ(v: Fiil, p: Kisi): string {
  const B = canB(v),
    base = p === 5 ? B + "l" + v2(B) + "r" : B;
  return base + " " + copPres("m" + v4(base), p === 5 ? 2 : p);
}

/** -ecek / -meyecek gövdesi */
export const willF = (v: Fiil, neg?: boolean): string => {
  if (neg) {
    const N = v.stem + "m" + v2(v.stem);
    return N + "y" + (v2(N) === "a" ? "acak" : "ecek");
  }
  const S = softS(v.stem);
  return S + (endsV(S) ? "y" : "") + (v2(v.stem) === "a" ? "acak" : "ecek");
};

/** Gelecek: çalışacağım (k → ğ) */
export function willTR(v: Fiil, p: Kisi, neg?: boolean): string {
  const F = willF(v, neg),
    G = F.slice(0, -1) + "ğ",
    V = v4(F);
  return ([G + V + "m", F + "s" + V + "n", F, G + V + "z", null, F + "l" + v2(F) + "r"] as Satir)[p] as string;
}

export function willQ(v: Fiil, p: Kisi): string {
  const F = willF(v, false),
    base = p === 5 ? F + "l" + v2(F) + "r" : F;
  return base + " " + copPres("m" + v4(base), p === 5 ? 2 : p);
}

export function pastQ(v: Fiil, p: Kisi): string {
  const f = pastTR(v, p, false);
  return f + " m" + v4(f);
}

/** Mastar: iç → içmek, yaz → yazmak */
export const inf = (st: string): string => {
  const v = (st.match(/[aeıioöuü](?=[^aeıioöuü]*$)/) || ["e"])[0];
  return st + ("aıou".includes(v) ? "mak" : "mek");
};

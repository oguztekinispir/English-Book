/**
 * "Türkçeyi parçala": Türkçe cümleyi kök / ek / kişi parçalarına ayırır.
 * Örnek: uyu | ma | dı | k → We didn't sleep.
 */
import { canB, endsV, hardC, inf, pastTR, softS, v2, v4, willF } from "./turkce";
import type { Meta } from "./tipler";

/** root = kök (gri) · suf = ek, İngilizcede ayrı kelime (sarı) · pers = kişi (mavi) · y = anlamsız / çeviride yok */
export type ParcaTuru = "root" | "suf" | "pers" | "y";
/** [Türkçe parça, açıklama, tür] */
export type Parca = [t: string, label: string, kind: ParcaTuru];
/** Cümle = kelimeler, kelime = parçalar */
export type Parcalanmis = Parca[][];

const SY: Parca = ["y", "araya giren ses, anlamı yok", "y"];

const COMP_SPLIT: Record<string, Parca[]> = {
  evde: [["ev", "ev → home", "root"], ["de", "-de: nerede? → at", "suf"]],
  işte: [["iş", "iş → work", "root"], ["te", "-te: nerede? → at", "suf"]],
  işe: [["iş", "iş → work", "root"], ["e", "-e: nereye? → to", "suf"]],
  eve: [["ev", "ev → home", "root"], ["e", "-e: nereye? (home ile to gelmez)", "suf"]],
  okula: [["okul", "okul → school", "root"], ["a", "-a: nereye? → to", "suf"]],
  parka: [["park", "park → the park", "root"], ["a", "-a: nereye? → to", "suf"]],
  okulda: [["okul", "okul → school", "root"], ["da", "-da: nerede? → at", "suf"]],
  burada: [["bura", "bura → here", "root"], ["da", "-da: nerede? (here ile at gelmez)", "suf"]],
  parkta: [["park", "park → the park", "root"], ["ta", "-ta: nerede? → in", "suf"]],
  ofiste: [["ofis", "ofis → the office", "root"], ["te", "-te: nerede? → in", "suf"]],
  denizde: [["deniz", "deniz → the sea", "root"], ["de", "-de: nerede? → in", "suf"]],
  "Türkiye'den": [["Türkiye", "Türkiye → Turkey", "root"], ["'den", "-den: nereden? → from", "suf"]],
  "İngiltere'den": [["İngiltere", "İngiltere → England", "root"], ["'den", "-den: nereden? → from", "suf"]],
  "Almanya'dan": [["Almanya", "Almanya → Germany", "root"], ["'dan", "-dan: nereden? → from", "suf"]],
};

export function trSeg(m: Meta | null | undefined): Parcalanmis | null {
  if (!m) return null;
  const P = m.s.p,
    subj: Parca[] =
      m.s.tr === "Arkadaşım"
        ? [["Arkadaş", "arkadaş → friend", "root"], ["ım", "-ım: benim → my", "pers"]]
        : m.s.kok && m.s.tr.startsWith(m.s.kok)
          ? [
              [m.s.kok, `${m.s.kok.toLocaleLowerCase("tr")} → ${m.s.en.replace(/^my /i, "")}`, "root"],
              [m.s.tr.slice(m.s.kok.length), `-${m.s.tr.slice(m.s.kok.length)}: benim → my`, "pers"],
            ]
          : [[m.s.tr, "kim → " + m.s.en, "pers"]];
  const cw: Parca[] = COMP_SPLIT[m.compTr] || [[m.compTr, m.compTr + " → " + m.comp, "root"]];
  const pc = (w: string, Q: number): Parca[] => {
    const y = endsV(w) ? "y" : "",
      V = v4(w);
    return Q === 0
      ? [...(y ? [SY] : []), [V + "m", "-ım: ben (I)", "pers"]]
      : Q === 1
        ? [["s" + V + "n", "-sın: sen (you)", "pers"]]
        : Q === 3
          ? [...(y ? [SY] : []), [V + "z", "-ız: biz (we)", "pers"]]
          : [];
  };
  const pp = (w: string, lbl: string): Parca[] => {
    const y = endsV(w) ? "y" : "",
      D = (hardC(w) && !endsV(w) ? "t" : "d") + v4(w);
    return [
      ...(y ? [SY] : []),
      [D, lbl, "suf"],
      ...((P === 0 ? [["m", "-m: ben (I)", "pers"]] : P === 1 ? [["n", "-n: sen (you)", "pers"]] : P === 3 ? [["k", "-k: biz (we)", "pers"]] : []) as Parca[]),
    ];
  };
  if (m.form === "be" || m.form === "bePast") {
    const past = m.form === "bePast",
      pl = "-dı: geçmiş → was / were";
    if (m.pol === "pos") return [subj, [...cw, ...(past ? pp(m.compTr, pl) : pc(m.compTr, P))]];
    if (m.pol === "neg") return [subj, cw, [["değil", "değil → not", "suf"], ...(past ? pp("değil", pl) : pc("değil", P))]];
    const q = "m" + v4(m.compTr);
    return [subj, cw, [[q, "-mı: soru → " + (past ? "Was / Were" : "Am / Is / Are") + " başa", "suf"], ...(past ? pp(q, pl) : pc(q, P))]];
  }
  const v = m.v!,
    st = v.stem,
    root: Parca = [st, inf(st) + " → " + v.en + (v.en === "listen" ? " to" : ""), "root"];
  const per = (b: string): Parca[] =>
    P === 0 ? [["m", "-m: ben (I)", "pers"]] : P === 1 ? [["n", "-n: sen (you)", "pers"]] : P === 3 ? [["k", "-k: biz (we)", "pers"]] : P === 5 ? [["l" + v2(b) + "r", "-lar: onlar (they)", "pers"]] : [];
  if (m.form === "can" || m.form === "will") {
    const S = softS(st),
      rS: Parca = S === st ? root : [S, inf(st) + " → " + v.en + (st.endsWith("git") ? " (t → d)" : " (e → i)"), "root"],
      y: Parca[] = endsV(S) ? [SY] : [],
      A = v2(st);
    const ap = (B: string): Parca[] => {
      const V = v4(B);
      return P === 0 ? [[V + "m", "-im: ben (I)", "pers"]] : P === 1 ? [["s" + V + "n", "-sin: sen (you)", "pers"]] : P === 3 ? [[V + "z", "-iz: biz (we)", "pers"]] : P === 5 ? [["l" + v2(B) + "r", "-ler: onlar (they)", "pers"]] : [];
    };
    if (m.form === "can") {
      const bil: Parca = [A + "bil", "-ebil / -abil: yapabilmek → can", "suf"],
        ir: Parca = ["ir", "-ir: geniş zaman eki (çeviride yok)", "y"],
        B = canB(v);
      if (m.pol === "pos") return [subj, cw, [rS, ...y, bil, ir, ...ap(B)]];
      if (m.pol === "neg") {
        const n = S + (endsV(S) ? "y" : "") + A + "m" + A,
          W = v4(n),
          z: Parca = ["z", "-z: geniş zaman (olumsuz hali)", "y"];
        return [
          subj,
          cw,
          [
            rS,
            ...y,
            [A, "-e / -a: yapabilmek (kısalmış)", "suf"],
            ["m" + A, "-me / -ma: olumsuz → (birlikte) can't", "suf"],
            ...((P === 0 ? [["m", "-m: ben (I)", "pers"]] : P === 1 ? [z, ["s" + W + "n", "-sın: sen (you)", "pers"]] : P === 3 ? [SY, [W + "z", "-ız: biz (we)", "pers"]] : P === 5 ? [z, ["l" + v2(n) + "r", "-lar: onlar (they)", "pers"]] : [z]) as Parca[]),
          ],
        ];
      }
      const base = P === 5 ? B + "l" + v2(B) + "r" : B,
        q = "m" + v4(base);
      return [subj, cw, [rS, ...y, bil, ir, ...((P === 5 ? [["l" + v2(B) + "r", "-ler: onlar (they)", "pers"]] : []) as Parca[])], [[q, "-mi: soru → Can başa", "suf"], ...pc(q, P === 5 ? 2 : P)]];
    }
    const F = willF(v, m.pol === "neg"),
      ak = v2(m.pol === "neg" ? st + "m" + A : st) === "a" ? "acak" : "ecek",
      soft = P === 0 || P === 3,
      kw: Parca = [soft ? ak.slice(0, -1) + "ğ" : ak, "-ecek / -acak: gelecek → will" + (soft ? " (k → ğ)" : ""), "suf"],
      V = v4(F);
    const wp: Parca[] =
      P === 0 ? [[V + "m", "-ım: ben (I)", "pers"]] : P === 1 ? [["s" + V + "n", "-sın: sen (you)", "pers"]] : P === 3 ? [[V + "z", "-ız: biz (we)", "pers"]] : P === 5 ? [["l" + v2(F) + "r", "-lar: onlar (they)", "pers"]] : [];
    if (m.pol === "pos") return [subj, cw, [rS, ...y, kw, ...wp]];
    if (m.pol === "neg") return [subj, cw, [root, ["m" + A, "-me / -ma: olumsuz (-ma + -acak = won't)", "suf"], SY, kw, ...wp]];
    const base = P === 5 ? F + "l" + v2(F) + "r" : F,
      q = "m" + v4(base);
    return [subj, cw, [rS, ...y, [ak, "-ecek / -acak: gelecek → will", "suf"], ...((P === 5 ? [["l" + v2(F) + "r", "-lar: onlar (they)", "pers"]] : []) as Parca[])], [[q, "-mı: soru → Will başa", "suf"], ...pc(q, P === 5 ? 2 : P)]];
  }
  if (m.form === "simple") {
    const a = v.aor,
      rt: Parca = a.startsWith(st) ? root : [a.slice(0, st.length), inf(st) + " → " + v.en + " (sesliden önce t → d)", "root"],
      aS: Parca = [a.slice(st.length), "-ır / -er: geniş zaman (hep, genelde)", "suf"],
      V = v4(a);
    if (m.pol === "pos")
      return [subj, cw, [rt, aS, ...((P === 0 ? [[V + "m", "-ım: ben (I)", "pers"]] : P === 1 ? [["s" + V + "n", "-sın: sen (you)", "pers"]] : P === 3 ? [[V + "z", "-ız: biz (we)", "pers"]] : P === 5 ? [["l" + v2(a) + "r", "-lar: onlar (they)", "pers"]] : []) as Parca[])]];
    if (m.pol === "neg") {
      const ms = "m" + v2(st),
        n = st + ms,
        W = v4(n),
        z: Parca = ["z", "-z: geniş zaman (olumsuz hali)", "suf"];
      return [
        subj,
        cw,
        [root, [ms, "-ma / -me: olumsuz → don't / doesn't", "suf"], ...((P === 0 ? [["m", "-m: ben (I)", "pers"]] : P === 1 ? [z, ["s" + W + "n", "-sın: sen (you)", "pers"]] : P === 3 ? [SY, [W + "z", "-ız: biz (we)", "pers"]] : P === 5 ? [z, ["l" + v2(n) + "r", "-lar: onlar (they)", "pers"]] : [z]) as Parca[])],
      ];
    }
    const base = P === 5 ? a + "l" + v2(a) + "r" : a,
      q = "m" + v4(base);
    return [subj, cw, [rt, aS, ...((P === 5 ? [["l" + v2(a) + "r", "-lar: onlar (they)", "pers"]] : []) as Parca[])], [[q, "-mı: soru → Do / Does başa", "suf"], ...pc(q, P === 5 ? 2 : P)]];
  }
  const D = (hardC(st) ? "t" : "d") + v4(st),
    b = st + D,
    pl: Parca = [D, "-dı: geçmiş → " + v.past + (v.irr ? " (düzensiz)" : " (-ed)"), "suf"];
  if (m.pol === "pos") return [subj, cw, [root, pl, ...per(b)]];
  if (m.pol === "neg") {
    const ms = "m" + v2(st),
      n = st + ms,
      D2 = "d" + v4(n);
    return [subj, cw, [root, [ms, "-ma: olumsuz", "suf"], [D2, "-dı: geçmiş (-ma + -dı = didn't)", "suf"], ...per(n + D2)]];
  }
  const f = pastTR(v, P, false);
  return [subj, cw, [root, pl, ...per(b)], [["m" + v4(f), "-mı: soru → Did başa", "suf"]]];
}

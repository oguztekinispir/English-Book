/**
 * Kural tabanlı cümle üreteci. Yapay zekâ kullanmaz, çevrimdışı çalışır.
 * Rastgelelik dışarıdan verilir (rng), böylece testlerde aynı sonuç alınır.
 */
import { M_ADJ, M_SUBJ, M_VERB } from "./veri";
import { aorQ, aorTR, canQ, canTR, copPast, copPres, pastQ, pastTR, v4 as v4q, willQ, willTR } from "./turkce";
import type { Ayar, Cip, Kalip, Kutup, Meta, Rng, Soru } from "./tipler";

export const pick = <T>(a: T[], rng: Rng = Math.random): T => a[Math.floor(rng() * a.length)];
export const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
export const subjLow = (s: { en: string }): string => (s.en === "I" ? "I" : s.en.toLowerCase());

export interface Zorla {
  form: Kalip;
  pol: Kutup;
}

export function genItem(set: Ayar, force?: Zorla | null, rng: Rng = Math.random): Soru {
  const forms = (["be", "bePast", "simple", "past", "can", "will"] as Kalip[]).filter((f) => set[f]);
  if (!forms.length) forms.push("be");
  const pols: Kutup[] = ["pos"];
  if (set.neg) pols.push("neg");
  if (set.q) pols.push("q");
  const form = force ? force.form : pick(forms, rng),
    pol = force ? force.pol : pick(pols, rng);
  let s = pick(M_SUBJ, rng);
  if (pol === "q" && (s.p === 0 || s.p === 3)) s = pick(M_SUBJ.filter((x) => x.p !== 0 && x.p !== 3), rng);
  const p = s.p,
    third = p === 2,
    chips: Cip[] = [[s.tr, s.en]];
  let tr = "",
    en = "",
    kind = "",
    ek: [string, string] = ["", ""];
  const meta = { form, pol, s, third } as Meta;

  if (form === "be" || form === "bePast") {
    const [ae, at, alt] = pick(M_ADJ, rng),
      past = form === "bePast";
    const beP = s.en === "I" ? "am" : third ? "is" : "are",
      beX = s.en === "I" || third ? "was" : "were",
      be = past ? beX : beP;
    if (pol === "pos") {
      tr = `${s.tr} ${past ? copPast(at, p) : copPres(at, p)}.`;
      en = `${s.en} ${be} ${ae}.`;
      ek = past ? ["-dı / -dum (geçmiş durum)", be] : ["-ım / -sın (şimdi durum)", be];
    }
    if (pol === "neg") {
      tr = `${s.tr} ${at} ${past ? copPast("değil", p) : copPres("değil", p)}.`;
      en = `${s.en} ${be} not ${ae}.`;
      ek = [past ? "değildi (geçmiş olumsuz)" : "değil", be + " not"];
    }
    if (pol === "q") {
      tr = `${s.tr} ${at} ${past ? copPast("m" + v4q(at), p) : copPres("m" + v4q(at), p)}?`;
      en = `${cap(be)} ${subjLow(s)} ${ae}?`;
      ek = [past ? "-mıydı (geçmiş soru)" : "-mı (soru)", cap(be) + " başa"];
    }
    meta.be = be;
    meta.comp = ae;
    meta.compTr = at;
    meta.alt = alt || [];
    chips.push([at, ae]);
    kind = past ? "Geçmiş durum · was / were" : "Şimdi durum · am / is / are";
  } else if (form === "can" || form === "will") {
    const v = pick(M_VERB.filter((x) => !x.noModal), rng),
      vc = pick(v.cs, rng),
      [ce, ct] = vc,
      md = form,
      ng = md === "can" ? "can't" : "won't";
    const trVerb =
      pol === "q"
        ? md === "can"
          ? canQ(v, p)
          : willQ(v, p)
        : md === "can"
          ? canTR(v, p, pol === "neg")
          : willTR(v, p, pol === "neg");
    tr = `${s.tr} ${ct} ${trVerb}${pol === "q" ? "?" : "."}`;
    if (pol === "pos") {
      en = `${s.en} ${md} ${v.en} ${ce}.`;
      ek = md === "can" ? ["-ebil / -abil (yapabilmek)", "can"] : ["-ecek / -acak (gelecek)", "will"];
    }
    if (pol === "neg") {
      en = `${s.en} ${ng} ${v.en} ${ce}.`;
      ek = md === "can" ? ["-eme / -ama (yapamamak)", "can't"] : ["-meyecek / -mayacak", "won't"];
    }
    if (pol === "q") {
      en = `${cap(md)} ${subjLow(s)} ${v.en} ${ce}?`;
      ek = md === "can" ? ["-ebilir mi (soru)", "Can başa"] : ["-ecek mi (soru)", "Will başa"];
    }
    kind = md === "can" ? "Yapabilmek · can" : "Gelecek · will";
    meta.v = v;
    meta.comp = ce;
    meta.compTr = ct;
    meta.alt = vc[2] || [];
    chips.push([ct, ce]);
    chips.push([v.stem, v.en]);
  } else {
    const v = pick(M_VERB, rng),
      past = form === "past",
      vc = pick(v.cs, rng),
      [ce, ct] = vc;
    const trVerb = past ? (pol === "q" ? pastQ(v, p) : pastTR(v, p, pol === "neg")) : pol === "q" ? aorQ(v, p) : aorTR(v, p, pol === "neg");
    tr = `${s.tr} ${ct} ${trVerb}${pol === "q" ? "?" : "."}`;
    if (!past) {
      if (pol === "pos") {
        en = `${s.en} ${third ? v.en3 : v.en} ${ce}.`;
        ek = ["-ır / -er (geniş zaman)", third ? `${v.en3} (o → fiile -s)` : `${v.en} (fiil yalın)`];
      }
      if (pol === "neg") {
        const d = third ? "doesn't" : "don't";
        en = `${s.en} ${d} ${v.en} ${ce}.`;
        ek = ["-me / -ma (olumsuz)", d];
      }
      if (pol === "q") {
        const d = third ? "Does" : "Do";
        en = `${d} ${subjLow(s)} ${v.en} ${ce}?`;
        ek = ["-mı (soru)", d + " başa"];
      }
      kind = "Geniş zaman · her zaman yaptıkların";
    } else {
      if (pol === "pos") {
        en = `${s.en} ${v.past} ${ce}.`;
        ek = ["-dı (geçmiş)", v.irr ? `${v.past} (düzensiz)` : `${v.en}+ed`];
      }
      if (pol === "neg") {
        en = `${s.en} didn't ${v.en} ${ce}.`;
        ek = ["-medi (geçmiş olumsuz)", "didn't"];
      }
      if (pol === "q") {
        en = `Did ${subjLow(s)} ${v.en} ${ce}?`;
        ek = ["-dı mı (geçmiş soru)", "Did başa"];
      }
      kind = "Geçmiş zaman · did / -ed";
    }
    meta.v = v;
    meta.comp = ce;
    meta.compTr = ct;
    meta.alt = vc[2] || [];
    chips.push([ct, ce]);
    chips.push([v.stem, v.en]);
  }
  chips.push([ek[0], ek[1], 1]);
  return {
    tr,
    en,
    kind: kind + (pol === "neg" ? " · olumsuz" : pol === "q" ? " · soru" : ""),
    chips,
    meta,
    alts: meta.alt.map((a) => en.replace(meta.comp, a)),
  };
}

/**
 * Tekrarsız üreteç: son 25 cümleyi ve son 3 tamamlayıcıyı tekrar sormaz.
 * Her kullanıcı / oturum için ayrı bir tane oluştur.
 */
export function createFreshGen(rng: Rng = Math.random) {
  const RECENT: string[] = [],
    RECENTC: string[] = [];
  return function genFresh(set: Ayar, force?: Zorla | null): Soru {
    let it!: Soru;
    for (let i = 0; i < 30; i++) {
      it = genItem(set, force, rng);
      const c = it.meta.comp + "|" + (it.meta.v ? it.meta.v.en : "");
      if (!RECENT.includes(it.tr) && !RECENTC.slice(-3).includes(c)) break;
    }
    RECENT.push(it.tr);
    if (RECENT.length > 25) RECENT.shift();
    RECENTC.push(it.meta.comp + "|" + (it.meta.v ? it.meta.v.en : ""));
    if (RECENTC.length > 6) RECENTC.shift();
    return it;
  };
}

/** Kelime sırası şeması: KİM › YARDIMCI › FİİL › NE / NASIL / NEREDE / NE ZAMAN */
import { cap, subjLow } from "./uretec";
import type { Meta, Soru } from "./tipler";

export type Slot = "kim" | "yar" | "fiil" | "durum" | "ne" | "nasil" | "yer" | "zaman";
/** [etiket, arka plan rengi, yazı rengi] */
export const SLOT: Record<Slot, [string, string, string]> = {
  kim: ["KİM", "#D0EBFF", "#0B4F8A"],
  yar: ["YARDIMCI", "#FFE066", "#5C4A00"],
  fiil: ["FİİL", "#FFD8A8", "#8A4A00"],
  durum: ["DURUM", "#E5DBFF", "#5F3DC4"],
  ne: ["NE?", "#D3F9D8", "#1E6B33"],
  nasil: ["NASIL?", "#D3F9D8", "#1E6B33"],
  yer: ["NEREDE / NEREYE?", "#D3F9D8", "#1E6B33"],
  zaman: ["NE ZAMAN?", "#D3F9D8", "#1E6B33"],
};

export const slotOf = (c: string): Slot =>
  /^(every|at night|on |early$|late$|two times|twice)/.test(c) ? "zaman" : /^(at |to |in |home$)/.test(c) ? "yer" : /^(well|fast|a lot)$/.test(c) ? "nasil" : "ne";

export type Kutu = [kelime: string, slot: Slot];

export function orderRows(it: Soru): { tr: Kutu[]; en: Kutu[] } {
  const m = it.meta,
    s = m.s,
    p = m.pol,
    sl = slotOf(m.comp),
    trV = it.tr.replace(/[.?]$/, "").slice(s.tr.length).trim();
  let en: Kutu[], tr: Kutu[];
  if (m.form === "be" || m.form === "bePast") {
    tr = [[s.tr, "kim"], [trV, "durum"]];
    en = p === "q" ? [[cap(m.be!), "yar"], [subjLow(s), "kim"], [m.comp, "durum"]] : [[s.en, "kim"], [p === "neg" ? m.be + " not" : m.be!, "yar"], [m.comp, "durum"]];
  } else {
    const v = m.v!;
    let aux: string | null = null,
      vb = v.en;
    tr = [[s.tr, "kim"], [m.compTr, sl], [trV.slice(m.compTr.length).trim(), "fiil"]];
    if (m.form === "simple") {
      if (p === "pos") vb = m.third ? v.en3 : v.en;
      else aux = p === "neg" ? (m.third ? "doesn't" : "don't") : m.third ? "Does" : "Do";
    } else if (m.form === "past") {
      if (p === "pos") vb = v.past;
      else aux = p === "neg" ? "didn't" : "Did";
    } else aux = p === "neg" ? (m.form === "can" ? "can't" : "won't") : p === "q" ? cap(m.form) : m.form;
    en = p === "q" ? [[aux!, "yar"], [subjLow(s), "kim"], [vb, "fiil"], [m.comp, sl]] : [[s.en, "kim"], ...(aux ? ([[aux, "yar"]] as Kutu[]) : []), [vb, "fiil"], [m.comp, sl]];
  }
  return { tr, en };
}

/** Şemanın altındaki açıklama (** ile kalın) */
export const orderNote = (m: Pick<Meta, "pol" | "form">): string =>
  m.pol === "q"
    ? "Soruda yardımcı kelime (Do / Does / Did / Is / Was / Can / Will) **en başa** geçer, sonra KİM, sonra fiil."
    : m.form.startsWith("be")
      ? "Türkçede durum sonda; İngilizcede am / is / are (was / were) KİM'den hemen sonra, durum en sonda."
      : "Türkçede fiil **en sonda**; İngilizcede fiil **KİM'den hemen sonra** gelir. Geri kalan (ne, nasıl, nerede, ne zaman) fiilin **arkasına** dizilir.";

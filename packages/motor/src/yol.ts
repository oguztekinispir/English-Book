/** Cümle yolu: 19 seviye, basitten zora. Bir seviyede üst üste 5 doğru → sonraki açılır. */
import type { Kalip, Kutup } from "./tipler";

export const ALLC: [Kalip, Kutup][] = (["be", "simple", "can", "bePast", "past", "will"] as Kalip[]).flatMap((f) =>
  (["pos", "neg", "q"] as Kutup[]).map((p) => [f, p] as [Kalip, Kutup]),
);

export interface Seviye {
  /** Bölüm adı */
  g: string;
  /** Seviye adı */
  t: string;
  /** Örnek */
  d: string;
  /** Bu seviyede sorulacak kalıplar */
  c: [Kalip, Kutup][];
  /** Karışık seviye: önce "hangi kalıp?" sorulur */
  pk?: "pres" | "past" | "all";
}

export const CAMP_L: Seviye[] = [
  { g: "Şimdi durum", t: "am / is / are", d: "yorgunum → I am tired", c: [["be", "pos"]] },
  { g: "Şimdi durum", t: "isn't / aren't", d: "yorgun değilim → I am not tired", c: [["be", "neg"]] },
  { g: "Şimdi durum", t: "Are you …?", d: "yorgun musun? → Are you tired?", c: [["be", "q"]] },
  { g: "Geniş zaman", t: "I work / he works", d: "çalışırım → I work", c: [["simple", "pos"]] },
  { g: "Geniş zaman", t: "don't / doesn't", d: "çalışmam → I don't work", c: [["simple", "neg"]] },
  { g: "Geniş zaman", t: "Do / Does …?", d: "çalışır mısın? → Do you work?", c: [["simple", "q"]] },
  { g: "Geniş zaman", t: "Karışık şimdi", d: "am / is / are mı, do / does mu?", c: ALLC.filter((x) => x[0] === "be" || x[0] === "simple"), pk: "pres" },
  { g: "Yapabilmek", t: "can / can't", d: "çalışabilirim → I can work", c: [["can", "pos"], ["can", "neg"]] },
  { g: "Yapabilmek", t: "Can you …?", d: "koşabilir misin? → Can you run?", c: [["can", "q"]] },
  { g: "Geçmiş durum", t: "was / were", d: "yorgundum → I was tired", c: [["bePast", "pos"]] },
  { g: "Geçmiş durum", t: "wasn't / weren't", d: "yorgun değildim → I wasn't tired", c: [["bePast", "neg"]] },
  { g: "Geçmiş durum", t: "Was / Were …?", d: "yorgun muydun? → Were you tired?", c: [["bePast", "q"]] },
  { g: "Geçmiş iş", t: "-ed / 2. hal", d: "kahve içtim → I drank coffee", c: [["past", "pos"]] },
  { g: "Geçmiş iş", t: "didn't", d: "kahve içmedim → I didn't drink coffee", c: [["past", "neg"]] },
  { g: "Geçmiş iş", t: "Did …?", d: "kahve içtin mi? → Did you drink coffee?", c: [["past", "q"]] },
  { g: "Geçmiş iş", t: "Karışık geçmiş", d: "was / were mi, did mi?", c: ALLC.filter((x) => x[0] === "bePast" || x[0] === "past"), pk: "past" },
  { g: "Gelecek", t: "will / won't", d: "çalışacağım → I will work", c: [["will", "pos"], ["will", "neg"]] },
  { g: "Gelecek", t: "Will you …?", d: "çalışacak mısın? → Will you work?", c: [["will", "q"]] },
  { g: "Final", t: "Büyük karışık", d: "hepsi: önce hangi kalıp olduğuna karar ver", c: ALLC, pk: "all" },
];

/** Final seviyesinde 6 seçenek: [kalıp, ad, örnek, İngilizce] */
export const PK_ALL: [Kalip, string, string, string][] = [
  ["be", "Şimdi durum", "yorgunum, evdeyim", "am / is / are"],
  ["simple", "Geniş zaman", "çalışırım, içer", "fiil (+s) · olumsuz don't · soru Do"],
  ["can", "Yapabilmek", "çalışabilirim", "can"],
  ["bePast", "Geçmiş durum", "yorgundum, evdeydi", "was / were"],
  ["past", "Geçmiş iş", "çalıştım, içti", "-ed · olumsuz didn't · soru Did"],
  ["will", "Gelecek", "çalışacağım", "will"],
];

export const PK_HINT: Record<Kalip, string> = {
  be: "sonda -ım / -sın / -dır var, hareket yok",
  simple: "-ır / -er eki var: hep, genelde yapılan iş",
  can: "-ebil / -abil (ya da -eme / -ama) eki var",
  bePast: "-dı var ama hareket yok: geçmiş bir hal",
  past: "-dı var ve bir hareket var",
  will: "-ecek / -acak eki var",
};

/** "Hangi kalıp?" sorusunun doğru cevabı mı? (k: "d" durum / "i" iş, ya da final'de kalıp adı) */
export function kalipSecimiDogru(seviye: Seviye, secim: string, form: Kalip): boolean {
  return seviye.pk === "all" ? secim === form : (secim === "d") === (form === "be" || form === "bePast");
}

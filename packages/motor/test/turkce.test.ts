/** Türkçe çekim ve motorun temel davranışları: okunabilir örnekler. */
import { describe, expect, it } from "vitest";
import {
  M_SUBJ,
  M_VERB,
  aorQ,
  aorTR,
  canTR,
  copPast,
  copPres,
  diagnose,
  genItem,
  inf,
  isaretParcala,
  matchAns,
  pastQ,
  pastTR,
  trSeg,
  willTR,
} from "../src";
import type { Meta, Soru } from "../src";

const fiil = (en: string) => M_VERB.find((v) => v.en === en)!;
const ozne = (en: string) => M_SUBJ.find((s) => s.en === en)!;

describe("Türkçe çekim", () => {
  it("şimdi durum: ünlü uyumu ve araya giren y", () => {
    expect(copPres("yorgun", 0)).toBe("yorgunum");
    expect(copPres("mutlu", 0)).toBe("mutluyum");
    expect(copPres("hasta", 1)).toBe("hastasın");
    expect(copPres("aç", 3)).toBe("açız");
  });

  it("geçmiş durum: d → t sertleşmesi (Fıstıkçı Şahap)", () => {
    expect(copPast("yorgun", 0)).toBe("yorgundum");
    expect(copPast("aç", 0)).toBe("açtım");
    expect(copPast("mutlu", 3)).toBe("mutluyduk");
    expect(copPast("değil", 0)).toBe("değildim");
  });

  it("fiil çekimleri", () => {
    expect(pastTR(fiil("sleep"), 3, true)).toBe("uyumadık");
    expect(aorTR(fiil("drink"), 1, true)).toBe("içmezsin");
    expect(aorTR(fiil("walk"), 5)).toBe("yürürler");
    expect(aorQ(fiil("work"), 1)).toBe("çalışır mısın");
    expect(pastQ(fiil("drink"), 1)).toBe("içtin mi");
    expect(pastTR(fiil("exercise"), 0)).toBe("spor yaptım");
  });

  it("git → gid, ye → yi ve k → ğ", () => {
    expect(willTR(fiil("go"), 0)).toBe("gideceğim");
    expect(canTR(fiil("eat"), 0)).toBe("yiyebilirim");
    expect(canTR(fiil("go"), 0, true)).toBe("gidemem");
    expect(willTR(fiil("sleep"), 0, true)).toBe("uyumayacağım");
  });

  it("mastar", () => {
    expect(inf("iç")).toBe("içmek");
    expect(inf("araba kullan")).toBe("araba kullanmak");
  });
});

describe("Türkçeyi parçala", () => {
  it("uyu | ma | dı | k → We didn't sleep", () => {
    const m: Meta = { form: "past", pol: "neg", s: ozne("We"), third: false, v: fiil("sleep"), comp: "well", compTr: "iyi", alt: [] };
    const fiilParcalari = trSeg(m)![2];
    expect(fiilParcalari.map((p) => p[0])).toEqual(["uyu", "ma", "dı", "k"]);
    expect(fiilParcalari.map((p) => p[2])).toEqual(["root", "suf", "suf", "pers"]);
  });
});

describe("cevap kontrolü ve teşhis", () => {
  const soru: Soru = {
    tr: "Ben yorgunum.",
    en: "I am tired.",
    kind: "",
    chips: [],
    alts: [],
    meta: { form: "be", pol: "pos", s: ozne("I"), third: false, be: "am", comp: "tired", compTr: "yorgun", alt: [] },
  };

  it("kısaltma ve kesme işaretsiz yazımı kabul eder", () => {
    expect(matchAns(soru, "im tired").ok).toBe(true);
    expect(matchAns(soru, "I'm tired").ok).toBe(true);
  });

  it("içerik kelimesindeki küçük yazım hatasını doğru sayar ama not düşer", () => {
    expect(matchAns(soru, "I am tird")).toEqual({ ok: true, typos: [["tird", "tired"]] });
  });

  it("gramer kelimesindeki hatayı affetmez ve Türkçe açıklar", () => {
    expect(matchAns(soru, "I is tired").ok).toBe(false);
    const d = diagnose(soru, "I is tired");
    expect(d[0].metin).toContain("Kişiye uymuyor");
  });

  it("'I tired' → am eksik, Türkçe ek üzerinden açıklanır", () => {
    const d = diagnose(soru, "I tired");
    expect(d[0].metin).toMatch(/^\[\[am\]\] eksik\. Türkçede “yorgun” kelimesine gelen ek/);
  });

  it("vurgu işaretleri parçalanır", () => {
    expect(isaretParcala("[[am]] eksik")).toEqual([{ t: "am", vurgu: true }, { t: " eksik" }]);
  });
});

describe("üreteç", () => {
  it("5.600'den fazla farklı cümle üretebiliyor", () => {
    const TAM = { be: true, bePast: true, simple: true, past: true, can: true, will: true, neg: true, q: true };
    const set = new Set<string>();
    let a = 1;
    const rng = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 200000; i++) set.add(genItem(TAM, null, rng).tr);
    expect(set.size).toBeGreaterThan(5600);
  });
});

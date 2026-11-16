/** Gizli özne: ben / sen / biz Türkçe cümlede söylenmez, o / onlar kalır. */
import { describe, expect, it } from "vitest";
import { diagnose, genItem, orderRows, trSeg } from "../src";

const TAM = { be: true, bePast: true, simple: true, past: true, can: true, will: true, neg: true, q: true };
let tohum = 7;
const rng = () => ((tohum = (tohum * 16807) % 2147483647) - 1) / 2147483646;

describe("gizli özne", () => {
  const ornekler = Array.from({ length: 3000 }, () => genItem(TAM, null, rng));

  it("Ben / Sen / Biz Türkçe cümlede geçmez, O ve Onlar geçer", () => {
    for (const s of ornekler) {
      if (["Ben", "Sen", "Biz"].includes(s.meta.s.tr)) {
        expect(s.meta.gizli, s.tr).toBe(true);
        expect(s.tr, s.tr).not.toMatch(/^(Ben|Sen|Biz) /);
        expect(s.tr.charAt(0), s.tr).toBe(s.tr.charAt(0).toLocaleUpperCase("tr"));
      } else {
        expect(s.meta.gizli).toBeFalsy();
        expect(s.tr.startsWith(s.meta.s.tr), s.tr).toBe(true);
      }
    }
  });

  it("İngilizce cümlede özne her zaman var", () => {
    for (const s of ornekler.filter((x) => x.meta.gizli)) expect(s.en.toLowerCase()).toMatch(/\b(i|you|we)\b/);
  });

  it("sıralama ve parçalama gizli özneyi parantezle gösterir", () => {
    for (const s of ornekler.filter((x) => x.meta.gizli).slice(0, 300)) {
      const kim = `(${s.meta.s.tr.toLocaleLowerCase("tr")})`;
      expect(orderRows(s).tr[0]).toEqual([kim, "kim"]);
      expect(trSeg(s.meta)![0][0][0]).toBe(kim);
      // Kutulardaki Türkçe (özne hariç) cümlenin kendisini verir
      const birlesik = orderRows(s).tr.slice(1).map((k) => k[0]).join(" ");
      expect(s.tr.replace(/[.?]$/, "").toLocaleLowerCase("tr")).toBe(birlesik.toLocaleLowerCase("tr"));
    }
  });

  it("özne yazılmazsa ipucu ekte gizli olduğunu söyler", () => {
    const s = ornekler.find((x) => x.meta.gizli && x.meta.pol === "pos")!;
    const yanit = s.en.replace(/^(I|You|We) /, "");
    expect(diagnose(s, yanit).some((d) => /ek/.test(d.metin) && d.metin.includes(s.meta.s.en))).toBe(true);
  });
});

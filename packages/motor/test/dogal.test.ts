import { describe, expect, it } from "vitest";
import { diagnose, dogalDurum, genItem, matchAns, orderRows, trSeg } from "../src";

describe("doğal Türkçe: fiille söylenen durumlar", () => {
  it("sıkılmak (di tipi)", () => {
    expect(dogalDurum("sıkılmış", 0, "pos", false)).toBe("sıkıldım");
    expect(dogalDurum("sıkılmış", 0, "neg", false)).toBe("sıkılmadım");
    expect(dogalDurum("sıkılmış", 1, "q", false)).toBe("sıkıldın mı");
    expect(dogalDurum("sıkılmış", 3, "neg", false)).toBe("sıkılmadık");
    expect(dogalDurum("sıkılmış", 0, "pos", true)).toBe("sıkılmıştım");
    expect(dogalDurum("sıkılmış", 0, "neg", true)).toBe("sıkılmamıştım");
    expect(dogalDurum("sıkılmış", 1, "q", true)).toBe("sıkılmış mıydın");
  });
  it("susamak", () => {
    expect(dogalDurum("susamış", 0, "pos", false)).toBe("susadım");
    expect(dogalDurum("susamış", 2, "neg", false)).toBe("susamadı");
    expect(dogalDurum("susamış", 1, "q", false)).toBe("susadın mı");
    expect(dogalDurum("susamış", 2, "pos", true)).toBe("susamıştı");
  });
  it("korkmak (yor tipi)", () => {
    expect(dogalDurum("korkmuş", 0, "pos", false)).toBe("korkuyorum");
    expect(dogalDurum("korkmuş", 0, "neg", false)).toBe("korkmuyorum");
    expect(dogalDurum("korkmuş", 1, "q", false)).toBe("korkuyor musun");
    expect(dogalDurum("korkmuş", 2, "q", false)).toBe("korkuyor mu");
    expect(dogalDurum("korkmuş", 3, "pos", false)).toBe("korkuyoruz");
    expect(dogalDurum("korkmuş", 0, "pos", true)).toBe("korkmuştum");
    expect(dogalDurum("korkmuş", 1, "q", true)).toBe("korkmuş muydun");
    expect(dogalDurum("üşümüş", 0, "pos", false)).toBe("üşüyorum");
    expect(dogalDurum("üşümüş", 0, "neg", false)).toBe("üşümüyorum");
  });
  it("sıradan sıfat değişmez", () => expect(dogalDurum("yorgun", 0, "neg", false)).toBeNull());

  it("motor hiçbir yerde “-mış değil” üretmez; parçalama ve teşhis çalışır", () => {
    let a = 9;
    const rng = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    const set = { be: true, bePast: true, neg: true, q: true };
    let dogal = 0;
    for (let i = 0; i < 3000; i++) {
      const s = genItem(set, null, rng);
      expect(s.tr).not.toMatch(/m[ıiuü]ş (değil|m[ıiuü](?!yd))/);
      if (i < 3000 && /sıkılmış|susamış|korkmuş/.test(s.meta.compTr)) {
        dogal++;
        expect(s.meta.dogal).toBeTruthy();
        expect(trSeg(s.meta)).not.toBeNull();
        expect(orderRows(s).tr.length).toBe(2);
        expect(matchAns(s, s.en).ok).toBe(true);
        expect(Array.isArray(diagnose(s, s.en.replace(/\b(am|is|are|was|were)\b ?/i, "")))).toBe(true);
      }
    }
    expect(dogal).toBeGreaterThan(100);
  });
});

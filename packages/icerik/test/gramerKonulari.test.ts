import { describe, expect, it } from "vitest";
import { GRAMER_KONULARI, dersBul } from "../src";

describe("gramer konuları", () => {
  it("kodlar tekrarsız", () => {
    const k = GRAMER_KONULARI.map((x) => x.kod);
    expect(new Set(k).size).toBe(k.length);
  });
  for (const k of GRAMER_KONULARI)
    it(k.kod, () => {
      expect(k.onTest.length).toBe(5);
      expect(k.sonTest.length).toBe(5);
      for (const s of [...k.onTest, ...k.sonTest]) {
        expect(s.dogru).toBeGreaterThanOrEqual(0);
        expect(s.dogru).toBeLessThan(s.secenekler.length);
        expect(new Set(s.secenekler).size).toBe(s.secenekler.length);
      }
      // Ön test ve son test aynı soruyu sormaz
      const on = new Set(k.onTest.map((s) => s.soru));
      for (const s of k.sonTest) expect(on.has(s.soru), s.soru).toBe(false);
      expect(k.aciklama.length).toBeGreaterThan(0);
      expect(k.hatalar.length).toBeGreaterThanOrEqual(3);
      for (const d of k.dersler) expect(dersBul(d), d).toBeTruthy();
      // Türkçe tarafında ek parçalama yok: her örnek tek parça
      for (const g of k.aciklama) for (const o of g.ornekler ?? []) expect(o.tr.length).toBe(1);
    });
});

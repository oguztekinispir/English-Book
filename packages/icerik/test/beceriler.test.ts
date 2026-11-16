import { describe, expect, it } from "vitest";
import { BECERI_DERSLERI } from "../src";

describe("beceri dersleri", () => {
  it("kodlar tekrarsız", () => {
    const k = BECERI_DERSLERI.map((d) => d.kod);
    expect(new Set(k).size).toBe(k.length);
  });
  for (const d of BECERI_DERSLERI)
    it(d.kod, () => {
      expect(d.hazirlik.length).toBeGreaterThanOrEqual(6);
      expect(d.ceviri.length).toBeGreaterThan(0);
      expect(d.dogruYanlis.length).toBeGreaterThanOrEqual(4);
      // Doğru/yanlış dengeli olsun
      const dogru = d.dogruYanlis.filter((x) => x.dogru).length;
      expect(dogru).toBeGreaterThan(0);
      expect(dogru).toBeLessThan(d.dogruYanlis.length);
      for (const b of d.bosluklar) {
        expect(b.en.split("___").length, b.en).toBe(2);
        expect(b.cevap.length).toBeGreaterThan(0);
      }
      // Kelime bankasında aynı kelime iki kez olmasın (hangisi nereye belli olsun)
      const c = d.bosluklar.map((b) => b.cevap.toLowerCase());
      expect(new Set(c).size).toBe(c.length);
      if (d.tur === "yazma") {
        expect(d.ipuclari.length).toBeGreaterThanOrEqual(2);
        expect(d.siralama.length).toBeGreaterThanOrEqual(4);
        expect(d.yaz.kontrol.length).toBeGreaterThanOrEqual(3);
        if (d.yaz.enAz === 0) expect(d.yaz.alanlar?.length).toBeGreaterThan(0);
      }
    });
});

import { describe, expect, it } from "vitest";
import { A1_PLAN, SEVIYE_TESTI, seviyeSonucu } from "../src";

describe("seviye testi", () => {
  it("5 basamak, her birinde 4 soru", () => {
    expect(SEVIYE_TESTI.length).toBe(5);
    for (const b of SEVIYE_TESTI) expect(b.sorular.length).toBe(4);
  });

  it("basamaklar planda var olan ünitelere, artan sırayla bağlanır", () => {
    const siralar = SEVIYE_TESTI.map((b) => b.baslangic);
    expect(siralar).toEqual([...siralar].sort((a, b) => a - b));
    for (const s of siralar) expect(A1_PLAN.some((u) => u.sira === s)).toBe(true);
  });

  it("her sorunun en az 3 seçeneği var, seçenekler tekrarsız, boşluk sorusunda ___ var", () => {
    for (const b of SEVIYE_TESTI)
      for (const s of b.sorular) {
        expect(s.secenekler.length).toBeGreaterThanOrEqual(3);
        expect(new Set(s.secenekler).size).toBe(s.secenekler.length);
        if (s.tur === "bosluk") expect(s.soru).toContain("___");
        expect(s.aciklama.length).toBeGreaterThan(10);
      }
  });

  it("öneri ilk geçilemeyen basamaktır", () => {
    expect(seviyeSonucu([1]).unite).toBe(1);
    expect(seviyeSonucu([4, 2]).unite).toBe(3);
    expect(seviyeSonucu([4, 3, 3, 1]).unite).toBe(10);
    expect(seviyeSonucu([4, 4, 4, 4, 4]).unite).toBe(15);
  });
});

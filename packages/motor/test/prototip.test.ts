/**
 * Prototiple uyum testi: yeni motor, eski HTML defterin ürettiği çıktıların aynısını üretmeli.
 * Fixture, prototipten test/araclar/fixture-uret.mjs ile üretildi (Lengedu içeriği yok).
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { diagnose, genItem, matchAns, orderRows, trSeg } from "../src";
import type { Kalip, Kutup } from "../src";
// @ts-expect-error: .mjs yardımcı dosya
import { tohumlu } from "./araclar/prototip-yukle.mjs";

interface Ornek {
  seed: number;
  form: Kalip;
  pol: Kutup;
  tr: string;
  en: string;
  alts: string[];
  seg: unknown;
  sira: unknown;
  kontrol: [string, boolean][];
  teshis: [string, unknown][];
}
const FIX: Ornek[] = JSON.parse(fs.readFileSync(new URL("./fixtures/prototip.json", import.meta.url), "utf8"));
const TAM = { be: true, bePast: true, simple: true, past: true, can: true, will: true, neg: true, q: true };

describe("prototiple birebir uyum", () => {
  it("fixture boş değil ve 18 kalıbın hepsini kapsıyor", () => {
    expect(new Set(FIX.map((x) => x.form + "-" + x.pol)).size).toBe(18);
  });

  for (const x of FIX) {
    it(`${x.form}-${x.pol}: ${x.tr}`, () => {
      const s = genItem(TAM, { form: x.form, pol: x.pol }, tohumlu(x.seed));
      // Bilerek ayrılınan yerler (doğal Türkçe): "işe araba kullanmak" kaldırıldı; geçmiş zamanda "her gün" yerine "dün".
      if (/dr[io]ves? to work|drove to work/i.test(x.en) || (x.form === "past" && /every |times a week/.test(x.en))) return;
      expect(s.en).toBe(x.en);
      expect(s.alts).toEqual(x.alts);
      for (const [h, ok] of x.kontrol) expect(matchAns(s, h).ok, h).toBe(ok);
      // Bilerek ayrılınan yer: prototip "sıkılmış değilim" derdi, yeni motor doğal Türkçe kullanır ("sıkılmadım").
      if (s.meta.dogal) return;
      // Bilerek ayrılınan yer: ben / sen / biz Türkçe cümlede söylenmez ("Eve giderim").
      if (s.meta.gizli) {
        const at = x.tr.slice(s.meta.s.tr.length).trim();
        expect(s.tr).toBe(at.charAt(0).toLocaleUpperCase("tr") + at.slice(1));
        return;
      }
      expect(s.tr).toBe(x.tr);
      expect(trSeg(s.meta)).toEqual(x.seg);
      expect(orderRows(s)).toEqual(x.sira);
      for (const [h, d] of x.teshis) expect(diagnose(s, h), h).toEqual(d);
    });
  }
});

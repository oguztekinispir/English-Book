/**
 * İçerik kontrolleri. Her ünite için otomatik çalışır.
 * En önemlisi: diyalog, okuma, kalıp ve alıştırmalarda öğrencinin görmediği kelime olmamalı.
 */
import { describe, expect, it } from "vitest";
import { createFreshGen, matchAns, trSeg } from "@ti/motor";
import { A1_PLAN, UNITELER, bilinmeyenler, uniteKelimeleri } from "../src";

describe.each(UNITELER.map((u, i) => [u.kod, u, UNITELER.slice(0, i)] as const))("%s", (_kod, u, onceki) => {
  const bak = (yer: string, metin: string) => {
    const b = bilinmeyenler(u, metin, onceki);
    expect(b, `${yer}: “${metin}” içinde bilinmeyen kelime`).toEqual([]);
  };

  it("planda kaydı var ve sırası tutuyor", () => {
    const p = A1_PLAN.find((x) => x.kod === u.kod);
    expect(p).toBeDefined();
    expect(p!.sira).toBe(u.sira);
  });

  it("kelimeler tekrar etmiyor, hepsinin okunuşu ve Türkçesi var", () => {
    const k = uniteKelimeleri(u);
    const en = k.map((x) => x.en.toLowerCase());
    expect(en.length).toBe(new Set(en).size);
    k.forEach((x) => {
      expect(x.ok.trim(), x.en).not.toBe("");
      expect(x.tr.trim(), x.en).not.toBe("");
    });
    expect(k.length).toBeGreaterThanOrEqual(40);
  });

  it("diyaloglarda bilinmeyen kelime yok", () => {
    u.diyaloglar.forEach((d) =>
      d.satirlar.forEach((s) => {
        expect(d.kisiler[s.kim!], `konuşan: ${s.kim}`).toBeDefined();
        bak(d.baslik, s.en);
      }),
    );
  });

  it("okuma metninde ve sorularında bilinmeyen kelime yok", () => {
    u.okuma.satirlar.forEach((s) => bak("okuma", s.en));
    u.okuma.sorular.forEach((s) => bak("okuma sorusu", s.en));
  });

  it("kalıplarda, alıştırmalarda ve konuşma sorularında bilinmeyen kelime yok", () => {
    u.kaliplar.forEach((k) => bak("kalıp", k.en));
    u.alistirmalar.bosluk.forEach((b) => bak("boşluk", b.cumle.replace("___", b.cevap)));
    u.alistirmalar.siralama.forEach((s) => bak("sıralama", s.cevap));
    u.konusma.forEach((k) => {
      bak("konuşma", k.en);
      bak("konuşma örneği", k.ornek);
    });
  });

  it("boşluk doldurma: tek boşluk, cevap şıklarda", () => {
    u.alistirmalar.bosluk.forEach((b) => {
      expect(b.cumle.split("___").length - 1, b.cumle).toBe(1);
      expect(b.secenekler).toContain(b.cevap);
    });
  });

  it("test: doğru şık geçerli, şıklar tekrar etmiyor", () => {
    expect(u.test.length).toBe(10);
    u.test.forEach((t) => {
      expect(t.dogru).toBeGreaterThanOrEqual(0);
      expect(t.dogru).toBeLessThan(t.secenekler.length);
      expect(new Set(t.secenekler).size, t.soru).toBe(t.secenekler.length);
    });
  });

  it("motor: ünite kelimeleriyle cümle üretiyor, İngilizcede bilinmeyen kelime yok, parçalama çalışıyor", () => {
    let a = 7;
    const rng = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    const gen = createFreshGen(rng);
    const gorulen = new Set<string>();
    for (let i = 0; i < 400; i++) {
      const [form, pol] = u.motor.kaliplar[i % u.motor.kaliplar.length];
      const s = gen({}, { form, pol }, u.motor.malzeme);
      gorulen.add(s.tr);
      bak("motor", s.en);
      expect(trSeg(s.meta), s.tr).not.toBeNull();
      expect(matchAns(s, s.en).ok, s.en).toBe(true);
    }
    expect(gorulen.size).toBeGreaterThan(20);
  });
});

describe("a1-01 motor Türkçesi", () => {
  it("örnek cümleler doğru çekiliyor", () => {
    const u = UNITELER[0];
    let a = 3;
    const rng = () => ((a = (a * 16807) % 2147483647) / 2147483647);
    const gen = createFreshGen(rng);
    const hepsi = new Set<string>();
    for (let i = 0; i < 2000; i++) hepsi.add(`${gen({}, { form: "be", pol: "pos" }, u.motor.malzeme).tr} = ${""}`.replace(" = ", ""));
    const liste = [...hepsi];
    for (const beklenen of ["Ben Türkiye'denim.", "Sen öğrencisin.", "Ben Almanya'danım.", "Arkadaşım Alman.", "Ben öğretmenim.", "Sen İngilizsin."])
      expect(liste, beklenen).toContain(beklenen);
  });
});

describe("bilinmeyen kelime kontrolü kendisi çalışıyor mu", () => {
  it("ünitede olmayan kelimeyi yakalar, kısaltma ve çoğulu tanır", () => {
    const u = UNITELER[0];
    expect(bilinmeyenler(u, "I'm a doctor from Spain.")).toEqual(["doctor", "Spain"]);
    expect(bilinmeyenler(u, "We're friends. What's your name? She's twenty years old.")).toEqual([]);
  });
});

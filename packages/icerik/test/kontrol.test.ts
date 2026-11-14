/**
 * İçerik kontrolleri. Her ünite ve her ders için otomatik çalışır.
 * En önemlisi: bir derste öğrencinin o derse kadar görmediği kelime geçmemeli.
 */
import { describe, expect, it } from "vitest";
import { createFreshGen, matchAns, trSeg } from "@ti/motor";
import { A1_PLAN, EKI_BUL, UNITELER, bilinmeyenler, dersKelimeleri, tumKartlar, uniteKelimeleri } from "../src";

const rngYap = (t: number) => {
  let a = t;
  return () => ((a = (a * 16807) % 2147483647) / 2147483647);
};

describe.each(UNITELER.map((u, i) => [u.kod, u, UNITELER.slice(0, i)] as const))("%s", (_kod, u, onceki) => {
  it("planda kaydı var, ders sayısı ve sırası tutuyor", () => {
    const p = A1_PLAN.find((x) => x.kod === u.kod);
    expect(p).toBeDefined();
    expect(p!.sira).toBe(u.sira);
    expect(u.dersler.length).toBe(p!.dersSayisi);
    u.dersler.forEach((d, i) => {
      expect(d.no).toBe(i + 1);
      expect(d.kod).toBe(`${u.kod}-${i + 1}`);
    });
    expect(u.dersler.at(-1)!.tekrar, "son ders tekrar dersi olmalı").toBe(true);
  });

  it("kelimeler ünite içinde tekrar etmiyor, hepsinin okunuşu ve Türkçesi var", () => {
    const k = uniteKelimeleri(u);
    const en = k.map((x) => x.en.toLowerCase());
    expect(en.length).toBe(new Set(en).size);
    k.forEach((x) => {
      expect(x.ok.trim(), x.en).not.toBe("");
      expect(x.tr.trim(), x.en).not.toBe("");
    });
  });

  describe.each(u.dersler.map((d) => [d.kod, d] as const))("ders %s", (_dk, d) => {
    const bak = (yer: string, metin: string) => {
      const b = bilinmeyenler(u, metin, onceki, d.no);
      expect(b, `${d.kod} ${yer}: “${metin}” içinde bu derse kadar görülmemiş kelime`).toEqual([]);
    };

    it("ders büyüklüğü makul (en çok 30 yeni kelime)", () => {
      expect(dersKelimeleri(d).length).toBeLessThanOrEqual(30);
      if (!d.tekrar) expect(dersKelimeleri(d).length).toBeGreaterThan(0);
    });

    it("diyalog, okuma, kalıp, alıştırma ve konuşmada bilinmeyen kelime yok", () => {
      d.diyaloglar.forEach((x) =>
        x.satirlar.forEach((s) => {
          expect(x.kisiler[s.kim!], `konuşan: ${s.kim}`).toBeDefined();
          bak(x.baslik, s.en);
        }),
      );
      d.okuma?.satirlar.forEach((s) => bak("okuma", s.en));
      d.okuma?.sorular.forEach((s) => bak("okuma sorusu", s.en));
      d.kaliplar.forEach((k) => bak("kalıp", k.en));
      d.alistirmalar.bosluk.forEach((b) => bak("boşluk", b.cumle.replace("___", b.cevap).replace(/\(.*?\)/g, "")));
      d.alistirmalar.siralama.forEach((s) => bak("sıralama", s.cevap));
      d.konusma.forEach((k) => {
        bak("konuşma", k.en);
        bak("konuşma örneği", k.ornek);
      });
    });

    it("boşluk doldurma: tek boşluk, cevap şıklarda", () => {
      d.alistirmalar.bosluk.forEach((b) => {
        expect(b.cumle.split("___").length - 1, b.cumle).toBe(1);
        expect(b.secenekler).toContain(b.cevap);
      });
    });

    it("test: ders 5 soru, tekrar dersi 10 soru; doğru şık geçerli", () => {
      expect(d.test.length).toBe(d.tekrar ? 10 : 5);
      d.test.forEach((t) => {
        expect(t.dogru).toBeGreaterThanOrEqual(0);
        expect(t.dogru).toBeLessThan(t.secenekler.length);
        expect(new Set(t.secenekler).size, t.soru).toBe(t.secenekler.length);
      });
    });

    it("motor (varsa): bu derse kadarki kelimelerle cümle üretiyor, parçalama ve kontrol çalışıyor", () => {
      if (!d.motor) return;
      const gen = createFreshGen(rngYap(7));
      const gorulen = new Set<string>();
      for (let i = 0; i < 300; i++) {
        const [form, pol] = d.motor.kaliplar[i % d.motor.kaliplar.length];
        const s = gen({}, { form, pol }, d.motor.malzeme);
        gorulen.add(s.tr);
        bak("motor", s.en);
        expect(trSeg(s.meta), s.tr).not.toBeNull();
        expect(matchAns(s, s.en).ok, s.en).toBe(true);
      }
      expect(gorulen.size).toBeGreaterThan(15);
    });
  });
});

describe("a1-01 Türkçe çekimler", () => {
  const hepsi = (dersNo: number) => {
    const d = UNITELER[0].dersler[dersNo - 1];
    const gen = createFreshGen(rngYap(3));
    const s = new Set<string>();
    for (let i = 0; i < 1500; i++) s.add(gen({}, { form: "be", pol: "pos" }, d.motor!.malzeme).tr);
    return [...s];
  };
  it("1.2 kimlik cümleleri", () => {
    const l = hepsi(2);
    for (const b of ["Ben Türkiye'denim.", "Sen öğrencisin.", "Ben Almanya'danım.", "Arkadaşım Alman.", "Ben öğretmenim.", "Sen İngilizsin."]) expect(l, b).toContain(b);
  });
  it("1.3 yaş cümleleri", () => {
    const l = hepsi(3);
    for (const b of ["Ben yirmi yaşındayım.", "Sen on iki yaşındasın.", "O (kadın) on beş yaşında."]) expect(l, b).toContain(b);
  });
  it("yaşta years old'suz cevap da doğru", () => {
    const d = UNITELER[0].dersler[2];
    const gen = createFreshGen(rngYap(11));
    const s = gen({}, { form: "be", pol: "pos" }, d.motor!.malzeme);
    expect(matchAns(s, s.en.replace(" years old", "")).ok).toBe(true);
  });
});

describe("bilinmeyen kelime kontrolü kendisi çalışıyor mu", () => {
  it("ünitede olmayan kelimeyi yakalar, kısaltma ve çoğulu tanır", () => {
    const u = UNITELER[0];
    expect(bilinmeyenler(u, "I'm a doctor from Spain.")).toEqual(["doctor", "Spain"]);
    expect(bilinmeyenler(u, "We're friends. What's your name? She's twenty years old.")).toEqual([]);
  });
  it("ders sırasını dikkate alır: 1.1'de 'teacher' henüz bilinmiyor", () => {
    const u = UNITELER[0];
    expect(bilinmeyenler(u, "I am a teacher.", [], 1)).toEqual(["a", "teacher"]);
    expect(bilinmeyenler(u, "I am a teacher.", [], 2)).toEqual([]);
  });
});

describe("tekrar kartları ve eki bul", () => {
  it("kart anahtarları benzersiz", () => {
    const k = tumKartlar();
    expect(new Set(k.map((x) => x.anahtar)).size).toBe(k.length);
    expect(k.length).toBeGreaterThan(70);
  });
  it("eki bul: her cümlede tek işaret, en az 30 soru", () => {
    expect(EKI_BUL.length).toBeGreaterThanOrEqual(30);
    EKI_BUL.forEach((x) => expect(x.s.match(/\[/g)?.length, x.s).toBe(1));
  });
});

/**
 * "Çöz": metindeki her kelimenin ünite sözlüğündeki karşılığını bulur.
 * Bilinmeyen kelime kontrolü de aynı fonksiyonları kullanır.
 */
import type { Kelime, Unite } from "./tipler";

/** Kısaltmaları açar: I'm → I am, what's → what is */
export function acKisaltma(s: string): string {
  return s
    .replace(/[’`]/g, "'")
    .replace(/\b([Ii])'m\b/g, "$1 am")
    .replace(/\b(\w+)'re\b/g, "$1 are")
    .replace(/\b(what|he|she|it|that|who|where|how|this|there|name)'s\b/gi, "$1 is")
    .replace(/\b(\w+)'ll\b/g, "$1 will")
    .replace(/\b(\w+)n't\b/g, "$1 not");
}

/** Metni kelimelere böler (noktalama atılır, kısaltmalar açılır) */
export function kelimelereBol(s: string): string[] {
  return acKisaltma(s)
    .replace(/[^A-Za-zÇĞİÖŞÜçğıöşü' -]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
}

export interface SozlukKaydi {
  en: string;
  tr: string;
  ok?: string;
}

/** Ünitenin tek kelimelik sözlüğü (çok kelimeli girişlerin her kelimesi de eklenir) */
export function uniteSozlugu(u: Unite, onceki: Unite[] = []): Map<string, SozlukKaydi> {
  const m = new Map<string, SozlukKaydi>();
  const ekle = (k: Kelime) => {
    const anahtar = k.en.toLowerCase();
    if (!m.has(anahtar)) m.set(anahtar, { en: k.en, tr: k.tr, ok: k.ok });
  };
  for (const x of [...onceki, u]) x.kelimeGruplari.forEach((g) => g.kelimeler.forEach(ekle));
  // Çok kelimeli girişlerin parçaları (good morning → good, morning) bilinen sayılır
  for (const x of [...onceki, u])
    x.kelimeGruplari.forEach((g) =>
      g.kelimeler.forEach((k) => {
        const p = k.en.toLowerCase().split(" ");
        if (p.length > 1) p.forEach((w) => m.has(w) || m.set(w, { en: w, tr: `(${k.en}: ${k.tr})` }));
      }),
    );
  return m;
}

/** Bir kelimeyi sözlükte arar: tam hali, çoğul -s'siz hali, büyük/küçük harf farkı olmadan */
export function sozlukteBul(sozluk: Map<string, SozlukKaydi>, kelime: string): SozlukKaydi | undefined {
  const w = kelime.toLowerCase();
  return sozluk.get(w) ?? (w.endsWith("s") ? sozluk.get(w.slice(0, -1)) : undefined) ?? (w.endsWith("es") ? sozluk.get(w.slice(0, -2)) : undefined);
}

/**
 * Metindeki bilinmeyen kelimeler. Özel isimler ve önceki ünitelerin kelimeleri bilinen sayılır.
 */
export function bilinmeyenler(u: Unite, metin: string, onceki: Unite[] = []): string[] {
  const s = uniteSozlugu(u, onceki);
  const ozel = new Set([...onceki.flatMap((x) => x.ozelIsimler), ...u.ozelIsimler].map((x) => x.toLowerCase()));
  return kelimelereBol(metin).filter((w) => !ozel.has(w.toLowerCase()) && !sozlukteBul(s, w));
}

import type { Ayar, Slot } from "@ti/motor";

/** Bütün kalıplar açık (zorlanmış üretimde ayar önemsiz). */
export const TAM: Ayar = { be: true, bePast: true, simple: true, past: true, can: true, will: true, neg: true, q: true };

/** Kelime sırası kutularının etiketleri (sentence case) */
export const SLOT_AD: Record<Slot, string> = {
  kim: "Kim?",
  yar: "Yardımcı",
  fiil: "Fiil",
  durum: "Durum",
  ne: "Ne?",
  nasil: "Nasıl?",
  yer: "Nerede, nereye?",
  zaman: "Ne zaman?",
};

/** "Geniş zaman · her zaman yaptıkların · olumsuz" → ["Geniş zaman", "her zaman yaptıkların", "olumsuz"] */
export const turParca = (kind: string) => kind.split(" · ");

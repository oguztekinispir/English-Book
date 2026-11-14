"use client";
/** Tarayıcının sesli okuması (çevrimdışı çalışır). */
export const sesVar = () => {
  try {
    return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  } catch {
    return false;
  }
};

export interface SesAyar {
  /** Diyalogda kişiyi ayırmak için: kadın biraz ince, erkek biraz kalın */
  kim?: "kadin" | "erkek";
  hiz?: number;
  bitince?: () => void;
}

function sesSec(kim?: "kadin" | "erkek") {
  const hepsi = speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const us = hepsi.filter((v) => v.lang.toLowerCase().startsWith("en-us"));
  const havuz = us.length ? us : hepsi;
  if (!kim) return havuz[0];
  const kadinAd = /female|woman|samantha|victoria|karen|zira|aria|jenny|susan|allison|ava|serena|moira|tessa|fiona|libby|sonia/i;
  const erkekAd = /male|man|daniel|alex|fred|david|guy|mark|aaron|arthur|oliver|ryan|thomas|tom/i;
  return havuz.find((v) => (kim === "kadin" ? kadinAd : erkekAd).test(v.name) && !(kim === "erkek" && /female/i.test(v.name))) ?? havuz[0];
}

export function konus(t: string, a: SesAyar = {}) {
  if (!sesVar()) {
    a.bitince?.();
    return;
  }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "en-US";
    u.rate = a.hiz ?? 0.82;
    const v = sesSec(a.kim);
    if (v) u.voice = v;
    if (a.kim) u.pitch = a.kim === "kadin" ? 1.15 : 0.85;
    if (a.bitince) {
      u.onend = () => a.bitince?.();
      u.onerror = () => a.bitince?.();
    }
    speechSynthesis.speak(u);
  } catch {
    a.bitince?.();
  }
}

export function sustur() {
  try {
    if (sesVar()) speechSynthesis.cancel();
  } catch {
    /* yok say */
  }
}

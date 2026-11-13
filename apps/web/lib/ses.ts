"use client";
/** Tarayıcının sesli okuması (çevrimdışı çalışır). */
export const sesVar = () => {
  try {
    return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  } catch {
    return false;
  }
};

export function konus(t: string) {
  if (!sesVar()) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "en-US";
    u.rate = 0.82;
    const v = speechSynthesis.getVoices().find((x) => x.lang?.toLowerCase().startsWith("en-us"));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch {
    /* yok say */
  }
}

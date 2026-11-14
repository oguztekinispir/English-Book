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

/** Hesabım > Tercihler'deki okuma hızı (bu cihazda) */
function kayitliHiz(): number {
  try {
    const v = Number(JSON.parse(localStorage.getItem("ti:ses-hizi") || "0.82"));
    return v >= 0.5 && v <= 1.2 ? v : 0.82;
  } catch {
    return 0.82;
  }
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
    u.rate = a.hiz ?? kayitliHiz();
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

function dilSesi(dil: string) {
  const l = dil.toLowerCase();
  const vs = speechSynthesis.getVoices();
  return vs.find((v) => v.lang?.toLowerCase().replace("_", "-") === l) ?? vs.find((v) => v.lang?.toLowerCase().startsWith(l.slice(0, 2)));
}

/** Bu cihazda Türkçe ses var mı (dinleme modunda Türkçesini de okumak için) */
export const trSesVar = () => sesVar() && !!dilSesi("tr-TR");

/** Okur ve bitince çözülür. Ses takılırsa süre dolunca yine çözülür. */
export function soyle(t: string, dil: "en-US" | "tr-TR" = "en-US", hiz = 0.75): Promise<void> {
  return new Promise((coz) => {
    if (!sesVar()) return coz();
    let bitti = false;
    const son = () => {
      if (!bitti) {
        bitti = true;
        coz();
      }
    };
    try {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = dil;
      u.rate = hiz;
      const v = dil === "en-US" ? sesSec() : dilSesi(dil);
      if (v) u.voice = v;
      u.onend = son;
      u.onerror = son;
      setTimeout(son, Math.max(4000, t.length * 260));
      speechSynthesis.speak(u);
    } catch {
      son();
    }
  });
}

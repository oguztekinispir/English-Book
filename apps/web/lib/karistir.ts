import { useEffect, useState } from "react";

export const karistir = <T,>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/**
 * Karışık sıra, hidrasyon hatası olmadan: sunucuda ve ilk çizimde asıl sıra, tarayıcıda yüklenince karışık.
 * anahtar değişince yeniden karıştırır.
 */
export function useKarisik<T>(a: T[], anahtar: unknown = a, kosul?: (k: T[]) => boolean): T[] {
  const [s, setS] = useState(a);
  useEffect(() => {
    let k = karistir(a);
    for (let i = 0; i < 5 && kosul && !kosul(k); i++) k = karistir(a);
    setS(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anahtar]);
  return s;
}

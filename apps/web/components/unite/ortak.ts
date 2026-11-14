"use client";
import { useEffect, useState } from "react";
import { useKalici } from "@/lib/depo";

/** Ünite ilerlemesi (tarayıcıda; giriş yapılmışsa cevaplar ayrıca buluta gider) */
export interface UniteIlerleme {
  kart?: number; // kart modunda bilinen kelime sayısı (en iyi)
  bosluk?: number;
  siralama?: number;
  eslestirme?: boolean;
  okuma?: number;
  motor?: number; // doğru cümle sayısı
  test?: number; // en iyi test puanı (10 üzerinden)
}

/** Ders ilerlemesi (anahtar: ders kodu, "a1-01-2") */
export function useIlerleme(dersKod: string) {
  return useKalici<UniteIlerleme>(`ders:${dersKod}`, {});
}

/** Fisher–Yates; sonuç orijinal sırayla aynıysa bir kez daha karıştırır */
export function karistir<T>(a: T[]): T[] {
  const k = [...a];
  for (let deneme = 0; deneme < 3; deneme++) {
    for (let i = k.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [k[i], k[j]] = [k[j], k[i]];
    }
    if (k.length < 2 || k.some((x, i) => x !== a[i])) break;
  }
  return k;
}

/**
 * Karıştırılmış liste. Sunucuda ve ilk çizimde sırayı bozmaz (sunucu ile tarayıcı aynı görsün),
 * tarayıcıya geçince karıştırır. anahtar değişince yeniden karıştırır.
 */
export function useKaristir<T>(a: T[], anahtar: unknown = a): T[] {
  const [k, setK] = useState<T[]>(a);
  useEffect(() => {
    setK(karistir(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anahtar]);
  return k;
}

/** Cevap karşılaştırma: büyük/küçük harf, noktalama ve fazla boşluk önemsiz */
export const esit = (a: string, b: string) => {
  const n = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
  return n(a) === n(b);
};

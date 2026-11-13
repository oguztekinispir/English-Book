"use client";
/** Tarayıcıda kalıcı kayıt (Supabase gelene kadar). Anahtarlar "ti:" ile başlar. */
import { useCallback, useEffect, useState } from "react";

export function oku<T>(k: string, d: T): T {
  try {
    const v = localStorage.getItem("ti:" + k);
    return v == null ? d : (JSON.parse(v) as T);
  } catch {
    return d;
  }
}

export function yaz<T>(k: string, v: T): void {
  try {
    localStorage.setItem("ti:" + k, JSON.stringify(v));
  } catch {
    /* gizli sekme vb. */
  }
  window.dispatchEvent(new CustomEvent("ti-depo", { detail: k }));
}

/** useState gibi, ama tarayıcıda saklanır ve diğer bileşenlerle senkron kalır. */
export function useKalici<T>(k: string, d: T): [T, (x: T | ((p: T) => T)) => void, boolean] {
  const [v, setV] = useState<T>(d);
  const [hazir, setHazir] = useState(false);
  useEffect(() => {
    setV(oku(k, d));
    setHazir(true);
    const f = (e: Event) => {
      if ((e as CustomEvent<string>).detail === k) setV(oku(k, d));
    };
    window.addEventListener("ti-depo", f);
    return () => window.removeEventListener("ti-depo", f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);
  const set = useCallback(
    (x: T | ((p: T) => T)) => {
      const n = typeof x === "function" ? (x as (p: T) => T)(oku(k, d)) : x;
      setV(n);
      yaz(k, n);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [k],
  );
  return [v, set, hazir];
}

export const bugun = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

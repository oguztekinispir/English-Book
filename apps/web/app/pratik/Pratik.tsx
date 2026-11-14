"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { RULES, ruleKey, type Kalip, type Kutup, type Soru } from "@ti/motor";
import { bugun, useKalici } from "@/lib/depo";
import { CumleYolu } from "@/components/CumleYolu";
import { Serbest, type Zorla } from "@/components/Serbest";
import { KelimeAra } from "@/components/KelimeAra";
import { EkRehberi } from "@/components/EkRehberi";
import { cevapKaydet } from "@/lib/kayit";

type Mod = "yol" | "serbest";

export function Pratik() {
  const [mod, setMod] = useKalici<Mod>("mod", "yol");
  const [zayif, setZayif] = useKalici<Record<string, number>>("zayif", {});
  const [gun, setGun] = useKalici("gun", { d: "", ok: 0, n: 0 });
  const [zorla, setZorla] = useState<Zorla | null>(null);
  const [girisli, setGirisli] = useState<boolean | null>(null);
  useEffect(() => {
    supabaseTarayici()
      .auth.getSession()
      .then(({ data }) => setGirisli(!!data.session))
      .catch(() => setGirisli(false));
  }, []);

  const bugunku = gun.d === bugun() ? gun : { d: bugun(), ok: 0, n: 0 };

  const sonuc = (ok: boolean, soru: Soru, cevap: string, kaynak: "yol" | "motor") => {
    const k = ruleKey(soru.meta);
    cevapKaydet({ kaynak, kural: k, dogru: ok, soru: soru.tr, cevap, beklenen: soru.en });
    setZayif((w) => {
      const x = { ...w };
      if (ok) {
        if (x[k]) x[k] = Math.max(0, x[k] - 1);
      } else x[k] = (x[k] || 0) + 1;
      return x;
    });
    setGun((g) => {
      const b = g.d === bugun() ? g : { d: bugun(), ok: 0, n: 0 };
      return { d: b.d, ok: b.ok + (ok ? 1 : 0), n: b.n + 1 };
    });
  };

  const zorlar = Object.entries(zayif)
    .filter(([, v]) => v >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const calis = (k: string) => {
    const [form, pol] = k.split("-") as [Kalip, Kutup];
    setMod("serbest");
    setZorla((z) => ({ form, pol, n: (z?.n || 0) + 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pratik">
      <div className="pratik-ana">
        <div className="pratik-baslik">
          <h1>Pratik</h1>
          <div className="mod" role="tablist" aria-label="Pratik türü">
            <button role="tab" aria-selected={mod === "yol"} onClick={() => setMod("yol")}>
              Cümle yolu
            </button>
            <button role="tab" aria-selected={mod === "serbest"} onClick={() => setMod("serbest")}>
              Serbest antrenman
            </button>
          </div>
        </div>
        <p className="pratik-aciklama">
          {mod === "yol"
            ? "Basitten zora 19 seviye. Bir seviyede üst üste 5 doğru yapınca sıradaki açılır. Takıldığın yerde motor durur ve nedenini anlatır."
            : "Hangi kalıpları çalışmak istediğini sen seç. Yanlış yaptığın kural aynı kuraldan yeni bir cümleyle tekrar gelir."}
        </p>
        {mod === "yol" ? <CumleYolu onSonuc={sonuc} /> : <Serbest onSonuc={sonuc} zorla={zorla} />}
        <EkRehberi />
      </div>

      <aside className="pratik-kenar" aria-label="Yardımcılar">
        <section className="kenar-kutu bugun yaprak" aria-labelledby="bugun-baslik">
          <h3 id="bugun-baslik">Bugün</h3>
          <p className="bugun-sayi">
            <b>{bugunku.ok}</b>
            <span>
              doğru, {bugunku.n} cümlede
            </span>
          </p>
          {bugunku.n === 0 && <p className="not">Günde 15 cümle, ekleri yerine oturtur.</p>}
          {bugunku.n > 0 && bugunku.n < 15 && <p className="not">15 cümleye {15 - bugunku.n} kaldı.</p>}
          {bugunku.n >= 15 && <p className="not">Bugünkü 15 cümle tamam.</p>}
          {girisli === false && (
            <p className="not kayit-cagri">
              İlerlemen şimdilik sadece bu cihazda. <Link href="/kayit">Hesap aç</Link> ya da <Link href="/giris">giriş yap</Link>, telefonda da devam et; öğretmenin varsa çalışmanı görsün.
            </p>
          )}
        </section>

        {zorlar.length > 0 && (
          <section className="kenar-kutu zayif yaprak" aria-labelledby="zayif-baslik">
            <h3 id="zayif-baslik">En çok zorlandığın</h3>
            <ul>
              {zorlar.map(([k, v]) => (
                <li key={k}>
                  <span>
                    {RULES[k]?.t}
                    <small>{v} hata</small>
                  </span>
                  <button type="button" className="dugme kucuk" onClick={() => calis(k)}>
                    Bunu çalış
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <KelimeAra />
      </aside>
    </div>
  );
}

/**
 * İçerikten Supabase'e yüklenecek SQL dosyası üretir: supabase/seed/icerik.sql
 * Tekrar çalıştırmak güvenli (varsa günceller). Kullanım: npm run sql -w @ti/icerik
 */
import fs from "node:fs";
import path from "node:path";
import { UNITELER } from "../src";

const q = (s: string | null | undefined) => (s == null ? "null" : `$t$${s}$t$`);
const j = (o: unknown) => `$j$${JSON.stringify(o)}$j$::jsonb`;

const satirlar: string[] = [
  "-- OTOMATİK ÜRETİLDİ: packages/icerik/scripts/sql-uret.ts",
  "-- Supabase SQL Editor'de çalıştır. Tekrar çalıştırmak güvenli.",
  "begin;",
];

for (const u of UNITELER) {
  satirlar.push(`\n-- ${u.kod} · ${u.baslik}`);
  satirlar.push(
    `insert into public.uniteler (id, sahip_id, seviye, sira, kod, baslik, baslik_en, ozet, gramer, yayinda) values ` +
      `('${u.id}', null, '${u.seviye}', ${u.sira}, '${u.kod}', ${q(u.baslik)}, ${q(u.baslikEn)}, ${q(u.hedefler.join(" "))}, ${j([...new Set(u.dersler.flatMap((d) => d.motor?.kaliplar ?? []).map(([form, pol]) => `${form}-${pol}`))])}, true) ` +
      `on conflict (id) do update set seviye = excluded.seviye, sira = excluded.sira, baslik = excluded.baslik, baslik_en = excluded.baslik_en, ozet = excluded.ozet, gramer = excluded.gramer, yayinda = true, guncelleme = now();`,
  );
  // Kelime kimlikleri sabit: md5('<ünite kodu>:<kelime>') → uuid (uygulama da aynısını hesaplar)
  let sira = 0;
  for (const d of u.dersler) {
    for (const g of d.kelimeGruplari)
      for (const k of g.kelimeler) {
        const anahtar = `${u.kod}:${k.en}`;
        satirlar.push(
          `insert into public.kelimeler (id, unite_id, sira, tur, en, tr, okunus, ornek_en, ornek_tr, cagrisim, etiketler) values ` +
            `(md5(${q(anahtar)})::uuid, '${u.id}', ${sira++}, 'kelime', ${q(k.en)}, ${q(k.tr)}, ${q(k.ok)}, ${q(k.ornek?.[0])}, ${q(k.ornek?.[1])}, ${q(k.ipucu)}, array[${q(g.ad)}, ${q(d.kod)}]) ` +
            `on conflict (id) do update set sira = excluded.sira, en = excluded.en, tr = excluded.tr, okunus = excluded.okunus, ornek_en = excluded.ornek_en, ornek_tr = excluded.ornek_tr, cagrisim = excluded.cagrisim, etiketler = excluded.etiketler;`,
        );
      }
    for (const k of d.kaliplar) {
      const anahtar = `${u.kod}:kalip:${k.en}`;
      satirlar.push(
        `insert into public.kelimeler (id, unite_id, sira, tur, en, tr, not_, etiketler) values (md5(${q(anahtar)})::uuid, '${u.id}', ${sira++}, 'kalip', ${q(k.en)}, ${q(k.tr)}, ${q(k.not)}, array[${q(d.kod)}]) ` +
          `on conflict (id) do update set sira = excluded.sira, en = excluded.en, tr = excluded.tr, not_ = excluded.not_, etiketler = excluded.etiketler;`,
      );
    }
  }
  // Dersler: her ders bir bölüm satırı (önce ünitenin eski bölümleri silinir)
  satirlar.push(`delete from public.unite_bolumleri where unite_id = '${u.id}';`);
  for (const d of u.dersler)
    satirlar.push(`insert into public.unite_bolumleri (unite_id, sira, tur, baslik, veri) values ('${u.id}', ${d.no}, 'ders', ${q(`${u.sira}.${d.no} ${d.baslik}`)}, ${j(d)});`);
}
satirlar.push("\ncommit;");

const hedef = path.resolve(import.meta.dirname, "../../../supabase/seed/icerik.sql");
fs.mkdirSync(path.dirname(hedef), { recursive: true });
fs.writeFileSync(hedef, satirlar.join("\n") + "\n");
console.log(`${UNITELER.length} ünite → ${path.relative(process.cwd(), hedef)} (${satirlar.length} satır)`);

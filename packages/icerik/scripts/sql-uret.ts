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
      `('${u.id}', null, '${u.seviye}', ${u.sira}, '${u.kod}', ${q(u.baslik)}, ${q(u.baslikEn)}, ${q(u.hedefler.join(" "))}, ${j(u.motor.kaliplar.map(([form, pol]) => ({ form, pol })))}, true) ` +
      `on conflict (id) do update set seviye = excluded.seviye, sira = excluded.sira, baslik = excluded.baslik, baslik_en = excluded.baslik_en, ozet = excluded.ozet, gramer = excluded.gramer, yayinda = true, guncelleme = now();`,
  );
  // Kelime kimlikleri sabit: md5('<ünite kodu>:<kelime>') → uuid
  let sira = 0;
  for (const g of u.kelimeGruplari)
    for (const k of g.kelimeler) {
      const anahtar = `${u.kod}:${k.en}`;
      satirlar.push(
        `insert into public.kelimeler (id, unite_id, sira, tur, en, tr, okunus, ornek_en, ornek_tr, cagrisim, etiketler) values ` +
          `(md5(${q(anahtar)})::uuid, '${u.id}', ${sira++}, 'kelime', ${q(k.en)}, ${q(k.tr)}, ${q(k.ok)}, ${q(k.ornek?.[0])}, ${q(k.ornek?.[1])}, ${q(k.ipucu)}, array[${q(g.ad)}]) ` +
          `on conflict (id) do update set sira = excluded.sira, en = excluded.en, tr = excluded.tr, okunus = excluded.okunus, ornek_en = excluded.ornek_en, ornek_tr = excluded.ornek_tr, cagrisim = excluded.cagrisim, etiketler = excluded.etiketler;`,
      );
    }
  for (const k of u.kaliplar) {
    const anahtar = `${u.kod}:kalip:${k.en}`;
    satirlar.push(
      `insert into public.kelimeler (id, unite_id, sira, tur, en, tr, not_) values (md5(${q(anahtar)})::uuid, '${u.id}', ${sira++}, 'kalip', ${q(k.en)}, ${q(k.tr)}, ${q(k.not)}) ` +
        `on conflict (id) do update set sira = excluded.sira, en = excluded.en, tr = excluded.tr, not_ = excluded.not_;`,
    );
  }
  // Bölümler: önce ünitenin eski bölümlerini sil, sonra yaz
  satirlar.push(`delete from public.unite_bolumleri where unite_id = '${u.id}';`);
  const bolum = (s: number, tur: string, baslik: string, veri: unknown) =>
    satirlar.push(`insert into public.unite_bolumleri (unite_id, sira, tur, baslik, veri) values ('${u.id}', ${s}, '${tur}', ${q(baslik)}, ${j(veri)});`);
  let b = 0;
  u.gramer.forEach((g) => bolum(b++, "gramer", g.baslik, g));
  u.diyaloglar.forEach((d) => bolum(b++, "diyalog", d.baslik, d));
  bolum(b++, "okuma", u.okuma.baslik, u.okuma);
  bolum(b++, "alistirma", "Alıştırmalar", u.alistirmalar);
  bolum(b++, "konusma", "Konuşma", u.konusma);
  bolum(b++, "test", "Ünite testi", u.test);
}
satirlar.push("\ncommit;");

const hedef = path.resolve(import.meta.dirname, "../../../supabase/seed/icerik.sql");
fs.mkdirSync(path.dirname(hedef), { recursive: true });
fs.writeFileSync(hedef, satirlar.join("\n") + "\n");
console.log(`${UNITELER.length} ünite → ${path.relative(process.cwd(), hedef)} (${satirlar.length} satır)`);

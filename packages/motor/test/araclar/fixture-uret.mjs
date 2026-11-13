// Prototipin çıktılarından kalıcı test verisi (fixture) üretir.
// Fixture'da Lengedu içeriği yoktur; sadece motorun ürettiği cümleler ve teşhisler.
// Kullanım: npx vite-node test/araclar/fixture-uret.mjs <prototip.html>
import fs from "node:fs";
import { prototipYukle, tohumlu, protoIpucu, hatalar } from "./prototip-yukle.mjs";

const P = prototipYukle(process.argv[2]);
const TAM = { be: true, bePast: true, simple: true, past: true, can: true, will: true, neg: true, q: true };
const out = [];
let i = 0;
for (const [form, pol] of P.ALLC) {
  for (let k = 0; k < 12; k++, i++) {
    const seed = 50000 + i;
    P.setRandom(tohumlu(seed));
    const a = P.genItem(TAM, { form, pol });
    const cevaplar = hatalar(a.en, a.meta).slice(0, 8);
    out.push({
      seed,
      form,
      pol,
      tr: a.tr,
      en: a.en,
      alts: a.alts,
      seg: P.trSeg(a.meta),
      sira: P.orderRows(a),
      kontrol: cevaplar.map((h) => [h, P.matchAns(a, h).ok]),
      teshis: cevaplar.map((h) => [h, P.diagnose(a, h).map(protoIpucu)]),
    });
  }
}
const yol = new URL("../fixtures/prototip.json", import.meta.url);
fs.mkdirSync(new URL(".", yol), { recursive: true });
fs.writeFileSync(yol, JSON.stringify(out));
console.log(`${out.length} örnek yazıldı (${(fs.statSync(yol).size / 1024).toFixed(0)} KB)`);

// Tek seferlik büyük karşılaştırma: prototip ↔ yeni motor.
// Kullanım: node --experimental-strip-types test/araclar/karsilastir.mjs <prototip.html> [adet]
import { prototipYukle, tohumlu, protoIpucu, hatalar } from "./prototip-yukle.mjs";
import * as M from "../../src/index.ts";
import assert from "node:assert/strict";

const [, , yol, adetStr] = process.argv;
const ADET = +(adetStr || 20000);
const P = prototipYukle(yol);
const J = (x) => JSON.parse(JSON.stringify(x));

const AYARLAR = [
  { be: true, bePast: true, simple: true, past: true, can: true, will: true, neg: true, q: true },
  { be: true, simple: true, neg: true },
  { past: true, q: true },
  { can: true, will: true, neg: true, q: true },
  {},
];
let n = 0,
  teshis = 0,
  kontrol = 0;
const kapsam = new Set();

for (let i = 0; i < ADET; i++) {
  const seed = 1000 + i;
  const set = AYARLAR[i % AYARLAR.length];
  const force = i % 3 === 0 ? (([f, p]) => ({ form: f, pol: p }))(M.ALLC[i % M.ALLC.length]) : null;
  P.setRandom(tohumlu(seed));
  const a = P.genItem(set, force);
  const b = M.genItem(set, force, tohumlu(seed));
  assert.deepEqual(J(b), J(a), `üreteç farklı (seed ${seed})`);
  kapsam.add(a.meta.form + "-" + a.meta.pol + "-" + a.meta.s.p);

  assert.deepEqual(J(M.trSeg(b.meta)), J(P.trSeg(a.meta)), `parçalama farklı: ${a.tr}`);
  assert.deepEqual(J(M.orderRows(b)), J(P.orderRows(a)), `kelime sırası farklı: ${a.tr}`);
  assert.equal(M.orderNote(b.meta), P.orderNote(a.meta).replace(/<\/?b>/g, "**"));
  assert.deepEqual(J(M.RULES[M.ruleKey(b.meta)]), J(P.RULES[P.ruleKey(a.meta)]));

  for (const h of [a.en, ...hatalar(a.en, a.meta)]) {
    assert.deepEqual(J(M.matchAns(b, h)), J(P.matchAns(a, h)), `kontrol farklı: "${h}" / ${a.en}`);
    kontrol++;
    const pd = P.diagnose(a, h).map(protoIpucu);
    const md = M.diagnose(b, h);
    assert.deepEqual(J(md), J(pd), `teşhis farklı: "${h}" / ${a.en}`);
    teshis++;
  }
  n++;
}

// Tekrarsız üreteç (son 25 cümle sorulmaz)
P.setRandom(tohumlu(7));
const fresh = M.createFreshGen(tohumlu(7));
const tam = AYARLAR[0];
for (let i = 0; i < 500; i++) assert.deepEqual(J(fresh(tam)), J(P.genFresh(tam)), `genFresh farklı (#${i})`);

// Statik veriler
assert.deepEqual(J(M.CAMP_L), J(P.CAMP_L));
assert.deepEqual(J(M.PK_ALL), J(P.PK_ALL));
assert.deepEqual(J(M.PK_HINT), J(P.PK_HINT));
assert.deepEqual(J(M.RULES), J(P.RULES));

console.log(`✓ ${n} cümle, ${kontrol} cevap kontrolü, ${teshis} teşhis, 500 tekrarsız üretim birebir aynı.`);
console.log(`  Kapsanan kalıp × kutup × kişi: ${kapsam.size} / ${6 * 3 * 5 - 6 * 2} (soruda ben/biz yok)`);

# Türkçeden İngilizce (çalışma adı)

Türk öğrenciler için İngilizce pratik platformu. Farkı şu: hatayı **Türkçe ek yapısı üzerinden** açıklıyor.
Örneğin "yorgun-um'daki -um eki İngilizcede am olur" diyor.

## Şu an ne var?

```
turkce-ingilizce/
├── packages/
│   └── motor/              ← Platformun çekirdeği (TypeScript, saf fonksiyonlar)
│       ├── src/
│       │   ├── turkce.ts     Türkçe çekim: ünlü uyumu, d→t, k→ğ, git→gid, ye→yi
│       │   ├── veri.ts       8 özne, 22 durum, 20 fiil
│       │   ├── uretec.ts     Cümle üreteci (5.600+ cümle), tekrarsız üreteç
│       │   ├── kontrol.ts    Cevap kontrolü: kısaltmalar, yazım hatası toleransı
│       │   ├── kurallar.ts   18 kalıbın kural açıklaması
│       │   ├── teshis.ts     Hata teşhisi (Türkçe ek mantığıyla)
│       │   ├── parcala.ts    "Türkçeyi parçala": kök / ek / kişi
│       │   ├── siralama.ts   Kelime sırası şeması
│       │   └── yol.ts        Cümle yolu: 19 seviye
│       └── test/
│           ├── turkce.test.ts      Okunabilir örnekler (uyumadık, gideceğim, yiyebilirim…)
│           ├── prototip.test.ts    Eski defterle birebir uyum (216 örnek)
│           └── araclar/            Prototiple büyük karşılaştırma araçları
└── apps/web/               ← Next.js uygulaması (ana sayfa + pratik)
    ├── app/page.tsx          Ana sayfa: canlı "ek → kelime" gösterisi, 3 adım, cümle yolu
    ├── app/pratik/           Cümle yolu (19 seviye) + serbest antrenman + kelime ara + ek rehberi
    └── components/           SoruKarti, Parcalama, KelimeSirasi, Ogretmen, Hero…
```

İlerleme şimdilik tarayıcıda (localStorage, `ti:` anahtarları). Supabase 4. haftada gelecek.

Motor **Lengedu içeriği içermiyor**. Hepsi Oğuz + Claude tarafından üretilen orijinal kod ve veri.

## Komutlar

```bash
npm install                      # ilk seferde (kök klasörde)
npm test                         # bütün testler
npm run typecheck                # tip kontrolü
npm run dev -w @ti/web           # siteyi bilgisayarda aç: http://localhost:3000
npm run build -w @ti/web         # yayın derlemesi
```

## Vercel ayarı

- Import: `oguztekinispir/English-Book`
- **Root Directory:** `apps/web` (Framework: Next.js, gerisi varsayılan)
- Domain: `ingilizce.objectflowtech.com` → DNS'e `CNAME ingilizce → cname.vercel-dns.com`

Prototiple büyük karşılaştırma (prototip dosyası gerekir, depoda yok):

```bash
cd packages/motor
npx vite-node test/araclar/karsilastir.mjs /yol/ingilizce-defteri.html 20000
```

Son çalıştırma: 20.000 cümle, 267.001 cevap kontrolü, 267.001 teşhis → **hepsi birebir aynı**.

## Motoru kullanmak (kısa örnek)

```ts
import { createFreshGen, matchAns, diagnose, trSeg, RULES, ruleKey } from "@ti/motor";

const yeniCumle = createFreshGen();               // her kullanıcı için bir tane
const soru = yeniCumle({ be: true, simple: true, neg: true, q: true });
soru.tr;                                          // "Sen kahve içmezsin."
const sonuc = matchAns(soru, "You dont drink coffee");
if (!sonuc.ok) {
  const neden = diagnose(soru, "You not drink coffee");   // Türkçe açıklamalar
  const kural = RULES[ruleKey(soru.meta)];                // formül + kural
}
trSeg(soru.meta);                                 // [["Sen","kim → You","pers"]], …
```

## Yol haritası (haftada 4–6 saat)

| Hafta | İş | Sonuç |
|---|---|---|
| 1 ✅ | Motoru prototipten çıkar, TypeScript paketi + testler | Bu depo |
| 2 ✅ | GitHub deposu, Next.js iskeleti, Vercel'e yayın. Cümle motoru + cümle yolu sayfası. Giriş yok, ilerleme tarayıcıda. | **Öğretmene gösterilebilen ilk link** |
| 3 | Kendi A1 kelime seti (Lengedu'suz) + Günlük tekrar (SRS) + 3 oyun | Temiz sürüm tamam |
| 4 | Supabase: giriş (e-posta / Google), bulut kayıt, `attempts` tablosu | Telefon + bilgisayar senkron |
| 5 | Bugün sayfası, seri, yazma günlüğü. Yapay zekâ (Anthropic API, sunucu tarafında, kullanıcı başına kota) | Prototipteki her şey yeni platformda |
| 6+ | 10–20 test kullanıcısı, geri bildirim. Sonra: öğretmen paneli mi, bireysel mi? | Doğrulama |

## Alınan kararlar

- **14 Kasım 2026:** Doğrudan Next.js + Supabase'e geçiliyor (ara adım olarak statik site yok).
- **14 Kasım 2026:** Öğretmen platformu ücretsiz kullanacak, ticari bir bağ yok.
- **14 Kasım 2026:** Hedef kitle (B2B / B2C) doğrulamadan sonra seçilecek.
- **14 Kasım 2026:** Haftada 4–6 saat. Kişisel İngilizce çalışma önceliklidir.

## Açık sorular

- Ürün adı ve alan adı (domain)
- Kelime seti: A1 genel müfredatta hangi konular? (öneri: tanışma, duygular, aile, iş, ev, yemek, zaman, yol tarifi, alışveriş, sağlık)
- Supabase veri bölgesi: KVKK için AB (Frankfurt) öneriliyor
- Konuşma / telaffuz özelliği ne zaman?

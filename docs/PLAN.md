# Platform planı (canlı doküman)

Son güncelleme: 14 Kasım 2026. Yaptıkça revize edilir.

## Ürün

Türkçe konuşanlar için A1–A2 İngilizce platformu. Farkı: hatayı Türkçe ek yapısı üzerinden açıklar,
öğretmen öğrencinin hangi kuralda zorlandığını görür.

## Roller

| Rol | Ne yapar |
|---|---|
| Öğrenci | Üniteleri çalışır, pratik yapar, ödev yapar. Öğretmensiz de kayıt olabilir. |
| Öğretmen | Davet koduyla öğrenci bağlar, ilerlemeyi görür, ödev verir, kendi içeriğini ekler, dersi ortak ekranla yapar. |
| Yönetici | Sistem içeriğini (24 ünite) yönetir, hesapları yönetir. |
| Kurum (ileride) | Dil okulu; altında birden çok öğretmen. Tablolar hazır, arayüz sonra. |

Bağlanma: öğretmenin 6 haneli kodu (`koda_baglan('K7M2QX')`). Bir öğrencinin birden çok öğretmeni olabilir.

## Kararlar

| Tarih | Karar |
|---|---|
| 14.11.2026 | Next.js + Supabase (AB bölgesi), Vercel |
| 14.11.2026 | Ders modu: ortak ekran (öğretmen sayfayı açar, öğrencide aynısı açılır). Görüntü Meet/Zoom'da. Canlı video ileride. |
| 14.11.2026 | Her yaştan öğrenci olabilir → 18 yaş altı veli onayı adımı (KVKK) |
| 14.11.2026 | Öğrenci öğretmensiz kayıt olabilir; öğretmene kodla bağlanır |
| 14.11.2026 | Öğretmen kendi ünite / kelime / alıştırmasını ekleyebilir (sadece kendi öğrencileri görür) |
| 14.11.2026 | İçerik taslağını yapay zekâ yazar, Oğuz öğretmene kontrol ettirir. Lengedu ya da başka kitaptan alıntı yok. |
| 14.11.2026 | Hedef kitle (bireysel / öğretmen / kurum) doğrulamadan sonra netleşir |

## Müfredat

- A1: 12 ünite, ~650 kelime · A2: 12 ünite, ~850 kelime → ~1.500 kelime + ~450 kalıp
- Her ünite: kelime kartları (TR, okunuş, örnek, ses, 💡 çağrışım) · kalıplar · 2 diyalog + 1 okuma (satır satır çeviri + "Çöz") ·
  gramer (Türkçe ek mantığıyla) · motor alıştırması (ünitenin kelimeleriyle) · konuşma soruları · ekstra alıştırma · mini test
- İçerik depoda dosya olarak tutulur (`icerik/`), veritabanına yüklenir. Ses: bir kere yapay sesle üretilip saklanır.

## Motorun büyümesi (A1–A2)

Var: am/is/are · geniş zaman · can · was/were · geçmiş zaman · will (olumlu / olumsuz / soru)

Eklenecek: -ıyor (present continuous) · there is/are · have/has · soru kelimeleri · going to ·
karşılaştırma · nesne zamirleri · should / must / have to · some/any, much/many · present perfect (A2 sonu)

## Veri yapısı (`supabase/migrations/0001_temel.sql`)

| Tablo | İçerik |
|---|---|
| `profiller` | ad, rol, davet kodu, doğum yılı, veli onayı, KVKK onayı |
| `baglantilar` | öğretmen ↔ öğrenci |
| `kurumlar`, `kurum_uyeleri` | ileride |
| `uniteler`, `kelimeler`, `unite_bolumleri` | içerik. `sahip_id` boş = sistem, dolu = öğretmenin |
| `cevaplar` | **her cevap**: kaynak, kural, kelime, doğru/yanlış, zaman. Öğretmen ekranı buradan beslenir |
| `tekrar_kartlari` | aralıklı tekrar (0-1-2-4-7-14 gün) |
| `ogrenci_durumu` | cümle yolu seviyesi, ünite ilerlemesi |
| `odevler`, `odev_atamalari` | ödev ve kime verildiği |
| `gunluk` | yazma günlüğü, yapay zekâ düzeltmesi, öğretmen yorumu |
| görünüm `ogrenci_ozetleri` | öğretmen ekranı: son çalışma, haftalık cevap/doğru, yol seviyesi |
| görünüm `zayif_kurallar` | öğrencinin son 30 gündeki hata sayısı, kural kural |

Güvenlik (RLS) testi: `supabase/tests/0001_guvenlik_testi.sql` (öğrenci / öğretmen / yabancı senaryoları).

## Aşamalar (haftada 4–6 saat)

| Aşama | İçerik | Süre |
|---|---|---|
| 1. Temel | Giriş / kayıt (rol, yaş, KVKK), davet kodu, cevap kaydı, öğrenci "Bugün", basit öğretmen ekranı, A1 ilk 4 ünite | ~6 hafta |
| 2. A1 tamam | 12 ünite, ödev, tekrar kartları, oyunlar, motor genişlemesi (A1 kalıpları) | ~8 hafta |
| 3. A2 | 12 ünite + motorun A2 kalıpları, ortak ekran ders modu | ~10 hafta |
| 4. Sonra | Yapay zekâ koçu, ödeme (iyzico), kurumlar, canlı video | — |

## Açık konular

- Ürün adı ve alan adı
- Ödeme modeli (öğretmen başı / öğrenci başı / ücretsiz + ücretli özellik)
- Yapay ses servisi seçimi

## Güncelleme (Kasım 2026): ders yapısı, tekrar, oyun, gramer

- **A1 = 14 ünite, 53 ders.** Her ünite 3-4 ders; her ders ~30 dakika, en çok 30 yeni kelime. Son ders tekrar + ünite testi.
- Ders sayfası: `/uniteler/<ünite>/<no>`. Sadece dersin içerdiği bölümler görünür. İçerik testi her dersin metinlerinde o derse kadar öğretilmemiş kelime olmadığını kontrol eder.
- **Günlük tekrar** (`/tekrar`): Leitner 0-1-2-4-7-14 gün, oturumda 25 tekrar + 8 yeni kart, bilemediğin kart oturumda 2 kez daha gelir. Kartlar sadece açılan derslerden gelir. Dinleme modu: EN → TR → EN, ekran açık kalır. Giriş yapılmışsa `tekrar_kartlari` tablosuna yazılır (kimlik = md5('<ünite>:<kelime>')::uuid).
- **Oyun** (`/oyun`): Eşleştir (süre + rekor), Dinle-bul (3 can), Eki bul (10 soru). Oyunlarda bilinemeyen kelime bugünkü tekrara düşer.
- **Gramer** (`/gramer`): ek anahtarı, kelime kelime çöz, derslerdeki gramer konuları, Türkçe ek rehberi.
- Göç `0004_dersler.sql`: `unite_bolumleri.tur` içine 'ders', `cevaplar.ders` sütunu.
- Sırada: öğrenci "Bugün" sayfası (günlük hedefler + seri), Ünite 2.

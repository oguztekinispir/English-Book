-- 0006 · "Bugün" sayfası: günlük hedef ve seviye testi sonucu
-- ogrenci_durumu'nun mevcut RLS kuralları geçerli: öğrenci kendi satırını yazar, öğretmeni okur.
alter table public.ogrenci_durumu
  add column if not exists gunluk_hedef   int not null default 20,
  add column if not exists seviye_unite   int,
  add column if not exists seviye_puanlar jsonb,
  add column if not exists seviye_tarih   timestamptz;

alter table public.ogrenci_durumu drop constraint if exists ogrenci_durumu_gunluk_hedef_check;
alter table public.ogrenci_durumu add constraint ogrenci_durumu_gunluk_hedef_check check (gunluk_hedef between 5 and 100);
alter table public.ogrenci_durumu drop constraint if exists ogrenci_durumu_seviye_unite_check;
alter table public.ogrenci_durumu add constraint ogrenci_durumu_seviye_unite_check check (seviye_unite is null or seviye_unite between 1 and 15);

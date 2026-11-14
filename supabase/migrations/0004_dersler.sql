-- 0004 · Ünite → ders yapısı
-- Ünite bölümleri artık ders ders saklanabilir; cevaplarda hangi derste olduğu tutulur.
alter table public.unite_bolumleri drop constraint if exists unite_bolumleri_tur_check;
alter table public.unite_bolumleri add constraint unite_bolumleri_tur_check
  check (tur in ('ders', 'diyalog', 'okuma', 'gramer', 'konusma', 'alistirma', 'test'));

alter table public.cevaplar add column if not exists ders text;   -- 'a1-01-2'
create index if not exists cevaplar_ders_idx on public.cevaplar (ogrenci_id, ders) where ders is not null;

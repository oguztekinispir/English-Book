-- 0007 · Ödevler: kurallar sıkılaştırıldı
-- Tablolar ve temel kurallar 0001'de var. Burada:
-- 1) Öğrenci kendi atamasında sadece durum / bitiş değiştirebilir (ödevi ya da kişiyi değiştiremez).
-- 2) Başlık ve not uzunluk sınırı, hedef türü kontrolü.

create or replace function public.atama_koruma() returns trigger
language plpgsql as $$
begin
  if not public.odev_sahibi_mi(old.odev_id) then
    new.odev_id    := old.odev_id;
    new.ogrenci_id := old.ogrenci_id;
    if new.durum = 'bitti' and old.durum <> 'bitti' then new.bitis := now(); end if;
  end if;
  return new;
end $$;

drop trigger if exists atama_koruma on public.odev_atamalari;
create trigger atama_koruma before update on public.odev_atamalari
  for each row execute function public.atama_koruma();

drop policy if exists "atama ogrenci guncelle" on public.odev_atamalari;
create policy "atama ogrenci guncelle" on public.odev_atamalari for update
  using (ogrenci_id = auth.uid()) with check (ogrenci_id = auth.uid());

alter table public.odevler drop constraint if exists odevler_baslik_uzunluk;
alter table public.odevler add constraint odevler_baslik_uzunluk check (length(baslik) between 1 and 120);
alter table public.odevler drop constraint if exists odevler_aciklama_uzunluk;
alter table public.odevler add constraint odevler_aciklama_uzunluk check (aciklama is null or length(aciklama) <= 500);
alter table public.odevler drop constraint if exists odevler_hedef_tur;
alter table public.odevler add constraint odevler_hedef_tur check (hedef ->> 'tur' in ('ders', 'tekrar', 'motor', 'unite', 'yol'));

create index if not exists odevler_ogretmen_idx on public.odevler (ogretmen_id, olusturma desc);
grant select, insert, update, delete on public.odevler, public.odev_atamalari to authenticated;

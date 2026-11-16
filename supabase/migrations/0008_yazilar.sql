-- 0008 · Yazma derslerinde öğrencinin kendi yazdığı metinler; öğretmen okur ve not bırakır.
create table if not exists public.yazilar (
  id            uuid primary key default gen_random_uuid(),
  ogrenci_id    uuid not null default auth.uid() references public.profiller (id) on delete cascade,
  ders          text not null check (length(ders) between 1 and 80),
  metin         text not null check (length(metin) between 1 and 4000),
  olusturma     timestamptz not null default now(),
  ogretmen_notu text check (ogretmen_notu is null or length(ogretmen_notu) <= 1000),
  not_tarihi    timestamptz
);
create index if not exists yazilar_ogrenci_idx on public.yazilar (ogrenci_id, olusturma desc);

alter table public.yazilar enable row level security;

drop policy if exists "yazi ekle" on public.yazilar;
create policy "yazi ekle" on public.yazilar for insert with check (ogrenci_id = auth.uid());
drop policy if exists "yazi gor" on public.yazilar;
create policy "yazi gor" on public.yazilar for select using (ogrenci_id = auth.uid() or public.ogretmeni_mi(ogrenci_id) or public.yonetici_mi());
drop policy if exists "yazi ogretmen notu" on public.yazilar;
create policy "yazi ogretmen notu" on public.yazilar for update using (public.ogretmeni_mi(ogrenci_id)) with check (public.ogretmeni_mi(ogrenci_id));
drop policy if exists "yazi sil" on public.yazilar;
create policy "yazi sil" on public.yazilar for delete using (ogrenci_id = auth.uid());

-- Öğretmen sadece notunu değiştirebilir; metin, ders ve sahibi sabit
create or replace function public.yazi_koruma() returns trigger
language plpgsql as $$
begin
  new.ogrenci_id := old.ogrenci_id;
  new.ders       := old.ders;
  new.metin      := old.metin;
  new.olusturma  := old.olusturma;
  if new.ogretmen_notu is distinct from old.ogretmen_notu then new.not_tarihi := now(); end if;
  return new;
end $$;
drop trigger if exists yazi_koruma on public.yazilar;
create trigger yazi_koruma before update on public.yazilar for each row execute function public.yazi_koruma();

grant select, insert, update, delete on public.yazilar to authenticated;

-- 0005 · Hesabım ve öğretmen notları
-- 1) Öğretmenin öğrencisi hakkında kendine tuttuğu notlar (öğrenci görmez)
create table if not exists public.ogretmen_notlari (
  id          bigint generated always as identity primary key,
  ogretmen_id uuid not null references public.profiller (id) on delete cascade default auth.uid(),
  ogrenci_id  uuid not null references public.profiller (id) on delete cascade,
  metin       text not null check (length(metin) between 1 and 2000),
  olusturma   timestamptz not null default now()
);
create index if not exists ogretmen_notlari_idx on public.ogretmen_notlari (ogretmen_id, ogrenci_id, olusturma desc);
alter table public.ogretmen_notlari enable row level security;
drop policy if exists "not ogretmen" on public.ogretmen_notlari;
create policy "not ogretmen" on public.ogretmen_notlari for all
  using (ogretmen_id = auth.uid())
  with check (ogretmen_id = auth.uid() and public.ogretmeni_mi(ogrenci_id));
grant select, insert, delete on public.ogretmen_notlari to authenticated;

-- 2) Hesabı silme (KVKK m.11/m.7): kullanıcı kendi hesabını siler.
--    auth.users silinince profiller ve ona bağlı her şey (cevaplar, kartlar, bağlantılar, notlar) cascade ile silinir.
create or replace function public.hesabimi_sil() returns void
language plpgsql security definer set search_path = public, auth as $$
declare
  ben uuid := auth.uid();
begin
  if ben is null then
    raise exception 'Giriş yapılmamış';
  end if;
  delete from auth.users where id = ben;
end $$;
revoke all on function public.hesabimi_sil() from public, anon;
grant execute on function public.hesabimi_sil() to authenticated;

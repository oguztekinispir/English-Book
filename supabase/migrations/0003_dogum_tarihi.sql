-- 0003 · Doğum yılı yerine tam doğum tarihi (gün / ay / yıl)
alter table public.profiller add column if not exists dogum_tarihi date;

create or replace function public.yeni_kullanici() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r text := coalesce(new.raw_user_meta_data ->> 'rol', 'ogrenci');
  d date;
begin
  if r not in ('ogrenci', 'ogretmen') then r := 'ogrenci'; end if;
  begin
    d := nullif(new.raw_user_meta_data ->> 'dogum_tarihi', '')::date;
  exception when others then d := null;
  end;
  if d is not null and (d < date '1900-01-01' or d > current_date) then d := null; end if;
  insert into public.profiller (id, ad, rol, davet_kodu, dogum_tarihi, dogum_yili, veli_eposta, kvkk_onayi_at)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'ad', ''), 80),
    r,
    case when r = 'ogretmen' then public.yeni_davet_kodu() end,
    d,
    extract(year from d)::int,
    nullif(new.raw_user_meta_data ->> 'veli_eposta', ''),
    case when (new.raw_user_meta_data ->> 'kvkk') = 'true' then now() end
  );
  return new;
end $$;

-- Yaş (tam) — 18 yaş altı kontrolü için
create or replace function public.yas(p public.profiller) returns int
language sql stable as $$
  select case when p.dogum_tarihi is null then null
              else extract(year from age(current_date, p.dogum_tarihi))::int end
$$;

-- 0002 · Kayıtta veli e-postasını da profile yaz (18 yaş altı)
create or replace function public.yeni_kullanici() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r text := coalesce(new.raw_user_meta_data ->> 'rol', 'ogrenci');
  y int;
begin
  if r not in ('ogrenci', 'ogretmen') then r := 'ogrenci'; end if;
  begin
    y := nullif(new.raw_user_meta_data ->> 'dogum_yili', '')::int;
  exception when others then y := null;
  end;
  if y is not null and (y < 1900 or y > 2100) then y := null; end if;
  insert into public.profiller (id, ad, rol, davet_kodu, dogum_yili, veli_eposta, kvkk_onayi_at)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'ad', ''), 80),
    r,
    case when r = 'ogretmen' then public.yeni_davet_kodu() end,
    y,
    nullif(new.raw_user_meta_data ->> 'veli_eposta', ''),
    case when (new.raw_user_meta_data ->> 'kvkk') = 'true' then now() end
  );
  return new;
end $$;

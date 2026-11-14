-- ============================================================================
-- TEST HESAPLARI: bir öğretmen + ona bağlı bir öğrenci (ve örnek çalışma verisi)
-- ÖNCE Supabase → Authentication → Users → "Add user" → "Create new user" ile
-- iki kullanıcı aç ("Auto Confirm User" işaretli olsun):
--     test.ogretmen@example.com   /  (bir şifre)
--     test.ogrenci@example.com    /  (bir şifre)
-- SONRA bu dosyanın tamamını SQL Editor'de çalıştır. Tekrar çalıştırmak güvenli.
-- ============================================================================
do $$
declare
  ogretmen uuid;
  ogrenci  uuid;
  i int;
begin
  select id into ogretmen from auth.users where email = 'test.ogretmen@example.com';
  select id into ogrenci  from auth.users where email = 'test.ogrenci@example.com';
  if ogretmen is null or ogrenci is null then
    raise exception 'Önce iki kullanıcıyı Authentication > Users > Add user ile aç (test.ogretmen@example.com ve test.ogrenci@example.com).';
  end if;

  -- Rol değişikliğini engelleyen korumayı bir anlığına kapat
  alter table public.profiller disable trigger profil_koruma;
  update public.profiller
     set rol = 'ogretmen', ad = 'Test Öğretmen',
         davet_kodu = coalesce(davet_kodu, public.yeni_davet_kodu()),
         kvkk_onayi_at = coalesce(kvkk_onayi_at, now()),
         ayarlar = coalesce(ayarlar, '{}'::jsonb) || '{"okul":"Test okulu"}'::jsonb
   where id = ogretmen;
  update public.profiller
     set rol = 'ogrenci', ad = 'Test Öğrenci',
         dogum_tarihi = date '2000-01-01', dogum_yili = 2000,
         kvkk_onayi_at = coalesce(kvkk_onayi_at, now())
   where id = ogrenci;
  alter table public.profiller enable trigger profil_koruma;

  -- Öğretmen ↔ öğrenci bağlantısı
  insert into public.baglantilar (ogretmen_id, ogrenci_id) values (ogretmen, ogrenci)
  on conflict (ogretmen_id, ogrenci_id) do update set durum = 'aktif';

  -- Örnek çalışma verisi: son 10 güne yayılmış cevaplar (öğretmen paneli boş görünmesin)
  delete from public.cevaplar where ogrenci_id = ogrenci and soru like 'TEST:%';
  for i in 0..59 loop
    insert into public.cevaplar (ogrenci_id, kaynak, kural, dogru, soru, cevap, beklenen, zaman)
    values (
      ogrenci,
      (array['tekrar','alistirma','oyun','yol','test'])[1 + i % 5],
      case when i % 5 = 3 then (array['be-pos','simple-pos'])[1 + i % 2] end,
      i % 4 <> 0,
      'TEST: ' || (array['merhaba','annem','Ben öğretmen değilim.','O evde mi?','mühendis'])[1 + i % 5],
      case when i % 4 = 0 then (array['helo','my mom','I not teacher.','She at home?','a engineer'])[1 + i % 5] end,
      (array['hello','my mother','I am not a teacher.','Is she at home?','an engineer'])[1 + i % 5],
      now() - ((i % 10) || ' days')::interval - ((i * 7) || ' minutes')::interval
    );
  end loop;
end $$;

-- 0004 göçü çalıştırıldıysa örnek cevaplara ders kodu ekle (ders tablosu dolsun)
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'cevaplar' and column_name = 'ders') then
    update public.cevaplar c
       set ders = (array['a1-01-1','a1-01-2','a1-02-1','a1-02-3','a1-02-2'])[1 + (c.id % 5)::int]
     where c.soru like 'TEST:%';
  end if;
end $$;

-- Sonuç: davet kodu ve bağlantı
select p.ad, p.rol, p.davet_kodu, u.email
  from public.profiller p join auth.users u on u.id = p.id
 where u.email in ('test.ogretmen@example.com', 'test.ogrenci@example.com');

-- =====================================================================
-- 0001 · Temel yapı: roller, öğretmen–öğrenci bağlantısı, içerik,
--        cevap kaydı, tekrar kartları, ödevler, yazma günlüğü
-- Supabase (Postgres 15+). SQL Editor'e yapıştırıp çalıştırılabilir.
-- Bütün tablolarda satır bazlı güvenlik (RLS) açık:
--   öğrenci sadece kendi verisini, öğretmen sadece kendi öğrencilerini görür.
-- =====================================================================

-- ---------- 1. Kullanıcılar ----------------------------------------------

create table public.profiller (
  id            uuid primary key references auth.users (id) on delete cascade,
  ad            text not null default '',
  rol           text not null default 'ogrenci' check (rol in ('ogrenci', 'ogretmen', 'yonetici')),
  -- Öğretmenin öğrencilerine verdiği bağlanma kodu (sadece öğretmenlerde dolu)
  davet_kodu    text unique,
  dogum_yili    int check (dogum_yili between 1900 and 2100),
  -- 18 yaş altı: veli onayı (KVKK)
  veli_eposta   text,
  veli_onayi_at timestamptz,
  kvkk_onayi_at timestamptz,
  ayarlar       jsonb not null default '{}'::jsonb,
  olusturma     timestamptz not null default now()
);
comment on table public.profiller is 'Her kullanıcının profili. Rol: ogrenci / ogretmen / yonetici.';

-- Karışmayan karakterlerle 6 haneli kod (0/O, 1/I yok)
create or replace function public.yeni_davet_kodu() returns text
language plpgsql as $$
declare
  harfler constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  k text;
begin
  loop
    k := '';
    for i in 1..6 loop
      k := k || substr(harfler, 1 + floor(random() * length(harfler))::int, 1);
    end loop;
    exit when not exists (select 1 from public.profiller where davet_kodu = k);
  end loop;
  return k;
end $$;

-- Kayıt olunca profil otomatik oluşur. Rol sadece ogrenci / ogretmen seçilebilir;
-- yonetici rolü elle verilir.
create or replace function public.yeni_kullanici() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r text := coalesce(new.raw_user_meta_data ->> 'rol', 'ogrenci');
begin
  if r not in ('ogrenci', 'ogretmen') then r := 'ogrenci'; end if;
  insert into public.profiller (id, ad, rol, davet_kodu, dogum_yili, kvkk_onayi_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'ad', ''),
    r,
    case when r = 'ogretmen' then public.yeni_davet_kodu() end,
    nullif(new.raw_user_meta_data ->> 'dogum_yili', '')::int,
    case when (new.raw_user_meta_data ->> 'kvkk') = 'true' then now() end
  );
  return new;
end $$;

create trigger kayit_sonrasi_profil
  after insert on auth.users
  for each row execute function public.yeni_kullanici();

-- Kullanıcı kendi rolünü / kodunu değiştiremesin
create or replace function public.profil_koruma() returns trigger
language plpgsql as $$
begin
  if not public.yonetici_mi() then
    new.rol := old.rol;
    new.davet_kodu := old.davet_kodu;
    new.veli_onayi_at := old.veli_onayi_at;
  end if;
  return new;
end $$;

-- ---------- 2. Kurumlar (ileride: dil okulları) ---------------------------

create table public.kurumlar (
  id        uuid primary key default gen_random_uuid(),
  ad        text not null,
  olusturma timestamptz not null default now()
);

create table public.kurum_uyeleri (
  kurum_id    uuid references public.kurumlar (id) on delete cascade,
  kullanici_id uuid references public.profiller (id) on delete cascade,
  rol         text not null default 'ogretmen' check (rol in ('yonetici', 'ogretmen')),
  primary key (kurum_id, kullanici_id)
);

-- ---------- 3. Öğretmen – öğrenci bağlantısı -----------------------------

create table public.baglantilar (
  ogretmen_id uuid references public.profiller (id) on delete cascade,
  ogrenci_id  uuid references public.profiller (id) on delete cascade,
  durum       text not null default 'aktif' check (durum in ('aktif', 'ayrildi')),
  olusturma   timestamptz not null default now(),
  primary key (ogretmen_id, ogrenci_id),
  check (ogretmen_id <> ogrenci_id)
);
create index on public.baglantilar (ogrenci_id);

-- Yardımcılar (RLS içinde kullanılır; security definer → özyineleme yok)
create or replace function public.yonetici_mi() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiller where id = auth.uid() and rol = 'yonetici')
$$;

create or replace function public.ogretmeni_mi(ogrenci uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from baglantilar
    where ogretmen_id = auth.uid() and ogrenci_id = ogrenci and durum = 'aktif'
  )
$$;

-- Öğrencinin bağlı olduğu öğretmenler
create or replace function public.ogretmenlerim() returns setof uuid
language sql stable security definer set search_path = public as $$
  select ogretmen_id from baglantilar where ogrenci_id = auth.uid() and durum = 'aktif'
$$;

-- Öğrenci, öğretmeninin verdiği kodla bağlanır
create or replace function public.koda_baglan(kod text) returns json
language plpgsql security definer set search_path = public as $$
declare
  t profiller;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapmalısın';
  end if;
  select * into t from profiller
  where davet_kodu = upper(trim(kod)) and rol = 'ogretmen';
  if not found then
    raise exception 'Bu kodla bir öğretmen bulunamadı';
  end if;
  if t.id = auth.uid() then
    raise exception 'Kendi kodunla bağlanamazsın';
  end if;
  insert into baglantilar (ogretmen_id, ogrenci_id)
  values (t.id, auth.uid())
  on conflict (ogretmen_id, ogrenci_id) do update set durum = 'aktif';
  return json_build_object('ogretmen_id', t.id, 'ad', t.ad);
end $$;

-- Öğretmen yeni kod alabilir (eski kod geçersiz olur, mevcut öğrenciler kalır)
create or replace function public.davet_kodunu_yenile() returns text
language plpgsql security definer set search_path = public as $$
declare k text;
begin
  if not exists (select 1 from profiller where id = auth.uid() and rol = 'ogretmen') then
    raise exception 'Sadece öğretmenler kod alabilir';
  end if;
  k := yeni_davet_kodu();
  update profiller set davet_kodu = k where id = auth.uid();
  return k;
end $$;

create trigger profil_koruma before update on public.profiller
  for each row execute function public.profil_koruma();

-- ---------- 4. İçerik ------------------------------------------------------
-- sahip_id NULL  → sistem içeriği (herkes görür, sadece yönetici düzenler)
-- sahip_id dolu  → öğretmenin kendi içeriği (kendisi + öğrencileri görür)

create table public.uniteler (
  id            uuid primary key default gen_random_uuid(),
  sahip_id      uuid references public.profiller (id) on delete cascade,
  seviye        text not null check (seviye in ('A1', 'A2', 'B1')),
  sira          int not null default 0,
  kod           text unique,            -- sistem üniteleri için: 'a1-01'
  baslik        text not null,           -- 'Tanışma'
  baslik_en     text,                    -- 'Meeting people'
  ozet          text,
  gramer        jsonb not null default '[]'::jsonb,  -- motor kalıpları: [{"form":"be","pol":"pos"}]
  yayinda       boolean not null default false,
  olusturma     timestamptz not null default now(),
  guncelleme    timestamptz not null default now()
);
create index on public.uniteler (seviye, sira);

create table public.kelimeler (
  id         uuid primary key default gen_random_uuid(),
  unite_id   uuid not null references public.uniteler (id) on delete cascade,
  sira       int not null default 0,
  tur        text not null default 'kelime' check (tur in ('kelime', 'kalip')),
  en         text not null,
  tr         text not null,
  okunus     text,
  ornek_en   text,
  ornek_tr   text,
  cagrisim   text,          -- 💡 Türkçe çağrışım
  not_       text,
  ses_url    text,
  etiketler  text[] not null default '{}'   -- 'fiil', 'sifat', 'yer' … (motor için)
);
create index on public.kelimeler (unite_id, sira);

-- Diyalog, okuma metni, konuşma soruları, alıştırmalar: esnek yapı (jsonb)
create table public.unite_bolumleri (
  id        uuid primary key default gen_random_uuid(),
  unite_id  uuid not null references public.uniteler (id) on delete cascade,
  sira      int not null default 0,
  tur       text not null check (tur in ('diyalog', 'okuma', 'gramer', 'konusma', 'alistirma', 'test')),
  baslik    text,
  veri      jsonb not null    -- türe göre: satırlar, sorular, seçenekler …
);
create index on public.unite_bolumleri (unite_id, sira);

-- ---------- 5. Öğrencinin ilerlemesi ---------------------------------------

-- Her cevap tek satır. Öğretmen ekranı, zayıf nokta ve "Bugün" buradan beslenir.
create table public.cevaplar (
  id          bigint generated always as identity primary key,
  ogrenci_id  uuid not null references public.profiller (id) on delete cascade default auth.uid(),
  kaynak      text not null check (kaynak in ('yol', 'motor', 'tekrar', 'oyun', 'alistirma', 'test', 'ders')),
  kural       text,          -- motor kuralı: 'simple-neg'
  kelime_id   uuid references public.kelimeler (id) on delete set null,
  unite_id    uuid references public.uniteler (id) on delete set null,
  dogru       boolean not null,
  soru        text,          -- 'Sen kahve içmezsin.'
  cevap       text,          -- öğrencinin yazdığı
  beklenen    text,
  sure_ms     int,
  zaman       timestamptz not null default now()
);
create index on public.cevaplar (ogrenci_id, zaman desc);
create index on public.cevaplar (ogrenci_id, kural) where kural is not null;

-- Aralıklı tekrar (Leitner: 0-1-2-4-7-14 gün)
create table public.tekrar_kartlari (
  ogrenci_id uuid not null references public.profiller (id) on delete cascade default auth.uid(),
  kelime_id  uuid not null references public.kelimeler (id) on delete cascade,
  kutu       int not null default 0 check (kutu between 0 and 5),
  sonraki    date not null default current_date,
  guncelleme timestamptz not null default now(),
  primary key (ogrenci_id, kelime_id)
);
create index on public.tekrar_kartlari (ogrenci_id, sonraki);

-- Cümle yolu seviyesi, ünite ilerlemesi vb.
create table public.ogrenci_durumu (
  ogrenci_id uuid primary key references public.profiller (id) on delete cascade default auth.uid(),
  yol_seviye int not null default 0,
  yol_en_ust int not null default 0,
  unite_ilerleme jsonb not null default '{}'::jsonb,   -- {"<unite_id>": {"kelime":0.6,"test":5}}
  guncelleme timestamptz not null default now()
);

-- ---------- 6. Ödevler ------------------------------------------------------

create table public.odevler (
  id          uuid primary key default gen_random_uuid(),
  ogretmen_id uuid not null references public.profiller (id) on delete cascade default auth.uid(),
  baslik      text not null,
  aciklama    text,
  -- {"tur":"unite","unite_id":"…"} | {"tur":"yol","seviye":7} | {"tur":"motor","kural":"simple-neg","adet":15}
  hedef       jsonb not null,
  son_tarih   date,
  olusturma   timestamptz not null default now()
);

create table public.odev_atamalari (
  odev_id    uuid references public.odevler (id) on delete cascade,
  ogrenci_id uuid references public.profiller (id) on delete cascade,
  durum      text not null default 'bekliyor' check (durum in ('bekliyor', 'basladi', 'bitti')),
  bitis      timestamptz,
  primary key (odev_id, ogrenci_id)
);
create index on public.odev_atamalari (ogrenci_id);

-- ---------- 7. Yazma günlüğü ------------------------------------------------

create table public.gunluk (
  id              bigint generated always as identity primary key,
  ogrenci_id      uuid not null references public.profiller (id) on delete cascade default auth.uid(),
  metin           text not null check (length(metin) <= 500),
  yz_duzeltme     text,     -- yapay zekâ düzeltmesi
  ogretmen_yorumu text,
  zaman           timestamptz not null default now()
);
create index on public.gunluk (ogrenci_id, zaman desc);

-- =====================================================================
-- Satır bazlı güvenlik (RLS)
-- =====================================================================
alter table public.profiller        enable row level security;
alter table public.kurumlar         enable row level security;
alter table public.kurum_uyeleri    enable row level security;
alter table public.baglantilar      enable row level security;
alter table public.uniteler         enable row level security;
alter table public.kelimeler        enable row level security;
alter table public.unite_bolumleri  enable row level security;
alter table public.cevaplar         enable row level security;
alter table public.tekrar_kartlari  enable row level security;
alter table public.ogrenci_durumu   enable row level security;
alter table public.odevler          enable row level security;
alter table public.odev_atamalari   enable row level security;
alter table public.gunluk           enable row level security;

-- Profiller: kendin, öğretmenin, öğrencilerin
create policy "profil gor" on public.profiller for select using (
  id = auth.uid() or public.ogretmeni_mi(id) or id in (select public.ogretmenlerim()) or public.yonetici_mi()
);
create policy "profil guncelle" on public.profiller for update using (id = auth.uid() or public.yonetici_mi());

-- Kurumlar: üyeler görür
create policy "kurum gor" on public.kurumlar for select using (
  exists (select 1 from public.kurum_uyeleri u where u.kurum_id = id and u.kullanici_id = auth.uid()) or public.yonetici_mi()
);
create policy "kurum uye gor" on public.kurum_uyeleri for select using (kullanici_id = auth.uid() or public.yonetici_mi());

-- Bağlantılar: iki taraf da görür; ekleme koda_baglan() ile; ayrılma iki taraf da yapabilir
create policy "baglanti gor" on public.baglantilar for select using (
  ogretmen_id = auth.uid() or ogrenci_id = auth.uid() or public.yonetici_mi()
);
create policy "baglanti guncelle" on public.baglantilar for update using (
  ogretmen_id = auth.uid() or ogrenci_id = auth.uid()
);

-- İçerik görme kuralı
create or replace function public.icerik_gorulur(sahip uuid, yayinda boolean) returns boolean
language sql stable security definer set search_path = public as $$
  select (sahip is null and yayinda)
      or sahip = auth.uid()
      or sahip in (select ogretmenlerim())
      or yonetici_mi()
$$;
create or replace function public.icerik_duzenlenir(sahip uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select (sahip is null and yonetici_mi())
      or (sahip = auth.uid() and exists (select 1 from profiller where id = auth.uid() and rol in ('ogretmen', 'yonetici')))
$$;

create policy "unite gor" on public.uniteler for select using (public.icerik_gorulur(sahip_id, yayinda));
create policy "unite ekle" on public.uniteler for insert with check (public.icerik_duzenlenir(sahip_id));
create policy "unite duzenle" on public.uniteler for update using (public.icerik_duzenlenir(sahip_id));
create policy "unite sil" on public.uniteler for delete using (public.icerik_duzenlenir(sahip_id));

create policy "kelime gor" on public.kelimeler for select using (
  exists (select 1 from public.uniteler u where u.id = unite_id and public.icerik_gorulur(u.sahip_id, u.yayinda))
);
create policy "kelime yaz" on public.kelimeler for all using (
  exists (select 1 from public.uniteler u where u.id = unite_id and public.icerik_duzenlenir(u.sahip_id))
) with check (
  exists (select 1 from public.uniteler u where u.id = unite_id and public.icerik_duzenlenir(u.sahip_id))
);

create policy "bolum gor" on public.unite_bolumleri for select using (
  exists (select 1 from public.uniteler u where u.id = unite_id and public.icerik_gorulur(u.sahip_id, u.yayinda))
);
create policy "bolum yaz" on public.unite_bolumleri for all using (
  exists (select 1 from public.uniteler u where u.id = unite_id and public.icerik_duzenlenir(u.sahip_id))
) with check (
  exists (select 1 from public.uniteler u where u.id = unite_id and public.icerik_duzenlenir(u.sahip_id))
);

-- İlerleme verileri: öğrenci kendisininkini yazar/okur, öğretmeni okur
create policy "cevap ekle" on public.cevaplar for insert with check (ogrenci_id = auth.uid());
create policy "cevap gor" on public.cevaplar for select using (
  ogrenci_id = auth.uid() or public.ogretmeni_mi(ogrenci_id) or public.yonetici_mi()
);

create policy "kart yaz" on public.tekrar_kartlari for all using (ogrenci_id = auth.uid()) with check (ogrenci_id = auth.uid());
create policy "kart gor ogretmen" on public.tekrar_kartlari for select using (public.ogretmeni_mi(ogrenci_id));

create policy "durum yaz" on public.ogrenci_durumu for all using (ogrenci_id = auth.uid()) with check (ogrenci_id = auth.uid());
create policy "durum gor ogretmen" on public.ogrenci_durumu for select using (public.ogretmeni_mi(ogrenci_id));

-- Ödevler: öğretmen kendi ödevlerini yönetir; öğrenci kendisine atananı görür.
-- (İki tablo birbirine bakmasın diye yardımcı fonksiyonlar security definer.)
create or replace function public.odev_sahibi_mi(odev uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from odevler where id = odev and ogretmen_id = auth.uid())
$$;
create or replace function public.odev_bana_atandi_mi(odev uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from odev_atamalari where odev_id = odev and ogrenci_id = auth.uid())
$$;

create policy "odev ogretmen" on public.odevler for all using (ogretmen_id = auth.uid()) with check (ogretmen_id = auth.uid());
create policy "odev ogrenci gor" on public.odevler for select using (public.odev_bana_atandi_mi(id));
create policy "atama ogretmen" on public.odev_atamalari for all using (public.odev_sahibi_mi(odev_id))
  with check (public.odev_sahibi_mi(odev_id) and public.ogretmeni_mi(ogrenci_id));
create policy "atama ogrenci gor" on public.odev_atamalari for select using (ogrenci_id = auth.uid());
create policy "atama ogrenci guncelle" on public.odev_atamalari for update using (ogrenci_id = auth.uid());

-- Günlük: öğrenci yazar; öğretmen görür ve yorum yazar
create policy "gunluk ogrenci" on public.gunluk for all using (ogrenci_id = auth.uid()) with check (ogrenci_id = auth.uid());
create policy "gunluk ogretmen gor" on public.gunluk for select using (public.ogretmeni_mi(ogrenci_id));
create policy "gunluk ogretmen yorum" on public.gunluk for update using (public.ogretmeni_mi(ogrenci_id));

-- =====================================================================
-- Öğretmen ekranı için özet görünüm
-- =====================================================================
create or replace view public.ogrenci_ozetleri with (security_invoker = true) as
select
  b.ogretmen_id,
  p.id            as ogrenci_id,
  p.ad,
  b.olusturma     as baglanma,
  (select max(c.zaman) from public.cevaplar c where c.ogrenci_id = p.id)                                         as son_calisma,
  (select count(*) from public.cevaplar c where c.ogrenci_id = p.id and c.zaman > now() - interval '7 days')    as hafta_cevap,
  (select count(*) from public.cevaplar c where c.ogrenci_id = p.id and c.zaman > now() - interval '7 days' and c.dogru) as hafta_dogru,
  d.yol_en_ust
from public.baglantilar b
join public.profiller p on p.id = b.ogrenci_id
left join public.ogrenci_durumu d on d.ogrenci_id = p.id
where b.durum = 'aktif';

-- Bir öğrencinin en çok zorlandığı kurallar (son 30 gün)
create or replace view public.zayif_kurallar with (security_invoker = true) as
select ogrenci_id, kural,
       count(*) filter (where not dogru) as hata,
       count(*)                          as toplam
from public.cevaplar
where kural is not null and zaman > now() - interval '30 days'
group by ogrenci_id, kural;

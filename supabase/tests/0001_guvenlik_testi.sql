\set ON_ERROR_STOP 0
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;
-- kullanıcılar: öğretmen T, öğrenci S, yabancı X, yönetici A
insert into auth.users values
 ('11111111-1111-1111-1111-111111111111','{"ad":"Hoca","rol":"ogretmen","kvkk":"true"}'),
 ('22222222-2222-2222-2222-222222222222','{"ad":"Oğuz","rol":"ogrenci","dogum_yili":"1990"}'),
 ('33333333-3333-3333-3333-333333333333','{"ad":"Yabancı","rol":"yonetici"}');
select ad, rol, davet_kodu is not null as kodlu, kvkk_onayi_at is not null as kvkk from profiller order by ad;
-- içerik: sistem ünitesi (yayında) + öğretmen ünitesi
insert into uniteler (id, seviye, sira, kod, baslik, yayinda) values ('aaaaaaaa-0000-0000-0000-000000000001','A1',1,'a1-01','Tanışma',true);
insert into kelimeler (unite_id, en, tr) values ('aaaaaaaa-0000-0000-0000-000000000001','hello','merhaba');

set role authenticated;
-- ÖĞRENCİ
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo '--- öğrenci: bağlanmadan önce gördüğü profiller (1 olmalı)'
select count(*) from profiller;
\echo '--- öğrenci kendini yönetici yapmaya çalışır (rol değişmemeli)'
update profiller set rol='yonetici', ad='Oğuz T.' where id = auth.uid();
select ad, rol from profiller where id = auth.uid();
\echo '--- öğrenci yanlış kodla bağlanır (hata beklenir)'
select koda_baglan('ZZZZZZ');
reset role;
select davet_kodu as kod from profiller where rol='ogretmen' \gset
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo '--- öğrenci doğru kodla bağlanır (küçük harfle)'
select koda_baglan(lower(:'kod'));
\echo '--- öğrenci cevap ekler'
insert into cevaplar (kaynak, kural, dogru, soru, cevap, beklenen) values ('yol','simple-neg',false,'Sen kahve içmezsin.','You not drink coffee','You don''t drink coffee.'), ('yol','simple-neg',false,'x','y','z'), ('yol','be-pos',true,'a','b','b');
\echo '--- öğrenci başkası adına cevap ekleyemez (hata beklenir)'
insert into cevaplar (ogrenci_id, kaynak, dogru) values ('33333333-3333-3333-3333-333333333333','yol',true);
\echo '--- öğrenci üniteyi ve kelimeyi görür (1, 1)'
select (select count(*) from uniteler), (select count(*) from kelimeler);
\echo '--- öğrenci sistem ünitesi ekleyemez (hata beklenir)'
insert into uniteler (seviye, baslik) values ('A1','Hack');
-- ÖĞRETMEN
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
\echo '--- öğretmen: öğrenci özeti (Oğuz T., 3 cevap, 1 doğru)'
select ad, hafta_cevap, hafta_dogru from ogrenci_ozetleri;
\echo '--- öğretmen: zayıf kurallar'
select kural, hata, toplam from zayif_kurallar order by hata desc;
\echo '--- öğretmen kendi ünitesini ekler (yayında değil) ve kelime ekler'
insert into uniteler (id, sahip_id, seviye, baslik) values ('bbbbbbbb-0000-0000-0000-000000000002', auth.uid(),'A1','Hocanın ünitesi');
insert into kelimeler (unite_id, en, tr) values ('bbbbbbbb-0000-0000-0000-000000000002','apple','elma');
\echo '--- öğretmen ödev verir ve öğrenciye atar'
insert into odevler (id, baslik, hedef) values ('cccccccc-0000-0000-0000-000000000003','7. seviyeye gel','{"tur":"yol","seviye":7}');
insert into odev_atamalari (odev_id, ogrenci_id) values ('cccccccc-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222');
\echo '--- öğretmen bağlı olmayan birine ödev atayamaz (hata beklenir)'
insert into odev_atamalari (odev_id, ogrenci_id) values ('cccccccc-0000-0000-0000-000000000003','33333333-3333-3333-3333-333333333333');
-- ÖĞRENCİ tekrar
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo '--- öğrenci: öğretmen ünitesini ve ödevini görür (2 ünite, 1 ödev), öğretmen profilini görür (2 profil)'
select (select count(*) from uniteler), (select count(*) from odevler), (select count(*) from profiller);
-- YABANCI (rol öğrenciye düştü çünkü yonetici seçilemez)
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
\echo '--- yabancı: cevap, ödev, öğretmen ünitesi görmemeli (0, 0, 1 sistem ünitesi, 1 profil)'
select (select count(*) from cevaplar), (select count(*) from odevler), (select count(*) from uniteler), (select count(*) from profiller);
\echo '--- yabancı rolü (ogrenci olmalı, yonetici seçilemez)'
select rol from profiller where id = auth.uid();
reset role;

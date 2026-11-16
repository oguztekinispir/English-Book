-- 0007: ödevler. Her şey geri alınır.
\set ON_ERROR_STOP 0
-- Supabase tablolara authenticated rolüne yetkiyi kendiliğinden verir; yerelde taklit et
grant select, insert, update, delete on all tables in schema public to authenticated;
begin;
insert into auth.users values
 ('a7000000-0000-0000-0000-000000000001','{"ad":"Hoca7","rol":"ogretmen","kvkk":"true"}'),
 ('a7000000-0000-0000-0000-000000000002','{"ad":"Öğr7","rol":"ogrenci"}'),
 ('a7000000-0000-0000-0000-000000000003','{"ad":"Yabancı7","rol":"ogrenci"}');
insert into baglantilar (ogretmen_id, ogrenci_id) values ('a7000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000002');
set role authenticated;
set request.jwt.claim.sub = 'a7000000-0000-0000-0000-000000000001';
\echo '--- öğretmen ödev oluşturur ve kendi öğrencisine atar (1)'
insert into odevler (id, baslik, hedef) values ('b7000000-0000-0000-0000-000000000001','20 tekrar kartı','{"tur":"tekrar","adet":20}');
insert into odev_atamalari (odev_id, ogrenci_id) values ('b7000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000002');
select count(*) from odev_atamalari;
\echo '--- bağlı olmadığı öğrenciye atayamaz (hata)'
savepoint a;
insert into odev_atamalari (odev_id, ogrenci_id) values ('b7000000-0000-0000-0000-000000000001','a7000000-0000-0000-0000-000000000003');
rollback to savepoint a;
\echo '--- geçersiz hedef türü (hata)'
savepoint b;
insert into odevler (baslik, hedef) values ('x','{"tur":"hack"}');
rollback to savepoint b;
set request.jwt.claim.sub = 'a7000000-0000-0000-0000-000000000002';
\echo '--- öğrenci ödevini görür (1, 1)'
select (select count(*) from odevler), (select count(*) from odev_atamalari);
\echo '--- öğrenci bitirir; ödev ya da kişi değiştiremez (bitti, b7..01, a7..02, bitis dolu)'
update odev_atamalari set durum = 'bitti', ogrenci_id = 'a7000000-0000-0000-0000-000000000003' where odev_id = 'b7000000-0000-0000-0000-000000000001';
select durum, odev_id, ogrenci_id, bitis is not null from odev_atamalari;
\echo '--- öğrenci ödevi silemez (silinen 0)'
delete from odevler;
select count(*) from odevler;
set request.jwt.claim.sub = 'a7000000-0000-0000-0000-000000000003';
\echo '--- başka öğrenci göremez (0, 0)'
select (select count(*) from odevler), (select count(*) from odev_atamalari);
set request.jwt.claim.sub = 'a7000000-0000-0000-0000-000000000001';
\echo '--- öğretmen siler, atama da gider (0)'
delete from odevler where id = 'b7000000-0000-0000-0000-000000000001';
reset role;
select count(*) from odev_atamalari where odev_id = 'b7000000-0000-0000-0000-000000000001';
rollback;

-- 0008: yazılar. Her şey geri alınır.
\set ON_ERROR_STOP 0
grant select, insert, update, delete on all tables in schema public to authenticated;
begin;
insert into auth.users values
 ('a8000000-0000-0000-0000-000000000001','{"ad":"Hoca8","rol":"ogretmen","kvkk":"true"}'),
 ('a8000000-0000-0000-0000-000000000002','{"ad":"Öğr8","rol":"ogrenci"}'),
 ('a8000000-0000-0000-0000-000000000003','{"ad":"Yabancı8","rol":"ogrenci"}');
insert into baglantilar (ogretmen_id, ogrenci_id) values ('a8000000-0000-0000-0000-000000000001','a8000000-0000-0000-0000-000000000002');
set role authenticated;
set request.jwt.claim.sub = 'a8000000-0000-0000-0000-000000000002';
\echo '--- öğrenci yazar (1)'
insert into yazilar (ders, metin) values ('yazma-a1-gec-kalma-mesaji', 'Hi Ece! Sorry, I''m late.');
select count(*) from yazilar;
\echo '--- başkası adına yazamaz (hata)'
savepoint a;
insert into yazilar (ogrenci_id, ders, metin) values ('a8000000-0000-0000-0000-000000000003', 'x', 'y');
rollback to savepoint a;
set request.jwt.claim.sub = 'a8000000-0000-0000-0000-000000000003';
\echo '--- yabancı göremez (0)'
select count(*) from yazilar;
set request.jwt.claim.sub = 'a8000000-0000-0000-0000-000000000001';
\echo '--- öğretmen görür ve not bırakır; metni değiştiremez (Hi Ece!..., Çok iyi, t)'
update yazilar set ogretmen_notu = 'Çok iyi', metin = 'hacked';
select metin, ogretmen_notu, not_tarihi is not null from yazilar;
rollback;

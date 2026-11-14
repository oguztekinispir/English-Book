-- 0005: öğretmen notları ve hesap silme. Her şey geri alınır.
\set ON_ERROR_STOP 0
begin;
insert into auth.users values
 ('a5000000-0000-0000-0000-000000000001','{"ad":"Hoca5","rol":"ogretmen","kvkk":"true"}'),
 ('a5000000-0000-0000-0000-000000000002','{"ad":"Öğr5","rol":"ogrenci"}'),
 ('a5000000-0000-0000-0000-000000000003','{"ad":"Başka5","rol":"ogretmen"}');
insert into baglantilar (ogretmen_id, ogrenci_id) values ('a5000000-0000-0000-0000-000000000001','a5000000-0000-0000-0000-000000000002');
insert into cevaplar (ogrenci_id, kaynak, dogru) values ('a5000000-0000-0000-0000-000000000002','tekrar',true);
set role authenticated;
set request.jwt.claim.sub = 'a5000000-0000-0000-0000-000000000001';
\echo '--- öğretmen kendi öğrencisine not ekler (1)'
insert into ogretmen_notlari (ogrenci_id, metin) values ('a5000000-0000-0000-0000-000000000002','Geniş zamanda -s unutuyor');
select count(*) from ogretmen_notlari;
\echo '--- öğretmen bağlı olmadığı birine not ekleyemez (hata)'
savepoint a;
insert into ogretmen_notlari (ogrenci_id, metin) values ('a5000000-0000-0000-0000-000000000003','x');
rollback to savepoint a;
set request.jwt.claim.sub = 'a5000000-0000-0000-0000-000000000002';
\echo '--- öğrenci notu göremez (0)'
select count(*) from ogretmen_notlari;
set request.jwt.claim.sub = 'a5000000-0000-0000-0000-000000000003';
\echo '--- başka öğretmen göremez (0)'
select count(*) from ogretmen_notlari;
set request.jwt.claim.sub = 'a5000000-0000-0000-0000-000000000002';
\echo '--- öğrenci hesabını siler'
select public.hesabimi_sil();
reset role;
\echo '--- kalan: profil 0, cevap 0, bağlantı 0, not 0'
select (select count(*) from profiller where id='a5000000-0000-0000-0000-000000000002'),
       (select count(*) from cevaplar where ogrenci_id='a5000000-0000-0000-0000-000000000002'),
       (select count(*) from baglantilar where ogrenci_id='a5000000-0000-0000-0000-000000000002'),
       (select count(*) from ogretmen_notlari);
savepoint b;
set role anon;
\echo '--- girişsiz silme denemesi (yetki hatası)'
select public.hesabimi_sil();
rollback to savepoint b;
rollback;

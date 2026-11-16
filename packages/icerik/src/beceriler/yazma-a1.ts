/**
 * A1 yazma: örnek metin + ipuçları + üç görev + kendi metnin. Orijinal içerik. Kontrol: öğretmen bekliyor.
 */
import type { YazmaDersi } from "./tipler";

export const YAZMA_A1: YazmaDersi[] = [
  // ------------------------------------------------------------ geç kalma mesajı
  {
    kod: "yazma-a1-gec-kalma-mesaji",
    tur: "yazma",
    seviye: "A1",
    baslik: "Geç kalacağını bildiren mesaj",
    aciklama: "Bir arkadaşına geç kalacağını, nedenini ve ne zaman geleceğini yaz.",
    metinTuru: "Telefon mesajı",
    konu: "Arkadaşlar ve buluşma",
    hazirlik: [
      { en: "I'm late", tr: "geç kaldım" },
      { en: "sorry", tr: "kusura bakma, özür dilerim" },
      { en: "because", tr: "çünkü" },
      { en: "traffic", tr: "trafik" },
      { en: "in ten minutes", tr: "on dakika içinde" },
      { en: "see you", tr: "görüşürüz" },
    ],
    sozluk: { "hi": "selam", "really": "gerçekten", "the": "—", "bus": "otobüs", "slow": "yavaş", "at": "-de", "now": "şimdi", "start": "başlamak", "without": "-sız, olmadan", "me": "beni, bana" },
    metin: {
      tip: "mesajlar",
      ben: "Deniz",
      kisiler: { D: "Deniz" },
      satirlar: [
        { kim: "D", en: "Hi Mark! I'm really sorry, I'm late. 😟", saat: "18:52" },
        { kim: "D", en: "The bus is very slow because the traffic is terrible.", saat: "18:52" },
        { kim: "D", en: "I'm at Kadıköy now. I'm there in ten minutes.", saat: "18:53" },
        { kim: "D", en: "Please start the lesson without me. See you soon! Deniz", saat: "18:53" },
      ],
    },
    ceviri: [
      "Selam Mark! Gerçekten çok özür dilerim, geç kaldım. 😟",
      "Trafik berbat olduğu için otobüs çok yavaş gidiyor.",
      "Şu an Kadıköy'deyim. On dakikaya oradayım.",
      "Lütfen derse bensiz başlayın. Görüşürüz! Deniz",
    ],
    ipuclari: [
      {
        baslik: "Dört parça yeter",
        metin: "Kısa bir geç kalma mesajında dört şey olur: selam ve özür, neden, ne zaman orada olacağın, kapanış.",
        ornekler: [
          { en: "Hi Mark! Sorry, I'm late.", tr: "Selam ve özür" },
          { en: "The traffic is terrible.", tr: "Neden" },
          { en: "I'm there in ten minutes.", tr: "Ne zaman" },
          { en: "See you soon!", tr: "Kapanış" },
        ],
      },
      {
        baslik: "“Geç kaldım” = I'm late",
        metin: "Türkçedeki “geç kaldım” geçmiş zaman gibi görünür ama şu anki durumu anlatır. İngilizcede de şimdiki durum: I'm late. “I late” ya da “I was late” değil.",
      },
      {
        baslik: "Nedeni because ile bağla",
        metin: "İki cümleyi because (çünkü) ile birleştirebilirsin. Mesajda kısa cümleler de olur; ikisi de doğru.",
        ornekler: [
          { en: "I'm late because the bus is slow.", tr: "Otobüs yavaş olduğu için geç kaldım." },
          { en: "I'm late. The bus is slow.", tr: "Geç kaldım. Otobüs yavaş." },
        ],
      },
    ],
    dogruYanlis: [
      { en: "Deniz is on time.", dogru: false, aciklama: "I'm late: geç kaldı." },
      { en: "The traffic is the problem.", dogru: true, aciklama: "because the traffic is terrible" },
      { en: "Deniz is at home now.", dogru: false, aciklama: "I'm at Kadıköy now." },
      { en: "Deniz wants Mark to wait for him.", dogru: false, aciklama: "Please start the lesson without me: bensiz başlayın." },
    ],
    siralama: ["Hi Mark! I'm really sorry, I'm late.", "The bus is very slow because the traffic is terrible.", "I'm there in ten minutes.", "See you soon!"],
    bosluklar: [
      { en: "Hi Ece! ___, I'm late.", cevap: "Sorry" },
      { en: "I'm late ___ the bus is slow.", cevap: "because" },
      { en: "I'm there in twenty ___.", cevap: "minutes" },
      { en: "See you ___!", cevap: "soon" },
    ],
    yaz: {
      durum: "Saat 19.00'da bir arkadaşınla sinemada buluşacaksın ama geç kalıyorsun. Ona kısa bir mesaj yaz: özür dile, nedenini söyle, ne zaman orada olacağını yaz.",
      kontrol: ["Selam ve özür var mı? (Hi… Sorry, I'm late.)", "Nedenini yazdın mı? (because…)", "Ne zaman geleceğini yazdın mı? (in … minutes)", "Kapanış var mı? (See you soon!)"],
      kaliplar: ["Sorry, I'm late.", "I'm really sorry.", "because the traffic is terrible", "I'm on the bus.", "I'm there in 15 minutes.", "See you soon!"],
      enAz: 15,
      ornekCevap: "Hi Ece! I'm really sorry, I'm late. I'm on the metro and it's very slow. I'm there in fifteen minutes. See you soon! Deniz",
    },
  },

  // ------------------------------------------------------------ kendini tanıtma
  {
    kod: "yazma-a1-kendini-tanit",
    tur: "yazma",
    seviye: "A1",
    baslik: "Online kursta kendini tanıtma",
    aciklama: "Online bir İngilizce kursunun sınıf sayfasına kendini tanıtan kısa bir gönderi yaz.",
    metinTuru: "Gönderi",
    konu: "Kendini tanıtma",
    hazirlik: [
      { en: "everyone", tr: "herkes" },
      { en: "I live in…", tr: "…'de yaşıyorum" },
      { en: "I work as…", tr: "… olarak çalışıyorum" },
      { en: "free time", tr: "boş zaman" },
      { en: "I want to…", tr: "…mak istiyorum" },
      { en: "nice to meet you", tr: "tanıştığımıza memnun oldum" },
    ],
    sozluk: {
      "hello": "merhaba", "my": "benim", "name": "ad", "from": "-den", "years": "yıl", "old": "yaşında", "with": "ile", "two": "iki",
      "friends": "arkadaşlar", "in": "-de", "student": "öğrenci", "university": "üniversite", "I'm": "ben …im", "like": "sevmek",
      "cooking": "yemek yapmak", "and": "ve", "running": "koşmak", "learn": "öğrenmek", "English": "İngilizce", "for": "için",
      "my job": "işim", "travel": "seyahat etmek", "all": "hepiniz", "of": "—", "you": "siz", "at": "-de",
    },
    metin: {
      tip: "gonderi",
      yazar: "Anna Weber",
      zaman: "Pazartesi 09:14",
      govde: [
        "Hello everyone!",
        "My name is Anna and I'm from Berlin, Germany. I'm 24 years old.",
        "I live in Istanbul with two friends. I'm a student at Boğaziçi University.",
        "In my free time, I like cooking and running.",
        "I want to learn English for my job and because I love travelling.",
        "Nice to meet you all!",
      ],
    },
    ceviri: [
      "Herkese merhaba!",
      "Adım Anna, Berlin'denim, Almanya. 24 yaşındayım.",
      "İstanbul'da iki arkadaşımla yaşıyorum. Boğaziçi Üniversitesi'nde öğrenciyim.",
      "Boş zamanlarımda yemek yapmayı ve koşmayı severim.",
      "İngilizceyi hem işim için hem de seyahat etmeyi çok sevdiğim için öğrenmek istiyorum.",
      "Hepinizle tanıştığıma memnun oldum!",
    ],
    ipuclari: [
      {
        baslik: "Büyük harf: isimler, ülkeler, şehirler ve I",
        metin: "İngilizcede kişi, şehir, ülke ve dil adları büyük harfle başlar: Anna, Berlin, Germany, English. “Ben” anlamındaki I her zaman büyük yazılır, cümlenin ortasında bile.",
        ornekler: [
          { en: "I'm from Turkey and I speak Turkish.", tr: "Türkiye'denim ve Türkçe konuşuyorum." },
        ],
      },
      {
        baslik: "Bir paragraf, beş bilgi",
        metin: "Kendini tanıtırken sırayla şunları yaz: adın ve nerelisin, nerede yaşıyorsun, ne iş yapıyorsun, boş zamanlarında ne yaparsın, neden İngilizce öğreniyorsun.",
      },
      {
        baslik: "and ile birleştir",
        metin: "Çok kısa cümleleri and ile birleştirebilirsin: I like cooking and running. Ama her şeyi tek cümleye sıkıştırma; iki üç kısa cümle daha anlaşılır.",
      },
    ],
    dogruYanlis: [
      { en: "Anna is from Germany.", dogru: true, aciklama: "I'm from Berlin, Germany." },
      { en: "Anna lives alone.", dogru: false, aciklama: "I live in Istanbul with two friends: iki arkadaşıyla." },
      { en: "Anna is a teacher.", dogru: false, aciklama: "I'm a student: öğrenci." },
      { en: "Anna likes cooking.", dogru: true, aciklama: "I like cooking and running." },
    ],
    siralama: ["Hello everyone!", "My name is Anna and I'm from Berlin, Germany.", "I live in Istanbul with two friends.", "In my free time, I like cooking and running.", "Nice to meet you all!"],
    bosluklar: [
      { en: "My ___ is Kerem.", cevap: "name" },
      { en: "I ___ in Ankara.", cevap: "live" },
      { en: "In my free ___, I like football.", cevap: "time" },
      { en: "I want to learn English ___ my job.", cevap: "for" },
      { en: "Nice to ___ you all!", cevap: "meet" },
    ],
    yaz: {
      durum: "Online bir İngilizce kursuna yeni katıldın. Sınıf sayfasına kendini tanıtan kısa bir gönderi yaz: adın, nerelisin, nerede yaşıyorsun, ne iş yapıyorsun, boş zamanlarında ne yaparsın, neden İngilizce öğreniyorsun.",
      kontrol: ["Selamla başladın mı? (Hello everyone!)", "Adın ve nereli olduğun var mı?", "Ne iş yaptığını yazdın mı? (I'm a… / I work as…)", "Boş zamanın ve neden İngilizce öğrendiğin var mı?", "İsimler, şehirler ve I büyük harfle mi?"],
      kaliplar: ["Hello everyone!", "My name is…", "I'm from…", "I live in…", "I'm a… / I work as a…", "In my free time, I like…", "I want to learn English because…", "Nice to meet you all!"],
      enAz: 40,
      ornekCevap: "Hello everyone! My name is Murat and I'm from Bursa, Turkey. I'm 27 years old. I live in Istanbul. I work as a graphic designer. In my free time, I like music and swimming. I want to learn English because I want to work abroad. Nice to meet you all!",
    },
  },

  // ------------------------------------------------------------ form
  {
    kod: "yazma-a1-kayit-formu",
    tur: "yazma",
    seviye: "A1",
    baslik: "İngilizce bir formu doldurma",
    aciklama: "Bir dil kursunun kayıt formunu doldurmayı öğren: ad, soyad, tarih, iletişim bilgileri.",
    metinTuru: "Form",
    konu: "Kişisel bilgiler",
    hazirlik: [
      { en: "first name", tr: "ad" },
      { en: "surname", tr: "soyadı" },
      { en: "date of birth", tr: "doğum tarihi" },
      { en: "nationality", tr: "uyruk" },
      { en: "address", tr: "adres" },
      { en: "occupation", tr: "meslek" },
      { en: "signature", tr: "imza" },
    ],
    sozluk: {
      "registration": "kayıt", "form": "form", "course": "kurs", "phone": "telefon", "email": "e-posta", "level": "seviye",
      "beginner": "başlangıç", "why": "neden", "are": "—", "you": "sen", "learning": "öğreniyorsun", "English": "İngilizce", "for": "için",
      "work": "iş", "student": "öğrenci", "summer": "yaz", "London": "Londra", "a": "bir", "Turkish": "Türk", "male": "erkek", "female": "kadın",
    },
    metin: {
      tip: "form",
      baslik: "Lingo Language School: course registration form",
      alanlar: [
        { etiket: "First name", deger: "Deniz" },
        { etiket: "Surname", deger: "YILMAZ" },
        { etiket: "Date of birth", deger: "14 / 03 / 2007" },
        { etiket: "Nationality", deger: "Turkish" },
        { etiket: "Address", deger: "Moda Apartment, Flat 2, Moda Road 18, Kadıköy, Istanbul" },
        { etiket: "Phone", deger: "0537 248 61 09" },
        { etiket: "Email", deger: "deniz.yilmaz@mail.com" },
        { etiket: "Occupation", deger: "Student" },
        { etiket: "Level", deger: "Beginner (A1)" },
        { etiket: "Why are you learning English?", deger: "For a summer course in London." },
        { etiket: "Signature", deger: "D. Yılmaz" },
      ],
    },
    ceviri: [
      "Lingo Dil Okulu: kurs kayıt formu",
      "Ad: Deniz · Soyadı: YILMAZ · Doğum tarihi: 14.03.2007 · Uyruk: Türk",
      "Adres: Moda Apartmanı, Daire 2, Moda Caddesi 18, Kadıköy, İstanbul",
      "Telefon: 0537 248 61 09 · E-posta: deniz.yilmaz@mail.com",
      "Meslek: Öğrenci · Seviye: Başlangıç (A1)",
      "Neden İngilizce öğreniyorsun? Londra'da bir yaz kursu için.",
      "İmza: D. Yılmaz",
    ],
    ipuclari: [
      {
        baslik: "Ad önce, soyadı sonra",
        metin: "First name adındır, surname (ya da last name) soyadın. Formlarda soyadı karışmasın diye çoğu zaman büyük harfle yazılır: Deniz YILMAZ.",
      },
      {
        baslik: "Tarihe dikkat",
        metin: "İngiltere'de tarih bizdeki gibi gün / ay / yıl yazılır: 14/03/1999. Amerikan formlarında ise ay önce gelir: 03/14/1999. Karışmaması için ayı yazıyla yazabilirsin: 14 March 1999.",
        ornekler: [
          { en: "14/03/1999 (UK)", tr: "14 Mart 1999" },
          { en: "03/14/1999 (US)", tr: "14 Mart 1999" },
        ],
      },
      {
        baslik: "Kısa cevaplar yeter",
        metin: "Formlarda tam cümle gerekmez. “Why are you learning English?” sorusuna “For my work.” yazmak yeterli.",
      },
    ],
    dogruYanlis: [
      { en: "Deniz's surname is Yılmaz.", dogru: true, aciklama: "Surname: YILMAZ" },
      { en: "Deniz was born in March.", dogru: true, aciklama: "14 / 03 / 2007: 03 = Mart." },
      { en: "Deniz is a teacher.", dogru: false, aciklama: "Occupation: Student." },
      { en: "Deniz's level is intermediate.", dogru: false, aciklama: "Level: Beginner (A1)." },
    ],
    siralama: ["First name: Deniz", "Surname: YILMAZ", "Date of birth: 14 / 03 / 2007", "Nationality: Turkish"],
    bosluklar: [
      { en: "Kerem is my first name. Aydın is my ___.", cevap: "surname" },
      { en: "My date of ___ is 2 May 1995.", cevap: "birth" },
      { en: "My ___ is Turkish.", cevap: "nationality" },
      { en: "My ___ is nurse.", cevap: "occupation" },
    ],
    yaz: {
      durum: "Lingo Dil Okulu'nun kayıt formunu kendi bilgilerinle doldur. Gerçek telefon ya da adresini yazmak zorunda değilsin; uydurma bilgi de olur.",
      kontrol: ["Ad ve soyadı ayrı mı?", "Doğum tarihini gün / ay / yıl yazdın mı?", "Uyruğu sıfat olarak mı yazdın? (Turkey değil Turkish)", "Mesleği İngilizce yazdın mı?"],
      kaliplar: ["Turkish", "Engineer / Teacher / Student", "Beginner (A1)", "For my work.", "For travel."],
      enAz: 0,
      alanlar: [
        { etiket: "First name", ipucu: "Adın" },
        { etiket: "Surname", ipucu: "Soyadın" },
        { etiket: "Date of birth", ipucu: "gün / ay / yıl" },
        { etiket: "Nationality", ipucu: "Uyruğun: Turkish…" },
        { etiket: "Occupation", ipucu: "Mesleğin" },
        { etiket: "Why are you learning English?", ipucu: "Kısa cevap: For my work." },
      ],
      ornekCevap: "First name: Ayşe · Surname: KAYA · Date of birth: 02/05/1995 · Nationality: Turkish · Occupation: Accountant · Why are you learning English? For my work and for travel.",
    },
  },
];

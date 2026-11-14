/**
 * A1 · Ünite 1 · Merhaba
 * Orijinal içerik. Taslak: Claude · Kontrol: (öğretmen) · Durum: inceleme bekliyor
 */
import type { Unite } from "../tipler";

export const A1_01: Unite = {
  id: "a1000000-0000-4000-8000-000000000001",
  kod: "a1-01",
  seviye: "A1",
  sira: 1,
  baslik: "Merhaba",
  baslikEn: "Hello",
  gramerEtiketi: "I am, you are, he is",
  hedefler: [
    "Selamlaşır ve vedalaşırsın.",
    "Adını, nereli olduğunu ve kaç yaşında olduğunu söylersin.",
    "Karşındakine adını, nereli olduğunu ve yaşını sorarsın.",
    "0'dan 20'ye kadar sayarsın.",
  ],

  // ------------------------------------------------------------------ kelimeler
  kelimeGruplari: [
    {
      ad: "Selamlaşma",
      kelimeler: [
        { en: "hello", tr: "merhaba", ok: "helou", ornek: ["Hello, Anna!", "Merhaba Anna!"] },
        { en: "hi", tr: "selam", ok: "hay", ipucu: "Arkadaşlar arasında. Hello'dan daha samimi." },
        { en: "good morning", tr: "günaydın", ok: "gud morning" },
        { en: "good afternoon", tr: "tünaydın, iyi günler (öğleden sonra)", ok: "gud aftırnun" },
        { en: "good evening", tr: "iyi akşamlar (karşılaşınca)", ok: "gud ivning" },
        { en: "good night", tr: "iyi geceler (ayrılırken)", ok: "gud nayt", ipucu: "Sadece vedalaşırken ya da yatarken. Akşam karşılaşınca good evening denir." },
        { en: "goodbye", tr: "hoşça kal, güle güle", ok: "gudbay" },
        { en: "bye", tr: "hoşça kal (kısa)", ok: "bay" },
        { en: "see", tr: "görmek", ok: "sii", ornek: ["See you!", "Görüşürüz!"] },
        { en: "please", tr: "lütfen", ok: "pliiz" },
        { en: "thank you", tr: "teşekkür ederim", ok: "thenk yu", ipucu: "th: dilinin ucunu dişlerinin arasına koy, öyle 't' de. Türkçede bu ses yok." },
        { en: "thanks", tr: "sağ ol, teşekkürler", ok: "thenks" },
        { en: "yes", tr: "evet", ok: "yes" },
        { en: "no", tr: "hayır", ok: "nou" },
        { en: "sorry", tr: "özür dilerim, pardon", ok: "sori" },
        { en: "excuse me", tr: "affedersiniz (birine seslenirken)", ok: "ikskyuuz mi" },
        { en: "welcome", tr: "hoş geldin", ok: "uelkım" },
        { en: "nice", tr: "hoş, güzel", ok: "nays", ornek: ["Nice to meet you.", "Tanıştığımıza memnun oldum."] },
        { en: "meet", tr: "tanışmak, buluşmak", ok: "miit" },
      ],
    },
    {
      ad: "Kişiler",
      kelimeler: [
        { en: "I", tr: "ben", ok: "ay", ipucu: "Cümlenin neresinde olursa olsun hep büyük harfle yazılır." },
        { en: "you", tr: "sen, siz", ok: "yu", ipucu: "İngilizcede sen ve siz aynı kelime: you." },
        { en: "he", tr: "o (erkek)", ok: "hii" },
        { en: "she", tr: "o (kadın)", ok: "şii", ipucu: "Türkçede tek bir 'o' var. İngilizcede erkek için he, kadın için she." },
        { en: "we", tr: "biz", ok: "uii" },
        { en: "they", tr: "onlar", ok: "dhey", ipucu: "th burada yumuşak: dilin ucu dişlerin arasında, 'd' gibi." },
        { en: "my", tr: "benim", ok: "may", ornek: ["My name is Emre.", "Benim adım Emre."] },
        { en: "your", tr: "senin, sizin", ok: "yor", ornek: ["What's your name?", "Senin adın ne?"] },
        { en: "this", tr: "bu", ok: "dhis", ornek: ["This is my friend.", "Bu benim arkadaşım."] },
        { en: "name", tr: "isim, ad", ok: "neym" },
        { en: "friend", tr: "arkadaş", ok: "frend" },
        { en: "teacher", tr: "öğretmen", ok: "tiiçır" },
        { en: "student", tr: "öğrenci", ok: "styuudınt" },
        { en: "man", tr: "adam, erkek", ok: "men" },
        { en: "woman", tr: "kadın", ok: "uumın" },
      ],
    },
    {
      ad: "Ülkeler",
      kelimeler: [
        { en: "country", tr: "ülke", ok: "kantri" },
        { en: "city", tr: "şehir", ok: "siti" },
        { en: "Turkey", tr: "Türkiye", ok: "törki", ipucu: "Ülke adları hep büyük harfle başlar." },
        { en: "Turkish", tr: "Türk; Türkçe", ok: "törkiş", ornek: ["I am Turkish.", "Ben Türk'üm."], ipucu: "Aynı kelime hem milliyet hem dil: Turkish." },
        { en: "England", tr: "İngiltere", ok: "ingland" },
        { en: "English", tr: "İngiliz; İngilizce", ok: "ingliş" },
        { en: "Germany", tr: "Almanya", ok: "cörmıni" },
        { en: "German", tr: "Alman; Almanca", ok: "cörmın" },
        { en: "from", tr: "-den, -dan (nereden)", ok: "from", ornek: ["I am from Turkey.", "Ben Türkiye'denim."], ipucu: "Türkçede ek sonda (Türkiye'den), İngilizcede kelime önde (from Turkey)." },
      ],
    },
    {
      ad: "Soru kelimeleri ve küçük kelimeler",
      kelimeler: [
        { en: "what", tr: "ne", ok: "uat" },
        { en: "where", tr: "nerede, nere", ok: "uer" },
        { en: "how", tr: "nasıl", ok: "hau" },
        { en: "who", tr: "kim", ok: "huu" },
        { en: "how old", tr: "kaç yaşında", ok: "hau ould", ornek: ["How old are you?", "Kaç yaşındasın?"] },
        { en: "year", tr: "yıl", ok: "yiır", ornek: ["I am twenty years old.", "Yirmi yaşındayım."] },
        { en: "old", tr: "yaşlı; (yaşla birlikte) yaşında", ok: "ould" },
        { en: "and", tr: "ve", ok: "end" },
        { en: "too", tr: "de, da (ben de)", ok: "tuu", ornek: ["Nice to meet you too.", "Ben de memnun oldum."] },
        { en: "fine", tr: "iyi", ok: "fayn" },
        { en: "am", tr: "-im, -ım (ben ile)", ok: "em" },
        { en: "is", tr: "-dir, -dır (o ile)", ok: "iz" },
        { en: "are", tr: "-sin, -siniz, -iz, -ler", ok: "ar" },
        { en: "a", tr: "bir (meslekten önce)", ok: "ı", ornek: ["I am a student.", "Ben öğrenciyim."] },
        { en: "to", tr: "-e, -a; -mek", ok: "tu" },
      ],
    },
    {
      ad: "Sayılar 0–20",
      kelimeler: [
        { en: "zero", tr: "sıfır", ok: "ziirou" },
        { en: "one", tr: "bir", ok: "uan" },
        { en: "two", tr: "iki", ok: "tuu" },
        { en: "three", tr: "üç", ok: "thrii" },
        { en: "four", tr: "dört", ok: "foor" },
        { en: "five", tr: "beş", ok: "fayv" },
        { en: "six", tr: "altı", ok: "siks" },
        { en: "seven", tr: "yedi", ok: "sevın" },
        { en: "eight", tr: "sekiz", ok: "eyt" },
        { en: "nine", tr: "dokuz", ok: "nayn" },
        { en: "ten", tr: "on", ok: "ten" },
        { en: "eleven", tr: "on bir", ok: "ilevın" },
        { en: "twelve", tr: "on iki", ok: "tuelv" },
        { en: "thirteen", tr: "on üç", ok: "thörtiin", ipucu: "13–19 hep -teen ile biter ve vurgu sondadır: thir-TEEN." },
        { en: "fourteen", tr: "on dört", ok: "foortiin" },
        { en: "fifteen", tr: "on beş", ok: "fiftiin", ipucu: "five değil fif-: fifteen." },
        { en: "sixteen", tr: "on altı", ok: "sikstiin" },
        { en: "seventeen", tr: "on yedi", ok: "sevıntiin" },
        { en: "eighteen", tr: "on sekiz", ok: "eytiin" },
        { en: "nineteen", tr: "on dokuz", ok: "nayntiin" },
        { en: "twenty", tr: "yirmi", ok: "tuenti" },
      ],
    },
  ],

  // ------------------------------------------------------------------ hazır kalıplar
  kaliplar: [
    { en: "Nice to meet you.", tr: "Tanıştığımıza memnun oldum.", not: "İlk tanışmada." },
    { en: "Nice to meet you too.", tr: "Ben de memnun oldum.", not: "Cevap olarak." },
    { en: "What's your name?", tr: "Adın ne?", not: "What's = What is" },
    { en: "My name is Emre.", tr: "Benim adım Emre." },
    { en: "I'm Emre.", tr: "Ben Emre'yim.", not: "I'm = I am" },
    { en: "Where are you from?", tr: "Nerelisin?", not: "Kelime kelime: Nereden sin?" },
    { en: "I'm from Turkey.", tr: "Türkiye'denim." },
    { en: "How are you?", tr: "Nasılsın?" },
    { en: "I'm fine, thank you. And you?", tr: "İyiyim, teşekkür ederim. Ya sen?" },
    { en: "How old are you?", tr: "Kaç yaşındasın?", not: "Kelime kelime: Ne kadar yaşlısın?" },
    { en: "I'm twenty years old.", tr: "Yirmi yaşındayım.", not: "years old'u atabilirsin: I'm twenty." },
    { en: "This is my friend.", tr: "Bu benim arkadaşım.", not: "Birini tanıştırırken." },
    { en: "See you!", tr: "Görüşürüz!" },
  ],

  // ------------------------------------------------------------------ gramer
  gramer: [
    {
      baslik: "Türkçedeki -im, -sin, -dir İngilizcede ayrı kelimedir",
      metin: [
        "Türkçede “öğrenci-yim” derken “ben” anlamını kelimenin sonundaki ek taşır. İngilizcede bu ek ayrı bir kelimedir ve kişiye göre değişir: am, are, is.",
        "Bu kelime olmadan İngilizce cümle kurulmaz. “I student” yanlıştır; “I am a student” doğrudur.",
      ],
      ornekler: [
        { tr: ["Ben öğrenci", "-yim"], en: "I [am] a student." },
        { tr: ["Sen öğretmen", "-sin"], en: "You [are] a teacher." },
        { tr: ["O Türk", "(-tür)"], en: "He [is] Turkish." },
        { tr: ["O İngiliz", "(-dir)"], en: "She [is] English." },
        { tr: ["Biz arkadaş", "-ız"], en: "We [are] friends." },
        { tr: ["Onlar Alman", "(-lar)"], en: "They [are] German." },
      ],
      notlar: ["I → am", "he, she → is", "you, we, they → are"],
    },
    {
      baslik: "Kısa hali: I'm, you're, he's",
      metin: ["Konuşurken am, is, are çoğunlukla kısaltılır. Anlam aynıdır, ikisi de doğrudur."],
      ornekler: [
        { tr: ["I am"], en: "[I'm]" },
        { tr: ["you are"], en: "[you're]" },
        { tr: ["he is / she is"], en: "[he's] / [she's]" },
        { tr: ["what is"], en: "[what's]" },
      ],
    },
    {
      baslik: "-den eki = from (ve öne geçer)",
      metin: [
        "Türkçede “nereden?” sorusunu kelimenin sonundaki -den / -dan eki cevaplar: Türkiye'den, Almanya'dan.",
        "İngilizcede bu ek “from” kelimesidir ve yerin önüne gelir. Türkçede ek sonda, İngilizcede kelime başta.",
      ],
      ornekler: [
        { tr: ["Ben Türkiye", "-den", "-im"], en: "I [am] [from] Turkey." },
        { tr: ["O Almanya", "-dan"], en: "She [is] [from] Germany." },
      ],
    },
    {
      baslik: "Meslekten önce a",
      metin: [
        "Tek bir kişinin mesleğini söylerken önüne “a” gelir. Türkçede karşılığı yok; “bir öğrenciyim” gibi düşünebilirsin.",
        "Milliyette a gelmez: I am Turkish (a yok).",
      ],
      ornekler: [
        { tr: ["Ben öğretmen", "-im"], en: "I [am] [a] teacher." },
        { tr: ["Ben Türk", "-üm"], en: "I [am] Turkish." },
      ],
    },
  ],

  // ------------------------------------------------------------------ diyaloglar
  diyaloglar: [
    {
      baslik: "Dil kafesinde",
      sahne: "Bir dil kafesinde Anna ve Emre ilk kez karşılaşıyor.",
      kisiler: { A: { ad: "Anna", ses: "kadin" }, E: { ad: "Emre", ses: "erkek" } },
      satirlar: [
        { kim: "A", en: "Hello! I'm Anna.", tr: "Merhaba! Ben Anna." },
        { kim: "E", en: "Hi, Anna. My name is Emre.", tr: "Selam Anna. Benim adım Emre." },
        { kim: "A", en: "Nice to meet you, Emre.", tr: "Tanıştığımıza memnun oldum Emre." },
        { kim: "E", en: "Nice to meet you too. Where are you from?", tr: "Ben de memnun oldum. Nerelisin?" },
        { kim: "A", en: "I'm from England. I'm from London. And you?", tr: "İngiltere'denim. Londralıyım. Ya sen?" },
        { kim: "E", en: "I'm from Turkey. I'm from Istanbul.", tr: "Türkiye'denim. İstanbulluyum." },
        { kim: "A", en: "I'm a teacher. And you?", tr: "Ben öğretmenim. Ya sen?" },
        { kim: "E", en: "I'm a student.", tr: "Ben öğrenciyim." },
        { kim: "A", en: "Goodbye, Emre. See you!", tr: "Hoşça kal Emre. Görüşürüz!" },
        { kim: "E", en: "Bye, Anna!", tr: "Güle güle Anna!" },
      ],
    },
    {
      baslik: "İlk ders",
      sahne: "Sabah. Öğretmen Lisa, yeni öğrencisi Deniz ile tanışıyor.",
      kisiler: { L: { ad: "Lisa", ses: "kadin" }, D: { ad: "Deniz", ses: "erkek" } },
      satirlar: [
        { kim: "L", en: "Good morning!", tr: "Günaydın!" },
        { kim: "D", en: "Good morning!", tr: "Günaydın!" },
        { kim: "L", en: "I'm Lisa. I'm your teacher. What's your name?", tr: "Ben Lisa. Senin öğretmeninim. Adın ne?" },
        { kim: "D", en: "My name is Deniz.", tr: "Benim adım Deniz." },
        { kim: "L", en: "How are you, Deniz?", tr: "Nasılsın Deniz?" },
        { kim: "D", en: "I'm fine, thank you. And you?", tr: "İyiyim, teşekkür ederim. Ya siz?" },
        { kim: "L", en: "I'm fine, thanks. How old are you?", tr: "İyiyim, sağ ol. Kaç yaşındasın?" },
        { kim: "D", en: "I'm nineteen years old.", tr: "On dokuz yaşındayım." },
        { kim: "L", en: "Welcome, Deniz!", tr: "Hoş geldin Deniz!" },
        { kim: "D", en: "Thank you!", tr: "Teşekkür ederim!" },
      ],
    },
  ],

  // ------------------------------------------------------------------ okuma
  okuma: {
    baslik: "Zeynep ve Tom",
    satirlar: [
      { en: "Hello! My name is Zeynep.", tr: "Merhaba! Benim adım Zeynep." },
      { en: "I am twenty years old.", tr: "Yirmi yaşındayım." },
      { en: "I am from Turkey. I am from Izmir.", tr: "Türkiye'denim. İzmirliyim." },
      { en: "I am a student.", tr: "Öğrenciyim." },
      { en: "This is my friend Tom.", tr: "Bu benim arkadaşım Tom." },
      { en: "He is from England.", tr: "O İngiltere'den." },
      { en: "He is a teacher.", tr: "O bir öğretmen." },
      { en: "He is English, and I am Turkish.", tr: "O İngiliz, ben de Türk'üm." },
      { en: "We are friends.", tr: "Biz arkadaşız." },
    ],
    sorular: [
      { en: "Zeynep is twenty years old.", tr: "Zeynep yirmi yaşında.", dogru: true },
      { en: "Zeynep is from Germany.", tr: "Zeynep Almanya'dan.", dogru: false },
      { en: "Zeynep is a teacher.", tr: "Zeynep öğretmen.", dogru: false },
      { en: "Tom is from England.", tr: "Tom İngiltere'den.", dogru: true },
      { en: "Tom and Zeynep are friends.", tr: "Tom ve Zeynep arkadaş.", dogru: true },
    ],
  },

  // ------------------------------------------------------------------ alıştırmalar
  alistirmalar: {
    bosluk: [
      { cumle: "I ___ Emre.", tr: "Ben Emre'yim.", secenekler: ["am", "is", "are"], cevap: "am" },
      { cumle: "She ___ from England.", tr: "O İngiltere'den.", secenekler: ["am", "is", "are"], cevap: "is" },
      { cumle: "You ___ a student.", tr: "Sen öğrencisin.", secenekler: ["am", "is", "are"], cevap: "are" },
      { cumle: "He ___ a teacher.", tr: "O öğretmen.", secenekler: ["am", "is", "are"], cevap: "is" },
      { cumle: "We ___ friends.", tr: "Biz arkadaşız.", secenekler: ["am", "is", "are"], cevap: "are" },
      { cumle: "They ___ from Germany.", tr: "Onlar Almanya'dan.", secenekler: ["am", "is", "are"], cevap: "are" },
      { cumle: "My name ___ Deniz.", tr: "Benim adım Deniz.", secenekler: ["am", "is", "are"], cevap: "is" },
      { cumle: "I am ___ Turkey.", tr: "Türkiye'denim.", secenekler: ["from", "to", "a"], cevap: "from" },
      { cumle: "She is ___ teacher.", tr: "O bir öğretmen.", secenekler: ["a", "from", "is"], cevap: "a" },
      { cumle: "Nice to meet you ___.", tr: "Ben de memnun oldum.", secenekler: ["too", "and", "to"], cevap: "too" },
    ],
    siralama: [
      { cevap: "My name is Zeynep.", tr: "Benim adım Zeynep." },
      { cevap: "I am from Turkey.", tr: "Türkiye'denim." },
      { cevap: "Where are you from?", tr: "Nerelisin?" },
      { cevap: "Nice to meet you.", tr: "Tanıştığımıza memnun oldum." },
      { cevap: "How old are you?", tr: "Kaç yaşındasın?" },
      { cevap: "She is a teacher.", tr: "O bir öğretmen." },
    ],
  },

  // ------------------------------------------------------------------ motor
  motor: {
    aciklama: "Türkçe cümleyi gör, İngilizcesini yaz. Sadece bu ünitenin kelimeleri gelir.",
    kaliplar: [["be", "pos"]],
    malzeme: {
      ozne: [
        { en: "I", tr: "Ben", p: 0 },
        { en: "You", tr: "Sen", p: 1 },
        { en: "He", tr: "O (erkek)", p: 2 },
        { en: "She", tr: "O (kadın)", p: 2 },
        { en: "My friend", tr: "Arkadaşım", p: 2, nz: 1 },
      ],
      durum: [
        ["Turkish", "Türk"],
        ["English", "İngiliz"],
        ["German", "Alman"],
        ["a student", "öğrenci"],
        ["a teacher", "öğretmen"],
        ["from Turkey", "Türkiye'den"],
        ["from England", "İngiltere'den"],
        ["from Germany", "Almanya'dan"],
        ["fine", "iyi", ["good", "okay", "ok"]],
      ],
    },
  },

  // ------------------------------------------------------------------ konuşma
  konusma: [
    { en: "What's your name?", tr: "Adın ne?", ornek: "My name is Oğuz.", ornekTr: "Benim adım Oğuz." },
    { en: "Where are you from?", tr: "Nerelisin?", ornek: "I'm from Turkey. I'm from Ankara.", ornekTr: "Türkiye'denim. Ankaralıyım." },
    { en: "How are you?", tr: "Nasılsın?", ornek: "I'm fine, thank you. And you?", ornekTr: "İyiyim, teşekkür ederim. Ya sen?" },
    { en: "How old are you?", tr: "Kaç yaşındasın?", ornek: "I'm twenty years old.", ornekTr: "Yirmi yaşındayım." },
    { en: "Are you a student?", tr: "Öğrenci misin?", ornek: "Yes, I am. / No, I'm a teacher.", ornekTr: "Evet, öyleyim. / Hayır, öğretmenim." },
    { en: "Hello! Who are you?", tr: "Merhaba! Sen kimsin? (Kendini tanıt: adın, nerelisin, ne iş yapıyorsun.)", ornek: "Hello! My name is Oğuz. I'm from Turkey. I'm a student.", ornekTr: "Merhaba! Benim adım Oğuz. Türkiye'denim. Öğrenciyim." },
  ],

  // ------------------------------------------------------------------ test
  test: [
    { soru: "“Günaydın” İngilizcede nasıl söylenir?", secenekler: ["Good night", "Good morning", "Good evening"], dogru: 1, aciklama: "Good night sadece ayrılırken ya da yatarken söylenir." },
    { soru: "I ___ from Turkey.", secenekler: ["is", "are", "am"], dogru: 2, aciklama: "I ile her zaman am." },
    { soru: "Biri “Nice to meet you.” dedi. Ne cevap verirsin?", secenekler: ["Nice to meet you too.", "I'm fine.", "Goodbye."], dogru: 0, aciklama: "too = ben de." },
    { soru: "“How old are you?” ne soruyor?", secenekler: ["Nerelisin?", "Kaç yaşındasın?", "Nasılsın?"], dogru: 1, aciklama: "how old = kaç yaşında." },
    { soru: "“fifteen” kaç?", secenekler: ["5", "50", "15"], dogru: 2, aciklama: "-teen ile biten sayılar 13–19 arasıdır." },
    { soru: "She ___ a teacher.", secenekler: ["is", "am", "are"], dogru: 0, aciklama: "he ve she ile is." },
    { soru: "“Ben öğrenciyim.”", secenekler: ["I student.", "I am a student.", "I am student a."], dogru: 1, aciklama: "-yim eki = am, meslekten önce a." },
    { soru: "“Where are you from?” sorusunun cevabı hangisi?", secenekler: ["I'm twenty.", "I'm from Turkey.", "My name is Emre."], dogru: 1, aciklama: "where … from = nereden, nereli." },
    { soru: "Türkiye'den-im. Buradaki -den eki İngilizcede hangi kelime?", secenekler: ["to", "a", "from"], dogru: 2, aciklama: "-den = from, ve yerin önüne gelir: from Turkey." },
    { soru: "We ___ friends.", secenekler: ["are", "is", "am"], dogru: 0, aciklama: "we, you, they ile are." },
  ],

  ozelIsimler: ["Anna", "Emre", "London", "Istanbul", "Lisa", "Deniz", "Zeynep", "Izmir", "Tom", "Oğuz", "Ankara"],
};

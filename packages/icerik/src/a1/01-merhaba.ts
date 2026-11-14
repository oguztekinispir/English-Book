/**
 * A1 · Ünite 1 · Merhaba (4 ders)
 * Orijinal içerik. Taslak: Claude · Kontrol: öğretmen · Durum: inceleme bekliyor
 */
import type { Unite } from "../tipler";

/* Motor malzemesi: tekil özneler (meslekte "a" var, çoğulda olmaz) */
const OZNE = [
  { en: "I", tr: "Ben", p: 0 as const },
  { en: "You", tr: "Sen", p: 1 as const },
  { en: "He", tr: "O (erkek)", p: 2 as const },
  { en: "She", tr: "O (kadın)", p: 2 as const },
  { en: "My friend", tr: "Arkadaşım", p: 2 as const, nz: 1 as const },
];
const KIMLIK: [string, string, string[]?][] = [
  ["Turkish", "Türk"],
  ["English", "İngiliz"],
  ["German", "Alman"],
  ["a student", "öğrenci"],
  ["a teacher", "öğretmen"],
  ["from Turkey", "Türkiye'den"],
  ["from England", "İngiltere'den"],
  ["from Germany", "Almanya'dan"],
  ["fine", "iyi", ["good", "okay", "ok"]],
];
const YAS: [string, string, string[]?][] = [
  ["ten years old", "on yaşında", ["ten"]],
  ["twelve years old", "on iki yaşında", ["twelve"]],
  ["fifteen years old", "on beş yaşında", ["fifteen"]],
  ["sixteen years old", "on altı yaşında", ["sixteen"]],
  ["eighteen years old", "on sekiz yaşında", ["eighteen"]],
  ["nineteen years old", "on dokuz yaşında", ["nineteen"]],
  ["twenty years old", "yirmi yaşında", ["twenty"]],
];

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
    "Adını, nereli olduğunu ve ne iş yaptığını söylersin.",
    "0'dan 20'ye kadar sayar, yaşını söylersin.",
    "Karşındakine adını, nereli olduğunu ve yaşını sorarsın.",
  ],
  ozelIsimler: ["Anna", "Emre", "London", "Istanbul", "Lisa", "Deniz", "Zeynep", "Izmir", "Tom", "Oğuz", "Ankara", "Ece", "John"],

  dersler: [
    // ================================================================ 1.1
    {
      kod: "a1-01-1",
      no: 1,
      baslik: "Selamlaşma",
      hedef: "Selamlaşır, hal hatır sorar ve vedalaşırsın.",
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
            { en: "welcome", tr: "hoş geldin", ok: "uelkım" },
          ],
        },
        {
          ad: "Nezaket",
          kelimeler: [
            { en: "please", tr: "lütfen", ok: "pliiz" },
            { en: "thank you", tr: "teşekkür ederim", ok: "thenk yu", ipucu: "th: dilinin ucunu dişlerinin arasına koy, öyle 't' de. Türkçede bu ses yok." },
            { en: "thanks", tr: "sağ ol, teşekkürler", ok: "thenks" },
            { en: "yes", tr: "evet", ok: "yes" },
            { en: "no", tr: "hayır", ok: "nou" },
            { en: "sorry", tr: "özür dilerim, pardon", ok: "sori" },
            { en: "excuse me", tr: "affedersiniz (birine seslenirken)", ok: "ikskyuuz mi" },
            { en: "nice", tr: "hoş, güzel", ok: "nays", ornek: ["Nice to meet you.", "Tanıştığımıza memnun oldum."] },
            { en: "meet", tr: "tanışmak, buluşmak", ok: "miit" },
          ],
        },
        {
          ad: "Küçük kelimeler",
          kelimeler: [
            { en: "I", tr: "ben", ok: "ay", ipucu: "Cümlenin neresinde olursa olsun hep büyük harfle yazılır." },
            { en: "you", tr: "sen, siz", ok: "yu", ipucu: "İngilizcede sen ve siz aynı kelime: you." },
            { en: "am", tr: "-im, -ım (ben ile)", ok: "em" },
            { en: "are", tr: "-sin, -siniz, -iz (sen, siz, biz, onlar ile)", ok: "ar" },
            { en: "how", tr: "nasıl", ok: "hau" },
            { en: "fine", tr: "iyi", ok: "fayn" },
            { en: "and", tr: "ve; ya (soru sorarken)", ok: "end", ornek: ["And you?", "Ya sen?"] },
            { en: "too", tr: "de, da (ben de)", ok: "tuu", ornek: ["Nice to meet you too.", "Ben de memnun oldum."] },
            { en: "to", tr: "-e, -a; -mek", ok: "tu" },
          ],
        },
      ],
      kaliplar: [
        { en: "How are you?", tr: "Nasılsın?" },
        { en: "I'm fine, thank you. And you?", tr: "İyiyim, teşekkür ederim. Ya sen?", not: "I'm = I am" },
        { en: "Fine, thanks.", tr: "İyiyim, sağ ol." },
        { en: "Nice to meet you.", tr: "Tanıştığımıza memnun oldum.", not: "İlk tanışmada." },
        { en: "Nice to meet you too.", tr: "Ben de memnun oldum.", not: "Cevap olarak." },
        { en: "See you!", tr: "Görüşürüz!" },
        { en: "Excuse me.", tr: "Affedersiniz.", not: "Birine seslenirken, yol isterken." },
        { en: "Sorry!", tr: "Pardon! Özür dilerim!", not: "Bir hata yapınca." },
      ],
      gramer: [
        {
          baslik: "I'm fine: “iyi-yim”deki -im = am",
          metin: [
            "“İyiyim” tek kelime ama içinde iki parça var: iyi + -yim. İngilizcede -yim eki ayrı bir kelimedir: am. Ben de ayrıca söylenir: I.",
            "Konuşurken I am kısalır ve I'm olur. İkisi de doğru. Bir sonraki derste bunun bütün kuralını göreceksin; şimdilik kalıp olarak kullan.",
          ],
          ornekler: [
            { tr: ["(Ben) iyi", "-yim"], en: "I [am] fine." },
            { tr: ["(Ben) iyi", "-yim"], en: "[I'm] fine." },
            { tr: ["Nasıl", "-sın?"], en: "How [are] you?" },
          ],
        },
      ],
      diyaloglar: [
        {
          baslik: "Sabah, apartmanda",
          sahne: "Ece ile komşusu John sabah merdivenlerde karşılaşıyor.",
          kisiler: { E: { ad: "Ece", ses: "kadin" }, J: { ad: "John", ses: "erkek" } },
          satirlar: [
            { kim: "E", en: "Good morning, John!", tr: "Günaydın John!" },
            { kim: "J", en: "Good morning, Ece! How are you?", tr: "Günaydın Ece! Nasılsın?" },
            { kim: "E", en: "I'm fine, thank you. And you?", tr: "İyiyim, teşekkür ederim. Ya sen?" },
            { kim: "J", en: "Fine, thanks.", tr: "İyiyim, sağ ol." },
            { kim: "E", en: "Goodbye, John!", tr: "Hoşça kal John!" },
            { kim: "J", en: "Bye, Ece! See you!", tr: "Güle güle Ece! Görüşürüz!" },
          ],
        },
      ],
      alistirmalar: {
        bosluk: [
          { cumle: "Good ___! (sabah)", tr: "Günaydın!", secenekler: ["morning", "night", "evening"], cevap: "morning" },
          { cumle: "Good ___! (yatarken)", tr: "İyi geceler!", secenekler: ["morning", "afternoon", "night"], cevap: "night" },
          { cumle: "How ___ you?", tr: "Nasılsın?", secenekler: ["am", "are", "and"], cevap: "are" },
          { cumle: "I'm fine, ___ you.", tr: "İyiyim, teşekkür ederim.", secenekler: ["thank", "please", "sorry"], cevap: "thank" },
          { cumle: "Nice to meet you ___.", tr: "Ben de memnun oldum.", secenekler: ["too", "and", "to"], cevap: "too" },
        ],
        siralama: [
          { cevap: "How are you?", tr: "Nasılsın?" },
          { cevap: "Nice to meet you.", tr: "Tanıştığımıza memnun oldum." },
          { cevap: "I am fine, thank you.", tr: "İyiyim, teşekkür ederim." },
        ],
      },
      konusma: [
        { en: "Good morning!", tr: "Günaydın!", ornek: "Good morning!", ornekTr: "Günaydın!" },
        { en: "How are you?", tr: "Nasılsın?", ornek: "I'm fine, thank you. And you?", ornekTr: "İyiyim, teşekkür ederim. Ya sen?" },
        { en: "Nice to meet you.", tr: "Tanıştığımıza memnun oldum.", ornek: "Nice to meet you too.", ornekTr: "Ben de memnun oldum." },
      ],
      test: [
        { soru: "“Günaydın” İngilizcede nasıl söylenir?", secenekler: ["Good night", "Good morning", "Good evening"], dogru: 1, aciklama: "Good night sadece ayrılırken ya da yatarken söylenir." },
        { soru: "Akşam bir arkadaşınla karşılaştın. Ne dersin?", secenekler: ["Good evening!", "Good night!", "Goodbye!"], dogru: 0, aciklama: "Karşılaşınca good evening, ayrılırken good night." },
        { soru: "Biri “Nice to meet you.” dedi. Ne cevap verirsin?", secenekler: ["Nice to meet you too.", "I'm fine.", "Goodbye."], dogru: 0, aciklama: "too = ben de." },
        { soru: "“How are you?” sorusunun cevabı hangisi?", secenekler: ["Thank you.", "I'm fine, thanks.", "See you!"], dogru: 1, aciklama: "How are you? = Nasılsın? → I'm fine = İyiyim." },
        { soru: "“thank you” ne demek?", secenekler: ["lütfen", "özür dilerim", "teşekkür ederim"], dogru: 2, aciklama: "please = lütfen, sorry = özür dilerim." },
      ],
    },

    // ================================================================ 1.2
    {
      kod: "a1-01-2",
      no: 2,
      baslik: "Ben kimim?",
      hedef: "Adını, nereli olduğunu ve ne iş yaptığını söyler, karşındakine sorarsın.",
      kelimeGruplari: [
        {
          ad: "Kişiler",
          kelimeler: [
            { en: "he", tr: "o (erkek)", ok: "hii" },
            { en: "she", tr: "o (kadın)", ok: "şii", ipucu: "Türkçede tek bir 'o' var. İngilizcede erkek için he, kadın için she." },
            { en: "we", tr: "biz", ok: "uii" },
            { en: "they", tr: "onlar", ok: "dhey", ipucu: "th burada yumuşak: dilin ucu dişlerin arasında, 'd' gibi." },
            { en: "is", tr: "-dir, -dır (o ile)", ok: "iz" },
            { en: "my", tr: "benim", ok: "may", ornek: ["My name is Emre.", "Benim adım Emre."] },
            { en: "your", tr: "senin, sizin", ok: "yor", ornek: ["What's your name?", "Senin adın ne?"] },
            { en: "this", tr: "bu", ok: "dhis", ornek: ["This is my friend.", "Bu benim arkadaşım."] },
            { en: "name", tr: "isim, ad", ok: "neym" },
            { en: "friend", tr: "arkadaş", ok: "frend" },
            { en: "teacher", tr: "öğretmen", ok: "tiiçır" },
            { en: "student", tr: "öğrenci", ok: "styuudınt" },
            { en: "man", tr: "adam, erkek", ok: "men" },
            { en: "woman", tr: "kadın", ok: "uumın" },
            { en: "a", tr: "bir (meslekten önce)", ok: "ı", ornek: ["I am a student.", "Ben öğrenciyim."] },
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
          ad: "Soru kelimeleri",
          kelimeler: [
            { en: "what", tr: "ne", ok: "uat" },
            { en: "where", tr: "nerede, nere", ok: "uer" },
            { en: "who", tr: "kim", ok: "huu" },
          ],
        },
      ],
      kaliplar: [
        { en: "What's your name?", tr: "Adın ne?", not: "What's = What is" },
        { en: "My name is Emre.", tr: "Benim adım Emre." },
        { en: "I'm Emre.", tr: "Ben Emre'yim.", not: "I'm = I am" },
        { en: "Where are you from?", tr: "Nerelisin?", not: "Kelime kelime: Nereden sin?" },
        { en: "I'm from Turkey.", tr: "Türkiye'denim." },
        { en: "This is my friend.", tr: "Bu benim arkadaşım.", not: "Birini tanıştırırken." },
      ],
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
            { tr: ["Onlar Alman", "(-dır)"], en: "They [are] German." },
          ],
          notlar: ["I → am", "he, she → is", "you, we, they → are", "friends: sondaki -s, Türkçedeki -ler eki (arkadaş-lar). Çoğulu Ünite 4'te göreceksin."],
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
          metin: ["Tek bir kişinin mesleğini söylerken önüne “a” gelir. Türkçede karşılığı yok; “bir öğrenciyim” gibi düşünebilirsin.", "Milliyette a gelmez: I am Turkish (a yok)."],
          ornekler: [
            { tr: ["Ben öğretmen", "-im"], en: "I [am] [a] teacher." },
            { tr: ["Ben Türk", "-üm"], en: "I [am] Turkish." },
          ],
        },
      ],
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
      ],
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
        ],
        siralama: [
          { cevap: "My name is Zeynep.", tr: "Benim adım Zeynep." },
          { cevap: "I am from Turkey.", tr: "Türkiye'denim." },
          { cevap: "Where are you from?", tr: "Nerelisin?" },
          { cevap: "She is a teacher.", tr: "O bir öğretmen." },
        ],
      },
      motor: {
        aciklama: "Türkçe cümleyi gör, İngilizcesini yaz. Sadece bu dersin kelimeleri gelir.",
        kaliplar: [["be", "pos"]],
        malzeme: { ozne: OZNE, durum: KIMLIK },
      },
      konusma: [
        { en: "What's your name?", tr: "Adın ne?", ornek: "My name is Oğuz.", ornekTr: "Benim adım Oğuz." },
        { en: "Where are you from?", tr: "Nerelisin?", ornek: "I'm from Turkey. I'm from Ankara.", ornekTr: "Türkiye'denim. Ankaralıyım." },
        { en: "Are you a student?", tr: "Öğrenci misin?", ornek: "Yes, I am. / No, I'm a teacher.", ornekTr: "Evet, öyleyim. / Hayır, öğretmenim." },
        { en: "Hello! Who are you?", tr: "Merhaba! Sen kimsin?", ornek: "Hello! My name is Oğuz. I'm from Turkey. I'm a student.", ornekTr: "Merhaba! Benim adım Oğuz. Türkiye'denim. Öğrenciyim." },
      ],
      test: [
        { soru: "I ___ from Turkey.", secenekler: ["is", "are", "am"], dogru: 2, aciklama: "I ile her zaman am." },
        { soru: "She ___ a teacher.", secenekler: ["is", "am", "are"], dogru: 0, aciklama: "he ve she ile is." },
        { soru: "“Ben öğrenciyim.”", secenekler: ["I student.", "I am a student.", "I am student a."], dogru: 1, aciklama: "-yim eki = am, meslekten önce a." },
        { soru: "“Where are you from?” sorusunun cevabı hangisi?", secenekler: ["I'm a teacher.", "I'm from Turkey.", "My name is Emre."], dogru: 1, aciklama: "where … from = nereden, nereli." },
        { soru: "Türkiye'den-im. Buradaki -den eki İngilizcede hangi kelime?", secenekler: ["to", "a", "from"], dogru: 2, aciklama: "-den = from, ve yerin önüne gelir: from Turkey." },
      ],
    },

    // ================================================================ 1.3
    {
      kod: "a1-01-3",
      no: 3,
      baslik: "Sayılar ve yaş",
      hedef: "0'dan 20'ye kadar sayar, yaşını söyler ve sorarsın.",
      kelimeGruplari: [
        {
          ad: "Sayılar 0–10",
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
          ],
        },
        {
          ad: "Sayılar 11–20",
          kelimeler: [
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
        {
          ad: "Yaş",
          kelimeler: [
            { en: "how old", tr: "kaç yaşında", ok: "hau ould", ornek: ["How old are you?", "Kaç yaşındasın?"] },
            { en: "old", tr: "yaşlı; (yaşla birlikte) yaşında", ok: "ould" },
            { en: "year", tr: "yıl", ok: "yiır", ornek: ["I am twenty years old.", "Yirmi yaşındayım."] },
          ],
        },
      ],
      kaliplar: [
        { en: "How old are you?", tr: "Kaç yaşındasın?", not: "Kelime kelime: Ne kadar yaşlısın?" },
        { en: "I'm twenty years old.", tr: "Yirmi yaşındayım.", not: "years old'u atabilirsin: I'm twenty." },
        { en: "How old is your friend?", tr: "Arkadaşın kaç yaşında?" },
      ],
      gramer: [
        {
          baslik: "Yaş söylerken de am / is / are",
          metin: [
            "Türkçede “yirmi yaşında-yım” deriz; sondaki -yım eki yine am olur. İngilizcede yaş “yıl” ile söylenir: twenty years old (yirmi yıl yaşlı).",
            "years old'u atıp sadece sayıyı da söyleyebilirsin: I'm twenty.",
          ],
          ornekler: [
            { tr: ["Ben yirmi yaşında", "-yım"], en: "I [am] twenty years old." },
            { tr: ["O on beş yaşında"], en: "She [is] fifteen." },
            { tr: ["Kaç yaşında", "-sın?"], en: "How old [are] you?" },
          ],
        },
        {
          baslik: "13–19: sonu -teen",
          metin: ["On üçten on dokuza kadar bütün sayılar -teen ile biter. Vurgu sondadır: thir-TEEN, four-TEEN. Üç ve beşte kök biraz değişir: three → thir-teen, five → fif-teen."],
          ornekler: [
            { tr: ["4 → 14"], en: "four → four[teen]" },
            { tr: ["3 → 13"], en: "three → thir[teen]" },
            { tr: ["5 → 15"], en: "five → fif[teen]" },
          ],
        },
      ],
      diyaloglar: [
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
      alistirmalar: {
        bosluk: [
          { cumle: "I am ___ years old. (15)", tr: "On beş yaşındayım.", secenekler: ["five", "fifteen", "fourteen"], cevap: "fifteen" },
          { cumle: "She is ___. (12)", tr: "O on iki yaşında.", secenekler: ["twelve", "twenty", "eleven"], cevap: "twelve" },
          { cumle: "How ___ are you?", tr: "Kaç yaşındasın?", secenekler: ["old", "is", "year"], cevap: "old" },
          { cumle: "He ___ nineteen years old.", tr: "O on dokuz yaşında.", secenekler: ["am", "is", "are"], cevap: "is" },
          { cumle: "Three, four, five, ___.", tr: "Üç, dört, beş, altı.", secenekler: ["six", "seven", "sixteen"], cevap: "six" },
        ],
        siralama: [
          { cevap: "How old are you?", tr: "Kaç yaşındasın?" },
          { cevap: "I am nineteen years old.", tr: "On dokuz yaşındayım." },
          { cevap: "My friend is twenty.", tr: "Arkadaşım yirmi yaşında." },
        ],
      },
      motor: {
        aciklama: "Yaş cümleleri. years old'u yazmadan da kabul edilir.",
        kaliplar: [["be", "pos"]],
        malzeme: { ozne: OZNE, durum: YAS },
      },
      konusma: [
        { en: "How old are you?", tr: "Kaç yaşındasın?", ornek: "I'm twenty years old.", ornekTr: "Yirmi yaşındayım." },
        { en: "How old is your friend?", tr: "Arkadaşın kaç yaşında?", ornek: "My friend is nineteen.", ornekTr: "Arkadaşım on dokuz yaşında." },
        { en: "Seven, eight, nine…?", tr: "Yedi, sekiz, dokuz…? (Devam et, yirmiye kadar say.)", ornek: "Ten, eleven, twelve, thirteen…", ornekTr: "On, on bir, on iki, on üç…" },
      ],
      test: [
        { soru: "“fifteen” kaç?", secenekler: ["5", "50", "15"], dogru: 2, aciklama: "-teen ile biten sayılar 13–19 arasıdır." },
        { soru: "12 İngilizcede hangisi?", secenekler: ["twelve", "twenty", "eleven"], dogru: 0, aciklama: "eleven 11, twelve 12, twenty 20." },
        { soru: "“How old are you?” ne soruyor?", secenekler: ["Nerelisin?", "Kaç yaşındasın?", "Nasılsın?"], dogru: 1, aciklama: "how old = kaç yaşında." },
        { soru: "“On dokuz yaşındayım.”", secenekler: ["I nineteen years old.", "I am nineteen years old.", "I am nine years old."], dogru: 1, aciklama: "-yım = am; nineteen 19, nine 9." },
        { soru: "13 hangisi?", secenekler: ["thirty", "three", "thirteen"], dogru: 2, aciklama: "three 3, thirteen 13. thirty (30) ileride." },
      ],
    },

    // ================================================================ 1.4
    {
      kod: "a1-01-4",
      no: 4,
      baslik: "Tekrar ve ünite testi",
      hedef: "Ünitenin hepsini bir arada kullanırsın: kendini tanıtırsın, karşındakini tanırsın.",
      tekrar: true,
      kelimeGruplari: [],
      kaliplar: [],
      gramer: [
        {
          baslik: "Ünitenin özeti",
          metin: ["Bu ünitede tek bir kural öğrendin: Türkçedeki -im, -sin, -dir ekleri İngilizcede am, are, is olur. Geri kalan her şey bu kuralın üstüne kuruldu."],
          ornekler: [
            { tr: ["(Ben) iyi", "-yim"], en: "I['m] fine." },
            { tr: ["Ben Türkiye", "-den", "-im"], en: "I [am] [from] Turkey." },
            { tr: ["O öğretmen", "(-dir)"], en: "She [is] [a] teacher." },
            { tr: ["Yirmi yaşında", "-yım"], en: "I [am] twenty years old." },
          ],
          notlar: ["I → am", "he, she → is", "you, we, they → are"],
        },
      ],
      diyaloglar: [],
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
      alistirmalar: {
        bosluk: [
          { cumle: "Good ___! How are you?", tr: "Günaydın! Nasılsın?", secenekler: ["morning", "night", "bye"], cevap: "morning" },
          { cumle: "My name ___ Tom.", tr: "Benim adım Tom.", secenekler: ["am", "is", "are"], cevap: "is" },
          { cumle: "We ___ from Turkey.", tr: "Biz Türkiye'deniz.", secenekler: ["am", "is", "are"], cevap: "are" },
          { cumle: "I am ___ student.", tr: "Ben öğrenciyim.", secenekler: ["a", "from", "to"], cevap: "a" },
          { cumle: "She is ___ years old. (18)", tr: "O on sekiz yaşında.", secenekler: ["eight", "eighteen", "eleven"], cevap: "eighteen" },
        ],
        siralama: [
          { cevap: "This is my friend Tom.", tr: "Bu benim arkadaşım Tom." },
          { cevap: "He is from England.", tr: "O İngiltere'den." },
          { cevap: "Nice to meet you too.", tr: "Ben de memnun oldum." },
        ],
      },
      motor: {
        aciklama: "Ünitenin bütün cümleleri karışık.",
        kaliplar: [["be", "pos"]],
        malzeme: { ozne: OZNE, durum: [...KIMLIK, ...YAS] },
      },
      konusma: [
        { en: "What's your name?", tr: "Adın ne?", ornek: "My name is Oğuz.", ornekTr: "Benim adım Oğuz." },
        { en: "Where are you from?", tr: "Nerelisin?", ornek: "I'm from Turkey. I'm from Ankara.", ornekTr: "Türkiye'denim. Ankaralıyım." },
        { en: "How are you?", tr: "Nasılsın?", ornek: "I'm fine, thank you. And you?", ornekTr: "İyiyim, teşekkür ederim. Ya sen?" },
        { en: "How old are you?", tr: "Kaç yaşındasın?", ornek: "I'm twenty years old.", ornekTr: "Yirmi yaşındayım." },
        { en: "Are you a student?", tr: "Öğrenci misin?", ornek: "Yes, I am. / No, I'm a teacher.", ornekTr: "Evet, öyleyim. / Hayır, öğretmenim." },
        { en: "Hello! Who are you?", tr: "Merhaba! Sen kimsin? (Kendini tanıt: adın, yaşın, nerelisin, ne iş yapıyorsun.)", ornek: "Hello! My name is Oğuz. I'm twenty years old. I'm from Turkey. I'm a student.", ornekTr: "Merhaba! Benim adım Oğuz. Yirmi yaşındayım. Türkiye'denim. Öğrenciyim." },
      ],
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
    },
  ],
};

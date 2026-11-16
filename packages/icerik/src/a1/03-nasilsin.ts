/**
 * A1 · Ünite 3 · Nasılsın? (3 ders)
 * Orijinal içerik. Taslak: Claude · Kontrol: öğretmen · Durum: inceleme bekliyor
 * Gramer: am / is / are tamamı (it dahil), duygu ve durum sıfatları (acıktım = I'm hungry), renkler, sıfat + isim
 * Hikâye: Moda Apartmanı, bölüm 8–9. Deniz hastalanıyor; John'un yeni arabası ve büyük siyah çantası.
 */
import type { Unite } from "../tipler";

/* Motor malzemesi */
const KISI = [
  { en: "I", tr: "Ben", p: 0 as const },
  { en: "You", tr: "Sen", p: 1 as const },
  { en: "He", tr: "O (erkek)", p: 2 as const },
  { en: "She", tr: "O (kadın)", p: 2 as const },
  { en: "We", tr: "Biz", p: 3 as const },
  { en: "They", tr: "Onlar", p: 5 as const },
  { en: "My friend", tr: "Arkadaşım", p: 2 as const, nz: 1 as const },
];
/** Türkçe karşılığı "susamış", "sıkılmış" gibi olanları motor doğal fiille söyler: Susadım, Sıkıldım */
const DUYGU: [string, string, string[]?][] = [
  ["happy", "mutlu"],
  ["sad", "üzgün"],
  ["tired", "yorgun"],
  ["hungry", "aç"],
  ["thirsty", "susamış"],
  ["bored", "sıkılmış"],
  ["scared", "korkmuş"],
  ["cold", "üşümüş"],
  ["hot", "sıcaklamış"],
  ["angry", "kızgın"],
  ["sick", "hasta"],
  ["worried", "endişeli"],
  ["excited", "heyecanlı"],
];
const ESYA = [
  { en: "It", tr: "O (eşya)", p: 2 as const },
  { en: "My car", tr: "Arabam", p: 2 as const, nz: 1 as const, kok: "Araba" },
  { en: "My bag", tr: "Çantam", p: 2 as const, nz: 1 as const, kok: "Çanta" },
  { en: "My phone", tr: "Telefonum", p: 2 as const, nz: 1 as const, kok: "Telefon" },
];
const RENK_SIFAT: [string, string, string[]?][] = [
  ["red", "kırmızı"],
  ["blue", "mavi"],
  ["green", "yeşil"],
  ["yellow", "sarı"],
  ["black", "siyah"],
  ["white", "beyaz"],
  ["orange", "turuncu"],
  ["pink", "pembe"],
  ["grey", "gri", ["gray"]],
  ["big", "büyük"],
  ["small", "küçük"],
  ["new", "yeni"],
  ["beautiful", "güzel", ["nice"]],
];

export const A1_03: Unite = {
  id: "a1000000-0000-4000-8000-000000000003",
  kod: "a1-03",
  seviye: "A1",
  sira: 3,
  baslik: "Nasılsın?",
  baslikEn: "How are you?",
  gramerEtiketi: "am / is / are tamamı, sıfatlar, renkler",
  hedefler: [
    "Nasıl hissettiğini söylersin: yorgunum, acıktım, üşüyorum.",
    "Başkasına “Neyin var?”, “Neden?” diye sorarsın.",
    "Renkleri ve eşyaların nasıl olduğunu söylersin.",
    "am / is / are'ın hepsini (it dahil) doğru kullanırsın.",
  ],
  ozelIsimler: ["Deniz", "Ece", "John", "Kerem", "Anna", "Emre", "Lisa", "Selin", "Mark", "Sarah", "Istanbul"],

  dersler: [
    // ================================================================ 3.1
    {
      kod: "a1-03-1",
      no: 1,
      baslik: "Nasılsın?",
      hedef: "Nasıl hissettiğini söyler, başkasına neyi olduğunu sorarsın.",
      kelimeGruplari: [
        {
          ad: "Duygular",
          kelimeler: [
            { en: "happy", tr: "mutlu", ok: "hepi" },
            { en: "sad", tr: "üzgün", ok: "sed" },
            { en: "angry", tr: "kızgın", ok: "engri" },
            { en: "worried", tr: "endişeli", ok: "warid" },
            { en: "excited", tr: "heyecanlı", ok: "iksaytid" },
            { en: "bored", tr: "sıkılmış", ok: "boord", ornek: ["I'm bored.", "Sıkıldım."], ipucu: "Türkçede fiil (sıkıldım), İngilizcede am + bored." },
            { en: "scared", tr: "korkmuş", ok: "skeırd", ornek: ["I'm scared.", "Korkuyorum."] },
          ],
        },
        {
          ad: "Beden",
          kelimeler: [
            { en: "tired", tr: "yorgun", ok: "tayıd" },
            { en: "hungry", tr: "aç", ok: "hangri", ornek: ["I'm hungry.", "Acıktım."], ipucu: "“Acıktım” geçmiş zaman gibi görünür ama şu anki durumu anlatır: I'm hungry." },
            { en: "thirsty", tr: "susamış", ok: "thörsti", ornek: ["I'm thirsty.", "Susadım."] },
            { en: "cold", tr: "soğuk; üşümüş", ok: "kould", ornek: ["I'm cold.", "Üşüyorum."], ipucu: "Kişi için “üşüyorum”, hava için “soğuk”. İkisi de cold." },
            { en: "hot", tr: "sıcak; sıcaklamış", ok: "hat", ornek: ["I'm hot.", "Sıcakladım."] },
            { en: "sick", tr: "hasta", ok: "sik" },
            { en: "well", tr: "iyi, sağlıklı", ok: "uel", ornek: ["I'm not very well.", "Pek iyi değilim."] },
          ],
        },
        {
          ad: "Ne kadar?",
          kelimeler: [
            { en: "great", tr: "harika", ok: "greyt" },
            { en: "bad", tr: "kötü", ok: "bed" },
            { en: "not bad", tr: "fena değil", ok: "nat bed" },
            { en: "a little", tr: "biraz", ok: "ı litıl", ornek: ["I'm a little tired.", "Biraz yorgunum."], ipucu: "very gibi sıfatın önüne gelir: a little tired, very tired." },
            { en: "really", tr: "gerçekten; gerçekten mi?", ok: "riıli" },
          ],
        },
        {
          ad: "Neden?",
          kelimeler: [
            { en: "why", tr: "neden, niye", ok: "uay" },
            { en: "because", tr: "çünkü", ok: "bikoz" },
            { en: "but", tr: "ama, fakat", ok: "bat" },
            { en: "wrong", tr: "yanlış, ters", ok: "rong", ornek: ["What's wrong?", "Neyin var? / Ne oldu?"] },
            { en: "water", tr: "su", ok: "wootı" },
            { en: "tea", tr: "çay", ok: "tii" },
          ],
        },
      ],
      kaliplar: [
        { en: "How are you today?", tr: "Bugün nasılsın?" },
        { en: "I'm great!", tr: "Harikayım!" },
        { en: "Not bad, thanks.", tr: "Fena değil, sağ ol." },
        { en: "I'm not very well.", tr: "Pek iyi değilim." },
        { en: "What's wrong?", tr: "Neyin var? / Ne oldu?", not: "Birinin keyfi yoksa." },
        { en: "Are you OK?", tr: "İyi misin?" },
        { en: "Why are you sad?", tr: "Neden üzgünsün?" },
        { en: "Because I'm tired.", tr: "Çünkü yorgunum." },
      ],
      gramer: [
        {
          baslik: "am / is / are: bütün tablo",
          metin: [
            "Türkçede durumu kişi eki söyler: yorgun-um, yorgun-sun, yorgun, yorgun-uz, yorgun-sunuz, yorgun-lar. İngilizcede ek yok; onun yerine üç kelimeden biri gelir: am, is, are.",
            "Kural kısa: I ile am; he, she, it ile is; geri kalan herkesle are.",
          ],
          ornekler: [
            { tr: ["Yorgun", "-um"], en: "I [am] tired." },
            { tr: ["Yorgun", "-sun"], en: "You [are] tired." },
            { tr: ["O yorgun"], en: "She [is] tired." },
            { tr: ["Yorgun", "-uz"], en: "We [are] tired." },
            { tr: ["Yorgun", "-sunuz"], en: "You [are] tired." },
            { tr: ["Onlar yorgun"], en: "They [are] tired." },
          ],
          notlar: ["I → am", "he / she / it → is", "you / we / they → are", "İngilizcede sen ve siz aynı: you are."],
        },
        {
          baslik: "Acıktım = I'm hungry",
          metin: [
            "Türkçede bazı durumları fiille söyleriz: acıktım, susadım, sıkıldım, üşüyorum, korkuyorum. Bunlar geçmiş zaman ya da “-yor” gibi görünür ama aslında şu anki durumu anlatır.",
            "İngilizcede bunlar fiil değil, durumdur. Yani yorgunum der gibi söylenir: I am + hungry. “I hungried” diye bir şey yok.",
          ],
          ornekler: [
            { tr: ["Acık", "-tı", "-m"], en: "I [am] hungry." },
            { tr: ["Susa", "-dı", "-m"], en: "I [am] thirsty." },
            { tr: ["Sıkıl", "-dı", "-n mı?"], en: "[Are] you bored?" },
            { tr: ["Üşü", "-yor", "-um"], en: "I [am] cold." },
            { tr: ["Kork", "-uyor", "-uz"], en: "We [are] scared." },
          ],
          notlar: ["Olumsuzu da aynı: Acıkmadım → I'm not hungry.", "Soru: Susadın mı? → Are you thirsty?"],
        },
        {
          baslik: "very ve a little: sıfatın önünde",
          metin: ["Türkçedeki gibi: çok yorgun = very tired, biraz yorgun = a little tired. Sıra aynı, sadece am / is / are'ı unutma."],
          ornekler: [
            { tr: ["Çok", "mutlu", "-yum"], en: "I am [very] happy." },
            { tr: ["Biraz", "endişeli", "-yim"], en: "I am [a little] worried." },
            { tr: ["Pek iyi", "değil", "-im"], en: "I am [not very] well." },
          ],
        },
        {
          baslik: "Neden? Çünkü…",
          metin: ["why soru kelimesi olduğu için en başa gelir, sonra am / is / are. Cevap because ile başlar ve normal bir cümle gibi devam eder."],
          ornekler: [
            { tr: ["Neden", "üzgünsün?"], en: "[Why] are you sad?" },
            { tr: ["Çünkü", "yorgunum."], en: "[Because] I'm tired." },
          ],
        },
      ],
      diyaloglar: [
        {
          baslik: "Hasta mısın?",
          sahne: "Sabah, Moda Apartmanı. Ece, Deniz'in kapısını çalıyor; Deniz pek iyi görünmüyor.",
          bolum: 8,
          yer: "apartman",
          onceki: "Emre'nin bekâr ve hep meşgul olduğunu öğrendik. Moda Apartmanı'na dönüyoruz: Deniz bu sabah pek iyi değil.",
          anahtar: ["tired", "cold", "sick", "hungry", "thirsty", "great"],
          sorular: [
            { en: "Deniz is very well today.", dogru: false },
            { en: "Deniz is thirsty.", dogru: true },
            { en: "Selin is a doctor.", dogru: false },
          ],
          kisiler: { E: { ad: "Ece", ses: "kadin" }, D: { ad: "Deniz", ses: "erkek" } },
          satirlar: [
            { kim: "E", en: "Good morning, Deniz! How are you today?", tr: "Günaydın Deniz! Bugün nasılsın?" },
            { kim: "D", en: "Not very well. I'm tired and I'm cold.", tr: "Pek iyi değilim. Yorgunum, bir de üşüyorum." },
            { kim: "E", en: "Really? Are you sick?", tr: "Gerçekten mi? Hasta mısın?" },
            { kim: "D", en: "Maybe. I'm not hungry, but I'm very thirsty.", tr: "Belki. Aç değilim ama çok susadım." },
            { kim: "E", en: "Water or tea?", tr: "Su mu, çay mı?" },
            { kim: "D", en: "Tea, please. Thank you, Ece.", tr: "Çay lütfen. Teşekkürler Ece." },
            { kim: "E", en: "My friend Selin is a nurse. She's at home today.", tr: "Arkadaşım Selin hemşire. Bugün evde." },
            { kim: "D", en: "Thanks, Ece. You're a great friend!", tr: "Sağ ol Ece. Harika bir arkadaşsın!" },
          ],
        },
      ],
      miniDiyaloglar: [
        {
          baslik: "Neyin var?",
          sahne: "Dil kafesinde Anna, Emre'nin keyfinin olmadığını fark ediyor.",
          kisiler: { A: { ad: "Anna", ses: "kadin" }, E: { ad: "Emre", ses: "erkek" } },
          satirlar: [
            { kim: "A", en: "Emre, what's wrong? Are you angry?", tr: "Emre, neyin var? Kızgın mısın?" },
            { kim: "E", en: "No, I'm not angry. I'm worried. My mother is sick.", tr: "Hayır, kızgın değilim. Endişeliyim. Annem hasta." },
            { kim: "A", en: "I'm sorry, Emre.", tr: "Çok üzüldüm Emre." },
          ],
        },
        {
          baslik: "Neden mutlusun?",
          sahne: "Sınıfta Lisa, Deniz'in bugün çok neşeli olduğunu görüyor.",
          kisiler: { L: { ad: "Lisa", ses: "kadin" }, D: { ad: "Deniz", ses: "erkek" } },
          satirlar: [
            { kim: "L", en: "Deniz, you're very happy today! Why?", tr: "Deniz, bugün çok mutlusun! Neden?" },
            { kim: "D", en: "Because my family is here today!", tr: "Çünkü ailem bugün burada!" },
            { kim: "L", en: "Really? That's great!", tr: "Gerçekten mi? Harika!" },
          ],
        },
        {
          baslik: "Acıktım!",
          sahne: "Kerem, ablası Ece'ye uğruyor.",
          kisiler: { K: { ad: "Kerem", ses: "erkek" }, E: { ad: "Ece", ses: "kadin" } },
          satirlar: [
            { kim: "K", en: "Ece, I'm hungry!", tr: "Ece, acıktım!" },
            { kim: "E", en: "Tea, Kerem?", tr: "Çay ister misin Kerem?" },
            { kim: "K", en: "No, thanks. I'm not thirsty. I'm hungry!", tr: "Yok, sağ ol. Susamadım. Acıktım!" },
            { kim: "E", en: "OK, OK!", tr: "Tamam, tamam!" },
          ],
        },
      ],
      alistirmalar: {
        bosluk: [
          { cumle: "I ___ tired.", tr: "Yorgunum.", secenekler: ["am", "is", "are"], cevap: "am" },
          { cumle: "We ___ hungry.", tr: "Acıktık.", secenekler: ["am", "is", "are"], cevap: "are" },
          { cumle: "My friend ___ sick.", tr: "Arkadaşım hasta.", secenekler: ["am", "is", "are"], cevap: "is" },
          { cumle: "I'm ___. (Susadım.)", tr: "Susadım.", secenekler: ["thirsty", "hungry", "bored"], cevap: "thirsty" },
          { cumle: "I'm ___. (Üşüyorum.)", tr: "Üşüyorum.", secenekler: ["cold", "hot", "sad"], cevap: "cold" },
          { cumle: "___ are you sad?", tr: "Neden üzgünsün?", secenekler: ["Why", "How", "Who"], cevap: "Why" },
          { cumle: "I'm ___ tired. (biraz)", tr: "Biraz yorgunum.", secenekler: ["a little", "very", "not"], cevap: "a little" },
          { cumle: "Are you ___? (Sıkıldın mı?)", tr: "Sıkıldın mı?", secenekler: ["bored", "scared", "angry"], cevap: "bored" },
        ],
        siralama: [
          { cevap: "How are you today?", tr: "Bugün nasılsın?" },
          { cevap: "I am very thirsty.", tr: "Çok susadım." },
          { cevap: "Why are you angry?", tr: "Neden kızgınsın?" },
          { cevap: "She is not well today.", tr: "O bugün iyi değil." },
        ],
      },
      motor: {
        aciklama: "Duygular ve durumlar. Acıktım, susadım, üşüyorum: hepsi am / is / are + sıfat.",
        kaliplar: [
          ["be", "pos"],
          ["be", "neg"],
          ["be", "q"],
        ],
        malzeme: { ozne: KISI, durum: DUYGU },
      },
      konusma: [
        { en: "How are you today?", tr: "Bugün nasılsın?", ornek: "I'm great, thanks! / I'm a little tired.", ornekTr: "Harikayım, sağ ol! / Biraz yorgunum." },
        { en: "Are you hungry?", tr: "Acıktın mı?", ornek: "Yes, I am. I'm very hungry! / No, I'm not.", ornekTr: "Evet, çok acıktım! / Hayır, acıkmadım." },
        { en: "Are you cold?", tr: "Üşüyor musun?", ornek: "No, I'm not. I'm hot!", ornekTr: "Hayır, üşümüyorum. Sıcakladım!" },
        { en: "Why are you happy today?", tr: "Bugün neden mutlusun?", ornek: "Because my friend is here!", ornekTr: "Çünkü arkadaşım burada!" },
      ],
      test: [
        { soru: "“Acıktım.” İngilizcede hangisi?", secenekler: ["I'm hungry.", "I hungry.", "I'm thirsty."], dogru: 0, aciklama: "Türkçede fiil, İngilizcede am + hungry." },
        { soru: "They ___ tired.", secenekler: ["is", "are", "am"], dogru: 1, aciklama: "they ile are." },
        { soru: "“Üşüyorum.”", secenekler: ["I'm hot.", "I'm cold.", "I'm sick."], dogru: 1, aciklama: "Kişi üşüyorsa cold, sıcakladıysa hot." },
        { soru: "“What's wrong?” ne soruyor?", secenekler: ["Neyin var?", "Adın ne?", "Nerelisin?"], dogru: 0, aciklama: "Birinin keyfi yoksa sorulur." },
        { soru: "“Biraz endişeliyim.”", secenekler: ["I'm a little worried.", "I'm very worried.", "I'm worried a little am."], dogru: 0, aciklama: "a little = biraz, very = çok; ikisi de sıfatın önünde." },
      ],
    },

    // ================================================================ 3.2
    {
      kod: "a1-03-2",
      no: 2,
      baslik: "Renkler ve eşyalar",
      hedef: "Renkleri söyler, eşyaların nasıl olduğunu anlatırsın.",
      kelimeGruplari: [
        {
          ad: "Renkler",
          kelimeler: [
            { en: "colour", tr: "renk", ok: "kalı", ornek: ["What colour is it?", "O ne renk?"], ipucu: "Amerikan İngilizcesinde color yazılır; okunuşu aynı." },
            { en: "red", tr: "kırmızı", ok: "red" },
            { en: "blue", tr: "mavi", ok: "bluu" },
            { en: "green", tr: "yeşil", ok: "griin" },
            { en: "yellow", tr: "sarı", ok: "yelou" },
            { en: "black", tr: "siyah", ok: "blek" },
            { en: "white", tr: "beyaz", ok: "uayt" },
            { en: "orange", tr: "turuncu; portakal", ok: "orinc" },
            { en: "pink", tr: "pembe", ok: "pink" },
            { en: "brown", tr: "kahverengi", ok: "braun" },
            { en: "grey", tr: "gri", ok: "grey", ipucu: "Amerikan İngilizcesinde gray." },
            { en: "purple", tr: "mor", ok: "pörpıl" },
            { en: "dark", tr: "koyu", ok: "daak", ornek: ["dark blue", "koyu mavi, lacivert"] },
            { en: "light", tr: "açık (renk)", ok: "layt", ornek: ["light blue", "açık mavi"] },
          ],
        },
        {
          ad: "Nasıl?",
          kelimeler: [
            { en: "big", tr: "büyük", ok: "big" },
            { en: "small", tr: "küçük", ok: "smool" },
            { en: "new", tr: "yeni", ok: "nyuu" },
            { en: "beautiful", tr: "güzel", ok: "byuutıfıl" },
            { en: "favourite", tr: "en sevdiğim, gözde", ok: "feyvırit", ornek: ["My favourite colour is blue.", "En sevdiğim renk mavi."] },
          ],
        },
        {
          ad: "Eşyalar",
          kelimeler: [
            { en: "it", tr: "o (eşya, hayvan)", ok: "it", ornek: ["It's red.", "O kırmızı."], ipucu: "Türkçede tek “o” var. İngilizcede insan için he / she, eşya ve hayvan için it." },
            { en: "car", tr: "araba", ok: "kaa" },
            { en: "bag", tr: "çanta", ok: "beg" },
            { en: "phone", tr: "telefon", ok: "foun" },
            { en: "book", tr: "kitap", ok: "buk" },
            { en: "cat", tr: "kedi", ok: "ket" },
            { en: "dog", tr: "köpek", ok: "dog" },
            { en: "secret", tr: "sır", ok: "siikrit" },
          ],
        },
      ],
      kaliplar: [
        { en: "What colour is it?", tr: "O ne renk?" },
        { en: "It's red.", tr: "Kırmızı." },
        { en: "My favourite colour is blue.", tr: "En sevdiğim renk mavi." },
        { en: "What a beautiful car!", tr: "Ne güzel bir araba!" },
        { en: "It's a new car.", tr: "Yeni bir araba." },
        { en: "Is it your bag?", tr: "Bu senin çantan mı?" },
        { en: "Yes, it is.", tr: "Evet, öyle." },
      ],
      gramer: [
        {
          baslik: "Sıfat önde: Türkçeyle aynı",
          metin: [
            "İyi haber: renk ve sıfat, Türkçedeki gibi ismin önüne gelir. kırmızı araba = red car, büyük çanta = big bag.",
            "Tek fark “bir” kelimesinin yeri. Türkçede sıfattan sonra gelir (kırmızı bir araba), İngilizcede en başa: a red car.",
          ],
          ornekler: [
            { tr: ["kırmızı", "araba"], en: "[red] car" },
            { tr: ["kırmızı", "bir", "araba"], en: "[a] red car" },
            { tr: ["büyük", "siyah", "bir", "çanta"], en: "[a] big black bag" },
          ],
        },
        {
          baslik: "a mı an mı? Hemen sonraki kelimeye bak",
          metin: ["a / an seçerken isme değil, hemen arkasındaki kelimeye bakılır. Sıfat sesli harf sesiyle başlıyorsa an olur."],
          ornekler: [
            { tr: ["yeni bir araba"], en: "[a] new car" },
            { tr: ["turuncu bir çanta"], en: "[an] orange bag" },
            { tr: ["eski bir araba"], en: "[an] old car" },
          ],
          notlar: ["old = yaşlı (insan) ama eşya için eski demek."],
        },
        {
          baslik: "it = o (eşya, hayvan)",
          metin: [
            "Türkçede “o” herkes ve her şey için. İngilizcede üçe ayrılır: erkek he, kadın she, eşya ve hayvan it. it de he / she gibi is ile kullanılır: it is, kısası it's.",
          ],
          ornekler: [
            { tr: ["O (araba)", "kırmızı"], en: "[It] is red." },
            { tr: ["O (kedi)", "aç"], en: "[It] is hungry." },
            { tr: ["Ne renk?"], en: "What colour [is it]?" },
          ],
          notlar: ["it's = it is. Kesmeli yazılır."],
        },
        {
          baslik: "Sıfat çoğul olmaz",
          metin: ["Türkçede “kırmızılar araba” demediğimiz gibi İngilizcede de sıfata -s gelmez. -s sadece isme gelir: red cars."],
          ornekler: [
            { tr: ["kırmızı", "araba", "-lar"], en: "red car[s]" },
            { tr: ["küçük", "kedi", "-ler"], en: "small cat[s]" },
          ],
        },
      ],
      diyaloglar: [
        {
          baslik: "Kırmızı araba",
          sahne: "Öğleden sonra, apartmanın önü. Deniz iyileşmiş; Ece ile dışarı çıkınca John'u yeni arabasıyla görüyorlar.",
          bolum: 9,
          yer: "apartman",
          onceki: "Deniz hastaydı; Ece ona çay getirdi. Birkaç gün sonra Deniz iyileşti. John'un işi ise hâlâ bir sır.",
          anahtar: ["car", "new", "red", "favourite", "colour", "black", "bag"],
          sorular: [
            { en: "John's car is new.", dogru: true },
            { en: "John's car is blue.", dogru: false },
            { en: "John's bag is small.", dogru: false },
          ],
          kisiler: { D: { ad: "Deniz", ses: "erkek" }, E: { ad: "Ece", ses: "kadin" }, J: { ad: "John", ses: "erkek" } },
          satirlar: [
            { kim: "D", en: "Ece, look! What a beautiful car!", tr: "Ece, bak! Ne güzel bir araba!" },
            { kim: "J", en: "Hi, Deniz! Hi, Ece!", tr: "Selam Deniz! Selam Ece!" },
            { kim: "E", en: "John, is this your car?", tr: "John, bu senin araban mı?" },
            { kim: "J", en: "Yes, it is. It's new.", tr: "Evet. Yeni." },
            { kim: "D", en: "It's very beautiful! Red is my favourite colour.", tr: "Çok güzel! Kırmızı en sevdiğim renk." },
            { kim: "E", en: "And that big black bag? What's that, John?", tr: "Ya şu büyük siyah çanta? O ne John?" },
            { kim: "J", en: "This bag? It's… a secret!", tr: "Bu çanta mı? O… bir sır!" },
            { kim: "E", en: "John and his secrets!", tr: "John ve sırları!" },
          ],
        },
      ],
      miniDiyaloglar: [
        {
          baslik: "Küçük kedi",
          sahne: "Kerem ile Ece apartmanın bahçesinde bir kedi görüyor.",
          kisiler: { K: { ad: "Kerem", ses: "erkek" }, E: { ad: "Ece", ses: "kadin" } },
          satirlar: [
            { kim: "K", en: "Ece, look! A small cat!", tr: "Ece, bak! Küçük bir kedi!" },
            { kim: "E", en: "It's very beautiful! What colour is it?", tr: "Çok güzel! Ne renk?" },
            { kim: "K", en: "It's black and white.", tr: "Siyah beyaz." },
            { kim: "E", en: "Is it hungry?", tr: "Aç mı?" },
            { kim: "K", en: "Maybe!", tr: "Belki!" },
          ],
        },
        {
          baslik: "Kimin telefonu?",
          sahne: "Dil kafesinde masada bir telefon unutulmuş.",
          kisiler: { A: { ad: "Anna", ses: "kadin" }, E: { ad: "Emre", ses: "erkek" } },
          satirlar: [
            { kim: "A", en: "Emre, is this your phone?", tr: "Emre, bu senin telefonun mu?" },
            { kim: "E", en: "No, it isn't. My phone is black. It's Lisa's phone.", tr: "Hayır, değil. Benim telefonum siyah. Bu Lisa'nın telefonu." },
            { kim: "A", en: "A pink phone? Yes, it's Lisa's!", tr: "Pembe bir telefon mu? Evet, Lisa'nın!" },
          ],
        },
        {
          baslik: "Arabanız ne renk?",
          sahne: "Okul çıkışı Selin ile Mark çocuklarını bekliyor.",
          kisiler: { M: { ad: "Mark", ses: "erkek" }, S: { ad: "Selin", ses: "kadin" } },
          satirlar: [
            { kim: "M", en: "Selin, what colour is your car?", tr: "Selin, araban ne renk?" },
            { kim: "S", en: "It's dark green. And your car?", tr: "Koyu yeşil. Ya seninki?" },
            { kim: "M", en: "My car is grey. It's very old!", tr: "Benim arabam gri. Çok eski!" },
          ],
        },
      ],
      alistirmalar: {
        bosluk: [
          { cumle: "What ___ is it?", tr: "O ne renk?", secenekler: ["colour", "name", "job"], cevap: "colour" },
          { cumle: "My car is ___. (kırmızı)", tr: "Arabam kırmızı.", secenekler: ["red", "green", "white"], cevap: "red" },
          { cumle: "___ is a small cat.", tr: "O küçük bir kedi.", secenekler: ["It", "He", "She"], cevap: "It" },
          { cumle: "It's ___ orange bag.", tr: "Turuncu bir çanta.", secenekler: ["a", "an", "it"], cevap: "an" },
          { cumle: "It's ___ new phone.", tr: "Yeni bir telefon.", secenekler: ["a", "an", "it"], cevap: "a" },
          { cumle: "My cat is ___. (küçük)", tr: "Kedim küçük.", secenekler: ["small", "big", "new"], cevap: "small" },
          { cumle: "My ___ colour is blue.", tr: "En sevdiğim renk mavi.", secenekler: ["favourite", "beautiful", "new"], cevap: "favourite" },
          { cumle: "They are red ___.", tr: "Onlar kırmızı arabalar.", secenekler: ["cars", "car", "a car"], cevap: "cars" },
        ],
        siralama: [
          { cevap: "What colour is your bag?", tr: "Çantan ne renk?" },
          { cevap: "It is a big black bag.", tr: "Büyük siyah bir çanta." },
          { cevap: "My favourite colour is green.", tr: "En sevdiğim renk yeşil." },
          { cevap: "Is it your phone?", tr: "O senin telefonun mu?" },
        ],
      },
      motor: {
        aciklama: "Eşyalar ve renkler. it = o (eşya, hayvan); sıfat Türkçedeki gibi.",
        kaliplar: [
          ["be", "pos"],
          ["be", "neg"],
          ["be", "q"],
        ],
        malzeme: { ozne: ESYA, durum: RENK_SIFAT },
      },
      konusma: [
        { en: "What's your favourite colour?", tr: "En sevdiğin renk ne?", ornek: "My favourite colour is blue.", ornekTr: "En sevdiğim renk mavi." },
        { en: "What colour is your phone?", tr: "Telefonun ne renk?", ornek: "It's black. / It's pink.", ornekTr: "Siyah. / Pembe." },
        { en: "Is your bag big or small?", tr: "Çantan büyük mü, küçük mü?", ornek: "It's small. It's a small brown bag.", ornekTr: "Küçük. Küçük kahverengi bir çanta." },
      ],
      test: [
        { soru: "“kırmızı bir araba”", secenekler: ["a red car", "red a car", "a car red"], dogru: 0, aciklama: "a en başta, sıfat ismin önünde." },
        { soru: "“O (kedi) aç.”", secenekler: ["He is hungry.", "It is hungry.", "It hungry."], dogru: 1, aciklama: "Hayvan ve eşya için it; is de unutulmaz." },
        { soru: "It's ___ orange bag.", secenekler: ["a", "an", "it"], dogru: 1, aciklama: "orange sesli harfle başlar: an." },
        { soru: "“koyu mavi”", secenekler: ["light blue", "dark blue", "blue dark"], dogru: 1, aciklama: "dark = koyu, light = açık; sıfat önde." },
        { soru: "“What colour is it?” ne soruyor?", secenekler: ["O ne renk?", "O kimin?", "O nerede?"], dogru: 0, aciklama: "colour = renk." },
      ],
    },

    // ================================================================ 3.3
    {
      kod: "a1-03-3",
      no: 3,
      baslik: "Tekrar ve ünite testi",
      hedef: "Nasıl olduğunu, neden öyle olduğunu ve eşyaların rengini anlatırsın.",
      tekrar: true,
      kelimeGruplari: [],
      kaliplar: [],
      gramer: [
        {
          baslik: "Ünitenin özeti",
          metin: [
            "Türkçedeki kişi eki (yorgun-um, yorgun-uz) İngilizcede am / is / are olur. Acıktım, susadım, üşüyorum gibi fiille söylenen durumlar da İngilizcede am + sıfattır.",
            "Sıfatlar Türkçedeki gibi önde; sadece a / an en başa geçer. Eşya ve hayvan için it.",
          ],
          ornekler: [
            { tr: ["Acık", "-tı", "-m"], en: "I [am] hungry." },
            { tr: ["Biz", "mutlu", "-yuz"], en: "We [are] happy." },
            { tr: ["O (araba)", "yeni"], en: "[It] is new." },
            { tr: ["kırmızı", "bir", "araba"], en: "[a] red car" },
            { tr: ["Neden", "üzgünsün?"], en: "[Why] are you sad?" },
          ],
          notlar: ["I am · he / she / it is · you / we / they are", "very tired, a little tired", "a red car, an orange bag"],
        },
      ],
      diyaloglar: [],
      okuma: {
        baslik: "Deniz'in mesajı",
        bonus: [{ en: "neighbour", tr: "komşu" }],
        satirlar: [
          { en: "Hi, Lisa! It's Deniz.", tr: "Selam Lisa! Ben Deniz." },
          { en: "I'm sorry. I'm not at school today. I'm sick.", tr: "Kusura bakma. Bugün okulda değilim. Hastayım." },
          { en: "I'm a little cold and very tired. But I'm not sad!", tr: "Biraz üşüyorum, çok da yorgunum. Ama üzgün değilim!" },
          { en: "My neighbour Ece is a great friend. Her tea is very good.", tr: "Komşum Ece harika bir arkadaş. Onun çayı çok güzel." },
          { en: "Her brother Kerem is here too. He's fifteen and he's very hungry!", tr: "Kardeşi Kerem de burada. On beş yaşında ve çok acıkmış!" },
          { en: "And John? His car is new. It's red and very beautiful.", tr: "Ya John? Arabası yeni. Kırmızı ve çok güzel." },
          { en: "His bag is big and black. What's his job? It's a secret!", tr: "Çantası büyük ve siyah. İşi ne? Bu bir sır!" },
          { en: "I'm a little worried. Maybe John is a police officer!", tr: "Biraz endişeliyim. Belki John polistir!" },
        ],
        sorular: [
          { en: "Deniz is at school today.", tr: "Deniz bugün okulda.", dogru: false },
          { en: "Deniz is sad.", tr: "Deniz üzgün.", dogru: false },
          { en: "Kerem is fifteen.", tr: "Kerem on beş yaşında.", dogru: true },
          { en: "John's car is red.", tr: "John'un arabası kırmızı.", dogru: true },
          { en: "John's bag is small.", tr: "John'un çantası küçük.", dogru: false },
        ],
      },
      alistirmalar: {
        bosluk: [
          { cumle: "We ___ very happy.", tr: "Çok mutluyuz.", secenekler: ["am", "is", "are"], cevap: "are" },
          { cumle: "I'm ___. (Acıktım.)", tr: "Acıktım.", secenekler: ["hungry", "thirsty", "angry"], cevap: "hungry" },
          { cumle: "___ is a new car.", tr: "O yeni bir araba.", secenekler: ["It", "He", "She"], cevap: "It" },
          { cumle: "My bag is ___. (kahverengi)", tr: "Çantam kahverengi.", secenekler: ["brown", "black", "grey"], cevap: "brown" },
          { cumle: "Why are you sad? ___ I'm tired.", tr: "Neden üzgünsün? Çünkü yorgunum.", secenekler: ["Because", "But", "Or"], cevap: "Because" },
        ],
        siralama: [
          { cevap: "Are you cold?", tr: "Üşüyor musun?" },
          { cevap: "It is a small white cat.", tr: "O küçük beyaz bir kedi." },
          { cevap: "I am a little worried.", tr: "Biraz endişeliyim." },
        ],
      },
      motor: {
        aciklama: "Ünitenin bütün duyguları karışık: olumlu, olumsuz, soru. (Renkler için Ders 3.2'nin cümle bölümü.)",
        kaliplar: [
          ["be", "pos"],
          ["be", "neg"],
          ["be", "q"],
        ],
        // Kişiler duygularla, eşyalar renklerle eşleşsin diye burada sadece kişiler: "Arabam yorgun" gibi cümle çıkmaz
        malzeme: { ozne: KISI, durum: DUYGU },
      },
      konusma: [
        { en: "How are you today?", tr: "Bugün nasılsın?", ornek: "Not bad, thanks. I'm a little tired.", ornekTr: "Fena değil, sağ ol. Biraz yorgunum." },
        { en: "Are you hungry or thirsty?", tr: "Acıktın mı, susadın mı?", ornek: "I'm thirsty. Water, please!", ornekTr: "Susadım. Su lütfen!" },
        { en: "Why are you happy today?", tr: "Bugün neden mutlusun?", ornek: "Because my family is here.", ornekTr: "Çünkü ailem burada." },
        { en: "What's your favourite colour?", tr: "En sevdiğin renk ne?", ornek: "My favourite colour is purple.", ornekTr: "En sevdiğim renk mor." },
        { en: "What colour is your car?", tr: "Araban ne renk?", ornek: "It's white. / My family's car is grey.", ornekTr: "Beyaz. / Ailemin arabası gri." },
        { en: "Is your phone new or old?", tr: "Telefonun yeni mi, eski mi?", ornek: "It's new. It's a black phone.", ornekTr: "Yeni. Siyah bir telefon." },
      ],
      test: [
        { soru: "“Susadım.”", secenekler: ["I'm thirsty.", "I'm hungry.", "I thirsty."], dogru: 0, aciklama: "Türkçede fiil, İngilizcede am + thirsty." },
        { soru: "We ___ bored.", secenekler: ["am", "is", "are"], dogru: 2, aciklama: "we ile are." },
        { soru: "“Sıkıldın mı?”", secenekler: ["Are you bored?", "You are bored?", "Is you bored?"], dogru: 0, aciklama: "Soruda are başa geçer." },
        { soru: "“Korkmuyorum.”", secenekler: ["I'm not scared.", "I don't scared.", "I'm scared not."], dogru: 0, aciklama: "Durum cümlesi: am not + scared." },
        { soru: "“O (çanta) büyük.”", secenekler: ["She is big.", "It is big.", "It big."], dogru: 1, aciklama: "Eşya için it." },
        { soru: "“sarı bir kedi”", secenekler: ["a yellow cat", "yellow a cat", "a cat yellow"], dogru: 0, aciklama: "a başta, sıfat önde." },
        { soru: "an ___ bag", secenekler: ["orange", "red", "big"], dogru: 0, aciklama: "an, sesli harfle başlayan kelimeden önce: an orange bag." },
        { soru: "“Neden?” İngilizcede hangisi?", secenekler: ["Why?", "How?", "Who?"], dogru: 0, aciklama: "how = nasıl, who = kim." },
        { soru: "“Pek iyi değilim.”", secenekler: ["I'm not very well.", "I'm very not well.", "I not very well."], dogru: 0, aciklama: "not, am'den sonra; very sıfatın önünde." },
        { soru: "“favourite” ne demek?", secenekler: ["en sevdiğim", "renk", "güzel"], dogru: 0, aciklama: "My favourite colour = en sevdiğim renk." },
      ],
    },
  ],
};

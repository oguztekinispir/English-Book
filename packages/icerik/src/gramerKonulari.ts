/**
 * Gramer konuları: önce kendini dene (5 soru) → kalıp anlatımı → sık yapılan hatalar → yeniden dene (5 soru).
 * Orijinal içerik. Anlatım kalıp üzerinden; Türkçe karşılaştırma sadece "sık hata" bölümünde.
 * [köşeli parantez] = örnekte vurgulanan kalıp.
 */
import type { GramerBolum, Seviye, TestSorusu } from "./tipler";

export interface SikHata {
  yanlis: string;
  dogru: string;
  /** Neden yanlış: kısa, Türkçe */
  neden: string;
}

export interface GramerKonusu {
  kod: string;
  baslik: string;
  baslikEn: string;
  seviye: Seviye;
  /** Listede merak uyandıran kısa soru */
  merak: string;
  onTest: TestSorusu[];
  aciklama: GramerBolum[];
  hatalar: SikHata[];
  sonTest: TestSorusu[];
  /** Bu konunun geçtiği dersler */
  dersler: string[];
}

export const GRAMER_KONULARI: GramerKonusu[] = [
  // ------------------------------------------------------------ to be
  {
    kod: "to-be",
    baslik: "am / is / are: kim ve nasıl olduğunu söyleme",
    baslikEn: "Present simple: to be",
    seviye: "A1",
    merak: "“Öğrenciyim” tek kelime. İngilizcesi neden üç kelime?",
    onTest: [
      { soru: "I ___ a student.", secenekler: ["am", "is", "are"], dogru: 0, aciklama: "I ile am." },
      { soru: "She ___ from Germany.", secenekler: ["are", "is", "am"], dogru: 1, aciklama: "he / she / it ile is." },
      { soru: "We ___ friends.", secenekler: ["is", "am", "are"], dogru: 2, aciklama: "we ile are." },
      { soru: "“Yorgunum.”", secenekler: ["I tired.", "I'm tired.", "I am tire."], dogru: 1, aciklama: "am (kısası 'm) olmadan olmaz." },
      { soru: "My parents ___ teachers.", secenekler: ["is", "are", "am"], dogru: 1, aciklama: "My parents = they: are." },
    ],
    aciklama: [
      {
        baslik: "Kalıp: kişi + am / is / are + kim ya da nasıl",
        metin: [
          "İngilizcede kim olduğunu, nereli olduğunu, kaç yaşında olduğunu ya da nasıl hissettiğini hep aynı kalıpla söylersin: kişi + am / is / are + gerisi.",
          "Hangisinin geleceğini kişi belirler. Bunu tabloyla değil, kısa cümleleri sesli tekrar ederek öğren: I'm…, you're…, she's…",
        ],
        ornekler: [
          { tr: ["Öğrenciyim."], en: "[I'm] a student." },
          { tr: ["Türkiye'densin."], en: "[You're] from Turkey." },
          { tr: ["O otuz yaşında."], en: "[He's] thirty." },
          { tr: ["O çok mutlu."], en: "[She's] very happy." },
          { tr: ["O (kedi) aç."], en: "[It's] hungry." },
          { tr: ["Evdeyiz."], en: "[We're] at home." },
          { tr: ["Onlar arkadaşlarım."], en: "[They're] my friends." },
        ],
        notlar: ["I am → I'm", "he / she / it is → he's, she's, it's", "you / we / they are → you're, we're, they're"],
      },
      {
        baslik: "Uzun hali mi, kısa hali mi?",
        metin: ["Konuşurken ve mesajlaşırken hep kısa hali kullanılır: I'm, she's, we're. Uzun hali (I am) resmi yazıda ya da vurgu yaparken çıkar. İkisi de doğru."],
        ornekler: [
          { tr: ["İyiyim."], en: "[I'm] fine." },
          { tr: ["Gerçekten iyiyim!"], en: "I [am] fine, really!" },
        ],
      },
    ],
    hatalar: [
      { yanlis: "I student.", dogru: "I'm a student.", neden: "Türkçede “Öğrenciyim” tek kelime olduğu için am unutuluyor. İngilizcede am / is / are olmadan cümle kurulmaz." },
      { yanlis: "She are a doctor.", dogru: "She's a doctor.", neden: "he / she / it ile her zaman is." },
      { yanlis: "I have twenty years.", dogru: "I'm twenty.", neden: "Yaş have ile değil, am / is / are ile söylenir." },
      { yanlis: "I am agree.", dogru: "I agree.", neden: "agree (katılıyorum) bir fiil; önüne am gelmez. am, durum ve sıfatla kullanılır." },
    ],
    sonTest: [
      { soru: "They ___ from England.", secenekler: ["is", "are", "am"], dogru: 1, aciklama: "they ile are." },
      { soru: "“Evdeyim.”", secenekler: ["I at home.", "I'm at home.", "I is at home."], dogru: 1, aciklama: "I + 'm (am)." },
      { soru: "My brother ___ fifteen.", secenekler: ["is", "are", "has"], dogru: 0, aciklama: "My brother = he: is. Yaş am / is / are ile." },
      { soru: "“Öğretmeniz.”", secenekler: ["We teachers.", "We're teachers.", "We is teachers."], dogru: 1, aciklama: "We + 're (are)." },
      { soru: "It ___ a beautiful car.", secenekler: ["are", "am", "is"], dogru: 2, aciklama: "it ile is." },
    ],
    dersler: ["a1-01-1", "a1-01-2", "a1-03-1"],
  },

  // ------------------------------------------------------------ olumsuz ve soru
  {
    kod: "to-be-olumsuz-soru",
    baslik: "Olumsuz ve soru: I'm not… / Are you…?",
    baslikEn: "To be: negatives and questions",
    seviye: "A1",
    merak: "“Öğretmen misin?” derken soru eki sonda. İngilizcede soru nerede başlar?",
    onTest: [
      { soru: "“Evli değilim.”", secenekler: ["I'm not married.", "I not married.", "I don't married."], dogru: 0, aciklama: "not, am'den sonra: I'm not." },
      { soru: "“Öğrenci misin?”", secenekler: ["You are a student?", "Are you a student?", "Do you a student?"], dogru: 1, aciklama: "Soruda are başa geçer." },
      { soru: "She ___ at home.", secenekler: ["isn't", "aren't", "don't"], dogru: 0, aciklama: "she ile isn't." },
      { soru: "“Is he a doctor?” · “No, he ___.”", secenekler: ["isn't", "doesn't", "not"], dogru: 0, aciklama: "Kısa cevapta is tekrar edilir: No, he isn't." },
      { soru: "“Onlar nerede?”", secenekler: ["Where they are?", "Where are they?", "They are where?"], dogru: 1, aciklama: "Soru kelimesi + are + they." },
    ],
    aciklama: [
      {
        baslik: "Olumsuz: am / is / are + not",
        metin: ["not, am / is / are'dan hemen sonra gelir. Konuşurken kısaltılır: I'm not, isn't, aren't."],
        ornekler: [
          { tr: ["Yorgun değilim."], en: "I['m not] tired." },
          { tr: ["O evde değil."], en: "She [isn't] at home." },
          { tr: ["Onlar Türk değil."], en: "They [aren't] Turkish." },
        ],
        notlar: ["amn't diye bir şey yok: I'm not."],
      },
      {
        baslik: "Soru: am / is / are başa geçer",
        metin: ["Soru sorarken am / is / are cümlenin en başına geçer; geri kalan aynı kalır. Soru kelimesi (where, who, how old) varsa en başta o durur."],
        ornekler: [
          { tr: ["Öğrenci misin?"], en: "[Are you] a student?" },
          { tr: ["O evli mi?"], en: "[Is she] married?" },
          { tr: ["Neredesin?"], en: "[Where are you]?" },
          { tr: ["Kaç yaşındasın?"], en: "[How old are you]?" },
        ],
      },
      {
        baslik: "Kısa cevap",
        metin: ["Evet / hayır derken kişi ve am / is / are tekrar edilir. Sadece “Yes.” eksik duyulur."],
        ornekler: [
          { tr: ["Öğrenci misin? Evet."], en: "Yes, [I am]." },
          { tr: ["O evli mi? Hayır."], en: "No, [she isn't]." },
        ],
        notlar: ["Olumlu kısa cevapta kısaltma yok: Yes, I am. (Yes, I'm yanlış)"],
      },
    ],
    hatalar: [
      { yanlis: "I don't tired.", dogru: "I'm not tired.", neden: "Durum cümlesinde olumsuz don't ile değil, am / is / are + not ile yapılır." },
      { yanlis: "You are a student?", dogru: "Are you a student?", neden: "Türkçede soru sonda (mi). İngilizcede are başa geçer." },
      { yanlis: "Where you are?", dogru: "Where are you?", neden: "Soru kelimesinden sonra önce are, sonra kişi gelir." },
      { yanlis: "Yes, I'm.", dogru: "Yes, I am.", neden: "Olumlu kısa cevap kısaltılmaz." },
    ],
    sonTest: [
      { soru: "“Hasta mısın?”", secenekler: ["Are you sick?", "You sick?", "Do you sick?"], dogru: 0, aciklama: "are başa." },
      { soru: "We ___ at school today.", secenekler: ["aren't", "isn't", "don't"], dogru: 0, aciklama: "we ile aren't." },
      { soru: "“Are they English?” · “Yes, ___.”", secenekler: ["they're", "they are", "they do"], dogru: 1, aciklama: "Olumlu kısa cevap kısaltılmaz." },
      { soru: "“O kim?”", secenekler: ["Who is he?", "Who he is?", "He is who?"], dogru: 0, aciklama: "Soru kelimesi + is + he." },
      { soru: "“Aç değilim.”", secenekler: ["I'm not hungry.", "I don't hungry.", "I amn't hungry."], dogru: 0, aciklama: "I'm not." },
    ],
    dersler: ["a1-02-3"],
  },

  // ------------------------------------------------------------ durum sıfatları
  {
    kod: "durum-sifatlari",
    baslik: "Acıktım = I'm hungry: durum ve duygu",
    baslikEn: "Feelings with to be",
    seviye: "A1",
    merak: "“Acıktım” geçmiş zaman gibi görünüyor. İngilizcede neden “I'm hungry”?",
    onTest: [
      { soru: "“Susadım.”", secenekler: ["I thirsted.", "I'm thirsty.", "I was thirsty."], dogru: 1, aciklama: "Şu anki durum: I'm thirsty." },
      { soru: "“Üşüyorum.”", secenekler: ["I'm cold.", "I'm colding.", "I cold."], dogru: 0, aciklama: "I'm cold." },
      { soru: "“Sıkıldın mı?”", secenekler: ["Did you bored?", "Are you bored?", "Are you boring?"], dogru: 1, aciklama: "Are you bored? (boring = sıkıcı)" },
      { soru: "“Korkmuyorum.”", secenekler: ["I don't scared.", "I'm not scared.", "I'm not scaring."], dogru: 1, aciklama: "I'm not scared." },
      { soru: "“Biraz yorgunum.”", secenekler: ["I'm a little tired.", "I'm tired a little am.", "I little tired."], dogru: 0, aciklama: "a little sıfatın önünde." },
    ],
    aciklama: [
      {
        baslik: "Türkçede fiil, İngilizcede durum",
        metin: [
          "Türkçede bazı durumları fiille söyleriz: acıktım, susadım, sıkıldım, üşüyorum, korkuyorum. Bunlar şu anki durumu anlatır.",
          "İngilizcede hepsi “yorgunum” gibi söylenir: I'm + sıfat. Her birini hazır kalıp olarak öğren.",
        ],
        ornekler: [
          { tr: ["Acıktım."], en: "[I'm hungry.]" },
          { tr: ["Susadım."], en: "[I'm thirsty.]" },
          { tr: ["Sıkıldım."], en: "[I'm bored.]" },
          { tr: ["Üşüyorum."], en: "[I'm cold.]" },
          { tr: ["Sıcakladım."], en: "[I'm hot.]" },
          { tr: ["Korkuyorum."], en: "[I'm scared.]" },
        ],
      },
      {
        baslik: "very ve a little",
        metin: ["Ne kadar olduğunu sıfatın önüne koyarsın, Türkçedeki gibi: very hungry (çok aç), a little tired (biraz yorgun)."],
        ornekler: [
          { tr: ["Çok acıktım."], en: "I'm [very] hungry." },
          { tr: ["Biraz üşüyorum."], en: "I'm [a little] cold." },
        ],
      },
    ],
    hatalar: [
      { yanlis: "I hungry.", dogru: "I'm hungry.", neden: "am (kısası 'm) gerekli." },
      { yanlis: "I was hungry. (Acıktım demek için)", dogru: "I'm hungry.", neden: "“Acıktım” geçmiş zaman eki taşısa da şu anı anlatır; İngilizcede şimdiki durum: I'm." },
      { yanlis: "I'm boring.", dogru: "I'm bored.", neden: "bored = sıkılmış (sen). boring = sıkıcı (bir şey ya da biri). “I'm boring” = Ben sıkıcı biriyim!" },
      { yanlis: "I don't hungry.", dogru: "I'm not hungry.", neden: "Durum cümlesinde olumsuz am not ile yapılır." },
    ],
    sonTest: [
      { soru: "“Acıktık.”", secenekler: ["We're hungry.", "We hungried.", "We are hunger."], dogru: 0, aciklama: "We're hungry." },
      { soru: "“Sıcakladın mı?”", secenekler: ["Are you hot?", "Did you hot?", "Are you heat?"], dogru: 0, aciklama: "Are you hot?" },
      { soru: "“Çok sıkıldım.”", secenekler: ["I'm very boring.", "I'm very bored.", "I very bored."], dogru: 1, aciklama: "bored = sıkılmış." },
      { soru: "“O (kadın) üşüyor.”", secenekler: ["She's cold.", "She colds.", "She is coldy."], dogru: 0, aciklama: "She's cold." },
      { soru: "“Endişeli değiliz.”", secenekler: ["We aren't worried.", "We don't worried.", "We not worry."], dogru: 0, aciklama: "We aren't worried." },
    ],
    dersler: ["a1-03-1"],
  },

  // ------------------------------------------------------------ a / an
  {
    kod: "a-an",
    baslik: "a mı, an mı? Meslek ve eşyalar",
    baslikEn: "Articles: a and an",
    seviye: "A1",
    merak: "“Öğretmenim” derken neden “I'm a teacher”? Bu a nereden çıktı?",
    onTest: [
      { soru: "I'm ___ engineer.", secenekler: ["a", "an", "—"], dogru: 1, aciklama: "engineer sesli harfle başlar: an." },
      { soru: "She's ___ nurse.", secenekler: ["a", "an", "—"], dogru: 0, aciklama: "Tek kişinin mesleği: a nurse." },
      { soru: "I'm ___ Turkish.", secenekler: ["a", "an", "—"], dogru: 2, aciklama: "Milliyette a gelmez." },
      { soru: "It's ___ old car.", secenekler: ["a", "an", "—"], dogru: 1, aciklama: "Hemen sonraki kelime old: an." },
      { soru: "They're ___ doctors.", secenekler: ["a", "an", "—"], dogru: 2, aciklama: "Çoğulda a yok." },
    ],
    aciklama: [
      {
        baslik: "Tek bir kişi ya da şey: a",
        metin: ["Tek bir kişinin mesleğini ya da tek bir şeyi söylerken önüne a gelir: a teacher, a car. Türkçede çoğu zaman söylenmez, o yüzden kalıbın parçası olarak öğren: I'm a teacher."],
        ornekler: [
          { tr: ["Öğretmenim."], en: "I'm [a teacher]." },
          { tr: ["Yeni bir arabam var."], en: "I have [a new car]." },
        ],
      },
      {
        baslik: "Sesli harf sesinden önce: an",
        metin: ["Hemen sonraki kelime a, e, i, o, u sesiyle başlıyorsa an denir. İsme değil, hemen arkasındaki kelimeye bakılır."],
        ornekler: [
          { tr: ["Mühendisim."], en: "I'm [an engineer]." },
          { tr: ["eski bir araba"], en: "[an old] car" },
          { tr: ["turuncu bir çanta"], en: "[an orange] bag" },
        ],
      },
      {
        baslik: "a gelmeyen yerler",
        metin: ["Milliyette (I'm Turkish), çoğulda (They're doctors) ve at home, at work gibi kalıplarda a yoktur."],
        ornekler: [
          { tr: ["Türk'üm."], en: "I'm Turkish." },
          { tr: ["Onlar doktor."], en: "They're doctor[s]." },
        ],
      },
    ],
    hatalar: [
      { yanlis: "I'm teacher.", dogru: "I'm a teacher.", neden: "Türkçede “bir” söylenmediği için a unutuluyor. Tek kişinin mesleğinde a şart." },
      { yanlis: "She's a engineer.", dogru: "She's an engineer.", neden: "engineer sesli harf sesiyle başlar." },
      { yanlis: "I'm a Turkish.", dogru: "I'm Turkish.", neden: "Turkish burada sıfat (Türk); a almaz." },
      { yanlis: "They're a doctors.", dogru: "They're doctors.", neden: "a = bir tane; çoğulla kullanılmaz." },
    ],
    sonTest: [
      { soru: "He's ___ actor.", secenekler: ["a", "an", "—"], dogru: 1, aciklama: "actor: an." },
      { soru: "It's ___ big bag.", secenekler: ["a", "an", "—"], dogru: 0, aciklama: "big sessiz harfle başlar: a." },
      { soru: "We're ___ students.", secenekler: ["a", "an", "—"], dogru: 2, aciklama: "Çoğulda a yok." },
      { soru: "“Aşçıyım.”", secenekler: ["I'm cook.", "I'm a cook.", "I'm an cook."], dogru: 1, aciklama: "I'm a cook." },
      { soru: "She's ___ English.", secenekler: ["a", "an", "—"], dogru: 2, aciklama: "Milliyette a gelmez." },
    ],
    dersler: ["a1-01-2", "a1-02-2", "a1-03-2"],
  },

  // ------------------------------------------------------------ sahiplik
  {
    kod: "sahiplik",
    baslik: "my, your, his, her ve 's: kimin?",
    baslikEn: "Possessive adjectives and 's",
    seviye: "A1",
    merak: "“Annesi” derken erkeğin mi kadının mı annesi? İngilizce bunu neden soruyor?",
    onTest: [
      { soru: "“annem”", secenekler: ["mother my", "my mother", "me mother"], dogru: 1, aciklama: "my önde: my mother." },
      { soru: "Emre is married. ___ wife is a nurse.", secenekler: ["His", "Her", "Its"], dogru: 0, aciklama: "Sahibi Emre (erkek): his." },
      { soru: "Ayşe's father is a doctor. ___ father is a doctor.", secenekler: ["His", "Her", "She"], dogru: 1, aciklama: "Sahibi Ayşe (kadın): her." },
      { soru: "“Emre'nin annesi”", secenekler: ["Emre's mother", "mother Emre's", "Emre mother"], dogru: 0, aciklama: "isim + 's + şey." },
      { soru: "We love ___ teacher.", secenekler: ["our", "us", "we"], dogru: 0, aciklama: "bizim = our." },
    ],
    aciklama: [
      {
        baslik: "Kimin olduğu önde",
        metin: ["Kimin olduğunu söyleyen kelime ismin önüne gelir. İsimle birlikte, kalıp olarak öğren: my mother, your name, our teacher."],
        ornekler: [
          { tr: ["adım"], en: "[my name]" },
          { tr: ["adın"], en: "[your name]" },
          { tr: ["öğretmenimiz"], en: "[our teacher]" },
          { tr: ["evleri"], en: "[their house]" },
        ],
        notlar: ["my: benim", "your: senin / sizin", "his: onun (erkek) · her: onun (kadın)", "our: bizim", "their: onların"],
      },
      {
        baslik: "his mi, her mi? Sahibine bak",
        metin: ["Anneye, babaya ya da eşyaya değil, sahibine bakılır. Sahibi erkekse his, kadınsa her."],
        ornekler: [
          { tr: ["Emre'nin kız kardeşi"], en: "[his] sister" },
          { tr: ["Selin'in oğlu"], en: "[her] son" },
        ],
      },
      {
        baslik: "İsimle: 's",
        metin: ["Birinin adıyla söylerken isme 's eklenir: Emre's car, Lisa's phone."],
        ornekler: [
          { tr: ["John'un arabası"], en: "John['s] car" },
          { tr: ["Lisa'nın telefonu"], en: "Lisa['s] phone" },
        ],
        notlar: ["he's = he is. John's car'daki 's ise sahiplik. Hangisi olduğu cümleden anlaşılır."],
      },
    ],
    hatalar: [
      { yanlis: "mother my", dogru: "my mother", neden: "Türkçede ek sonda (annem); İngilizcede my önde." },
      { yanlis: "Ayşe and his father", dogru: "Ayşe and her father", neden: "Sahibi kadın: her. Türkçedeki “onun” ikisini de karşılıyor." },
      { yanlis: "the car of John", dogru: "John's car", neden: "Kişiyle sahiplikte 's kullanılır." },
      { yanlis: "Me name is Deniz.", dogru: "My name is Deniz.", neden: "me = beni / bana. benim = my." },
    ],
    sonTest: [
      { soru: "“baban”", secenekler: ["your father", "you father", "father your"], dogru: 0, aciklama: "your father." },
      { soru: "Lisa and ___ brother are at home.", secenekler: ["his", "her", "she"], dogru: 1, aciklama: "Sahibi Lisa: her." },
      { soru: "“Deniz'in telefonu”", secenekler: ["Deniz's phone", "phone Deniz's", "Deniz phone's"], dogru: 0, aciklama: "Deniz's phone." },
      { soru: "They're with ___ children.", secenekler: ["they", "their", "them"], dogru: 1, aciklama: "onların = their." },
      { soru: "Kerem loves ___ sister.", secenekler: ["his", "her", "he"], dogru: 0, aciklama: "Sahibi Kerem: his." },
    ],
    dersler: ["a1-02-1"],
  },

  // ------------------------------------------------------------ sıfatlar
  {
    kod: "sifatlar",
    baslik: "Sıfatlar ve renkler: a red car",
    baslikEn: "Adjectives",
    seviye: "A1",
    merak: "“kırmızı bir araba” İngilizcede “a red car”. “bir” neden en başa kaçtı?",
    onTest: [
      { soru: "“kırmızı bir araba”", secenekler: ["a red car", "red a car", "a car red"], dogru: 0, aciklama: "a + sıfat + isim." },
      { soru: "“Arabam yeni.”", secenekler: ["My car new.", "My car is new.", "My new car is."], dogru: 1, aciklama: "is unutulmaz." },
      { soru: "“küçük kediler”", secenekler: ["smalls cats", "small cats", "small cat"], dogru: 1, aciklama: "Sıfata -s gelmez." },
      { soru: "“O (çanta) siyah.”", secenekler: ["She is black.", "It is black.", "It black."], dogru: 1, aciklama: "Eşya için it." },
      { soru: "“koyu mavi”", secenekler: ["dark blue", "blue dark", "light blue"], dogru: 0, aciklama: "dark = koyu, önde." },
    ],
    aciklama: [
      {
        baslik: "Sıfat önde: Türkçeyle aynı",
        metin: ["Renk ve sıfat, Türkçedeki gibi ismin önüne gelir: red car (kırmızı araba). Tek fark “bir”in yeri: kırmızı bir araba → a red car."],
        ornekler: [
          { tr: ["kırmızı araba"], en: "[red car]" },
          { tr: ["kırmızı bir araba"], en: "[a red car]" },
          { tr: ["büyük siyah bir çanta"], en: "[a big black bag]" },
        ],
      },
      {
        baslik: "Cümlede: is + sıfat",
        metin: ["Sıfat ismin arkasında söylenecekse araya is / are girer: My car is red. Türkçedeki gibi “My car red” demek eksik kalır."],
        ornekler: [
          { tr: ["Arabam kırmızı."], en: "My car [is red]." },
          { tr: ["Kediler küçük."], en: "The cats [are small]." },
        ],
      },
      {
        baslik: "Eşya ve hayvan: it",
        metin: ["Türkçede “o” herkes için. İngilizcede eşya ve hayvan için it: It's red. It's hungry."],
        ornekler: [
          { tr: ["O (araba) yeni."], en: "[It's] new." },
          { tr: ["Ne renk?"], en: "What colour [is it]?" },
        ],
      },
    ],
    hatalar: [
      { yanlis: "My car red.", dogru: "My car is red.", neden: "Türkçede “Arabam kırmızı” yeterli; İngilizcede is şart." },
      { yanlis: "a car red", dogru: "a red car", neden: "Sıfat ismin önünde." },
      { yanlis: "reds cars", dogru: "red cars", neden: "Sıfat çoğul olmaz; -s sadece isme gelir." },
      { yanlis: "She is a new car.", dogru: "It's a new car.", neden: "Eşya için she değil it." },
    ],
    sonTest: [
      { soru: "“büyük bir köpek”", secenekler: ["a big dog", "a dog big", "big a dog"], dogru: 0, aciklama: "a + sıfat + isim." },
      { soru: "“Telefonum siyah.”", secenekler: ["My phone black.", "My phone is black.", "My black phone."], dogru: 1, aciklama: "is gerekli." },
      { soru: "“yeşil çantalar”", secenekler: ["green bags", "greens bags", "green bag"], dogru: 0, aciklama: "Sıfata -s gelmez." },
      { soru: "“O (kedi) beyaz.”", secenekler: ["It's white.", "He's white.", "It white."], dogru: 0, aciklama: "Hayvan için it." },
      { soru: "an ___ bag", secenekler: ["orange", "black", "small"], dogru: 0, aciklama: "an sesli harf sesinden önce." },
    ],
    dersler: ["a1-03-2"],
  },
];

/** Sıradaki A1–A2 gramer konuları (hazırlanıyor) */
export const GRAMER_YAKINDA: { baslik: string; seviye: Seviye }[] = [
  { baslik: "have got: sahip olmak", seviye: "A1" },
  { baslik: "there is / there are: bir yerde var", seviye: "A1" },
  { baslik: "in / on / at / under: yer", seviye: "A1" },
  { baslik: "Geniş zaman: I work, he works", seviye: "A1" },
  { baslik: "Soru yapıları: Do you…? Does she…?", seviye: "A1" },
  { baslik: "can / can't", seviye: "A1" },
  { baslik: "in / on / at: zaman", seviye: "A1" },
  { baslik: "Şimdiki zaman: I'm working", seviye: "A1" },
  { baslik: "was / were", seviye: "A1" },
  { baslik: "a / an / the", seviye: "A2" },
  { baslik: "Sayılabilen ve sayılamayan isimler", seviye: "A2" },
  { baslik: "Geçmiş zaman: I worked, I went", seviye: "A2" },
  { baslik: "Karşılaştırma: bigger, more beautiful", seviye: "A2" },
  { baslik: "going to: plan", seviye: "A2" },
  { baslik: "-ed ve -ing sıfatlar: bored / boring", seviye: "A2" },
];

export const gramerKonusuBul = (kod: string): GramerKonusu | undefined => GRAMER_KONULARI.find((k) => k.kod === kod);

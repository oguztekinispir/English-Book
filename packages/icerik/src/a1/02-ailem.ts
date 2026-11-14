/**
 * A1 · Ünite 2 · Ailem ve işim (4 ders)
 * Orijinal içerik. Taslak: Claude · Kontrol: öğretmen · Durum: inceleme bekliyor
 * Gramer: my / your / his / her (iyelik eki), a / an, at (-de), not (değil), soru (-mı → başa)
 */
import type { Unite } from "../tipler";

/* Motor malzemesi */
const ZAMIR = [
  { en: "I", tr: "Ben", p: 0 as const },
  { en: "You", tr: "Sen", p: 1 as const },
  { en: "He", tr: "O (erkek)", p: 2 as const },
  { en: "She", tr: "O (kadın)", p: 2 as const },
];
const AILE = [
  { en: "My mother", tr: "Annem", p: 2 as const, nz: 1 as const, kok: "Anne" },
  { en: "My father", tr: "Babam", p: 2 as const, nz: 1 as const, kok: "Baba" },
  { en: "My sister", tr: "Kız kardeşim", p: 2 as const, nz: 1 as const, kok: "Kız kardeş" },
  { en: "My brother", tr: "Erkek kardeşim", p: 2 as const, nz: 1 as const, kok: "Erkek kardeş" },
];
const ES = [
  { en: "My wife", tr: "Eşim (kadın)", p: 2 as const, nz: 1 as const },
  { en: "My husband", tr: "Eşim (erkek)", p: 2 as const, nz: 1 as const },
];
const COGUL = [
  { en: "We", tr: "Biz", p: 3 as const },
  { en: "They", tr: "Onlar", p: 5 as const },
];
const MESLEK: [string, string, string[]?][] = [
  ["a doctor", "doktor"],
  ["a nurse", "hemşire"],
  ["an engineer", "mühendis"],
  ["a driver", "şoför"],
  ["a cook", "aşçı"],
  ["a waiter", "garson"],
  ["a lawyer", "avukat"],
  ["a farmer", "çiftçi"],
  ["an actor", "oyuncu"],
  ["a manager", "müdür"],
];
const YER: [string, string, string[]?][] = [
  ["at home", "evde"],
  ["at work", "işte"],
  ["at school", "okulda"],
];
const KIMLIK2: [string, string, string[]?][] = [
  ["a teacher", "öğretmen"],
  ["a student", "öğrenci"],
  ["Turkish", "Türk"],
  ["English", "İngiliz"],
  ["from Turkey", "Türkiye'den"],
  ["from England", "İngiltere'den"],
  ["German", "Alman"],
  ["from Germany", "Almanya'dan"],
];
/** Çoğul özneyle de doğru olan durumlar (a yok) */
const DURUM_COGUL: [string, string, string[]?][] = [...YER, ["married", "evli"], ["here", "burada"], ["Turkish", "Türk"], ["from Germany", "Almanya'dan"]];

export const A1_02: Unite = {
  id: "a1000000-0000-4000-8000-000000000002",
  kod: "a1-02",
  seviye: "A1",
  sira: 2,
  baslik: "Ailem ve işim",
  baslikEn: "Family and work",
  gramerEtiketi: "my / your / his / her, a / an, not, soru",
  hedefler: [
    "Aileni tanıtırsın: annem, babam, kardeşim.",
    "Ne iş yaptığını ve nerede olduğunu söylersin.",
    "“Değilim” dersin ve “… misin?” diye sorarsın.",
    "Kısa cevap verirsin: Yes, I am. No, she isn't.",
  ],
  ozelIsimler: ["Ayşe", "Murat", "Ela", "Ali", "Deniz", "Lisa", "Selin", "Mark", "Anna", "Emre", "Mert", "Kemal", "Elif", "Ankara", "Izmir"],

  dersler: [
    // ================================================================ 2.1
    {
      kod: "a1-02-1",
      no: 1,
      baslik: "Ailem",
      hedef: "Aileni tanıtır, kimin kim olduğunu söylersin.",
      kelimeGruplari: [
        {
          ad: "Aile",
          kelimeler: [
            { en: "family", tr: "aile", ok: "femıli", ornek: ["This is my family.", "Bu benim ailem."] },
            { en: "mother", tr: "anne", ok: "madhır", ipucu: "th yumuşak: dilin ucu dişlerin arasında, 'd' gibi." },
            { en: "father", tr: "baba", ok: "faadhır" },
            { en: "mum", tr: "anne (samimi)", ok: "mam", ipucu: "Evde mother değil mum denir. Amerikan İngilizcesinde mom." },
            { en: "dad", tr: "baba (samimi)", ok: "ded" },
            { en: "parents", tr: "anne baba, ebeveyn", ok: "perınts", ipucu: "Hep çoğul kullanılır: my parents = annemle babam." },
            { en: "brother", tr: "erkek kardeş, ağabey", ok: "bradhır", ipucu: "İngilizcede büyük-küçük ayrımı yok: ağabey de erkek kardeş de brother." },
            { en: "sister", tr: "kız kardeş, abla", ok: "sistır" },
            { en: "son", tr: "oğul", ok: "san" },
            { en: "daughter", tr: "kız (evlat)", ok: "dootır", ipucu: "gh okunmaz: doo-tır." },
            { en: "child", tr: "çocuk", ok: "çayld" },
            { en: "children", tr: "çocuklar", ok: "çildrın", ipucu: "Düzensiz çoğul: child → children (childs değil)." },
            { en: "baby", tr: "bebek", ok: "beybi" },
            { en: "wife", tr: "eş (kadın), karı", ok: "uayf" },
            { en: "husband", tr: "eş (erkek), koca", ok: "hazbınd", ipucu: "Türkçede ikisi de “eşim”. İngilizcede kadınsa wife, erkekse husband." },
            { en: "grandmother", tr: "büyükanne, anneanne, babaanne", ok: "grenmadhır" },
            { en: "grandfather", tr: "büyükbaba, dede", ok: "grenfaadhır" },
            { en: "boy", tr: "erkek çocuk, oğlan", ok: "boy" },
            { en: "girl", tr: "kız çocuk, kız", ok: "görl" },
          ],
        },
        {
          ad: "Kimin?",
          kelimeler: [
            { en: "his", tr: "onun (erkek)", ok: "hiz", ornek: ["His name is Murat.", "Onun adı Murat."] },
            { en: "her", tr: "onun (kadın)", ok: "hör", ornek: ["Her name is Ayşe.", "Onun adı Ayşe."], ipucu: "Türkçede tek bir “onun” var. İngilizcede sahibi erkekse his, kadınsa her." },
            { en: "our", tr: "bizim", ok: "auır" },
            { en: "their", tr: "onların", ok: "dher" },
          ],
        },
        {
          ad: "Fotoğrafa bak",
          kelimeler: [
            { en: "look", tr: "bakmak; Bak!", ok: "luk", ornek: ["Look! This is my family.", "Bak! Bu benim ailem."] },
            { en: "photo", tr: "fotoğraf", ok: "foutou" },
            { en: "very", tr: "çok", ok: "veri", ornek: ["Your family is very nice.", "Ailen çok hoş."] },
          ],
        },
      ],
      kaliplar: [
        { en: "This is my family.", tr: "Bu benim ailem." },
        { en: "Who is this?", tr: "Bu kim?", not: "Fotoğrafta birini gösterirken." },
        { en: "This is my mother.", tr: "Bu benim annem." },
        { en: "Her name is Ayşe.", tr: "Onun adı Ayşe.", not: "Kadın için her." },
        { en: "His name is Murat.", tr: "Onun adı Murat.", not: "Erkek için his." },
        { en: "Look!", tr: "Bak!" },
        { en: "Your family is very nice.", tr: "Ailen çok hoş." },
      ],
      gramer: [
        {
          baslik: "Anne-m = my mother: iyelik eki öne geçer",
          metin: [
            "Türkçede “kimin?” sorusunu kelimenin sonundaki ek cevaplar: anne-m, anne-n, anne-si. İngilizcede bu ek ayrı bir kelimedir ve öne gelir: my, your, his, her, our, their.",
            "Yani “annem” tek kelime, İngilizcesi iki kelime: my mother.",
          ],
          ornekler: [
            { tr: ["anne", "-m"], en: "[my] mother" },
            { tr: ["anne", "-n"], en: "[your] mother" },
            { tr: ["anne", "-si (erkeğin)"], en: "[his] mother" },
            { tr: ["anne", "-si (kadının)"], en: "[her] mother" },
            { tr: ["anne", "-miz"], en: "[our] mother" },
            { tr: ["anne", "-leri"], en: "[their] mother" },
          ],
          notlar: ["benim → my", "senin → your", "onun → his (erkek) / her (kadın)", "bizim → our", "onların → their"],
        },
        {
          baslik: "his mi, her mi?",
          metin: [
            "Türkçede “annesi” derken onun erkek mi kadın mı olduğu belli değil. İngilizcede belli olmak zorunda. Anneye değil, sahibine bak: Emre'nin annesi → his mother. Ayşe'nin babası → her father.",
          ],
          ornekler: [
            { tr: ["Emre'nin", "anne", "-si"], en: "[his] mother" },
            { tr: ["Ayşe'nin", "baba", "-sı"], en: "[her] father" },
            { tr: ["Emre'nin", "kız kardeş", "-i"], en: "[his] sister" },
          ],
        },
        {
          baslik: "-nin = 's",
          metin: ["Birinin adıyla söylerken Türkçedeki -nin / -ın eki İngilizcede kesme işaretiyle 's olur. Türkçedeki -si eki İngilizcede yazılmaz."],
          ornekler: [
            { tr: ["Emre", "'nin", "anne", "-si"], en: "Emre['s] mother" },
            { tr: ["Ayşe", "'nin", "ad", "-ı"], en: "Ayşe['s] name" },
          ],
          notlar: ["Dikkat: he's = he is. Emre's mother'daki 's ise “-nin” demek. Hangisi olduğu cümleden anlaşılır."],
        },
        {
          baslik: "Çoğul: -ler = -s",
          metin: ["Türkçedeki -ler / -lar eki İngilizcede kelimenin sonuna gelen -s'dir. Bunu bir sonraki derslerde daha çok göreceksin."],
          ornekler: [
            { tr: ["kardeş", "-ler"], en: "brother[s]" },
            { tr: ["kız", "-lar"], en: "girl[s]" },
            { tr: ["çocuk", "-lar"], en: "[children]" },
          ],
          notlar: ["child → children düzensiz; ezberle."],
        },
      ],
      diyaloglar: [
        {
          baslik: "Aile fotoğrafı",
          sahne: "Dersten sonra Deniz, öğretmeni Lisa'ya ailesinin fotoğrafını gösteriyor.",
          kisiler: { L: { ad: "Lisa", ses: "kadin" }, D: { ad: "Deniz", ses: "erkek" } },
          satirlar: [
            { kim: "L", en: "Deniz, who is this?", tr: "Deniz, bu kim?" },
            { kim: "D", en: "This is my family. Look! This is my mother. Her name is Ayşe.", tr: "Bu benim ailem. Bak! Bu benim annem. Onun adı Ayşe." },
            { kim: "L", en: "Nice! And who is this man?", tr: "Ne hoş! Ya bu adam kim?" },
            { kim: "D", en: "He's my father. His name is Murat.", tr: "O benim babam. Onun adı Murat." },
            { kim: "L", en: "And this baby?", tr: "Ya bu bebek?" },
            { kim: "D", en: "This is my sister, Ela. She's two years old.", tr: "Bu kız kardeşim Ela. İki yaşında." },
            { kim: "L", en: "And this boy?", tr: "Ya bu oğlan?" },
            { kim: "D", en: "He's my brother, Ali. He's twelve.", tr: "O erkek kardeşim Ali. On iki yaşında." },
            { kim: "L", en: "Your family is very nice, Deniz!", tr: "Ailen çok hoş Deniz!" },
            { kim: "D", en: "Thank you!", tr: "Teşekkür ederim!" },
          ],
        },
      ],
      alistirmalar: {
        bosluk: [
          { cumle: "This is ___ mother. (benim)", tr: "Bu benim annem.", secenekler: ["my", "your", "his"], cevap: "my" },
          { cumle: "Murat is my father. ___ name is Murat.", tr: "Murat benim babam. Onun adı Murat.", secenekler: ["His", "Her", "Your"], cevap: "His" },
          { cumle: "Ayşe is my mother. ___ name is Ayşe.", tr: "Ayşe benim annem. Onun adı Ayşe.", secenekler: ["His", "Her", "Their"], cevap: "Her" },
          { cumle: "This is ___ son. (bizim)", tr: "Bu bizim oğlumuz.", secenekler: ["our", "their", "your"], cevap: "our" },
          { cumle: "They are my parents. This is ___ photo.", tr: "Onlar annemle babam. Bu onların fotoğrafı.", secenekler: ["their", "our", "her"], cevap: "their" },
          { cumle: "My ___ is two years old. (bebek)", tr: "Bebeğim iki yaşında.", secenekler: ["baby", "boy", "father"], cevap: "baby" },
          { cumle: "My mother and my father are my ___.", tr: "Annem ve babam benim ebeveynlerim.", secenekler: ["parents", "children", "brothers"], cevap: "parents" },
        ],
        siralama: [
          { cevap: "This is my family.", tr: "Bu benim ailem." },
          { cevap: "Her name is Ayşe.", tr: "Onun adı Ayşe." },
          { cevap: "He is my brother.", tr: "O benim erkek kardeşim." },
          { cevap: "Who is this?", tr: "Bu kim?" },
        ],
      },
      motor: {
        aciklama: "Ailenle ilgili cümleler. Annem = my mother: ek öne geçer.",
        kaliplar: [["be", "pos"]],
        malzeme: { ozne: [...ZAMIR, ...AILE], durum: KIMLIK2 },
      },
      konusma: [
        { en: "Who is this?", tr: "Bu kim? (Ailenden birinin fotoğrafını göster.)", ornek: "This is my mother. Her name is Ayşe.", ornekTr: "Bu benim annem. Onun adı Ayşe." },
        { en: "What's your father's name?", tr: "Babanın adı ne?", ornek: "His name is Murat.", ornekTr: "Onun adı Murat." },
        { en: "How old is your brother?", tr: "Erkek kardeşin kaç yaşında?", ornek: "My brother is twelve years old.", ornekTr: "Erkek kardeşim on iki yaşında." },
      ],
      test: [
        { soru: "“Annem” İngilizcede hangisi?", secenekler: ["my mother", "your mother", "his mother"], dogru: 0, aciklama: "-m eki = my, ve öne geçer." },
        { soru: "Ayşe is my sister. ___ name is Ayşe.", secenekler: ["His", "Her", "Their"], dogru: 1, aciklama: "Ayşe kadın: her." },
        { soru: "“Onların annesi” hangisi?", secenekler: ["our mother", "their mother", "her mother"], dogru: 1, aciklama: "onların = their, bizim = our." },
        { soru: "“children” ne demek?", secenekler: ["çocuklar", "anne baba", "bebekler"], dogru: 0, aciklama: "child → children: düzensiz çoğul." },
        { soru: "Emre'nin annesi → ___ mother", secenekler: ["her", "his", "your"], dogru: 1, aciklama: "Sahibine bak: Emre erkek, his." },
      ],
    },

    // ================================================================ 2.2
    {
      kod: "a1-02-2",
      no: 2,
      baslik: "İşim",
      hedef: "Ne iş yaptığını, nerede olduğunu söyler; karşındakine işini sorarsın.",
      kelimeGruplari: [
        {
          ad: "Meslekler",
          kelimeler: [
            { en: "job", tr: "iş, meslek", ok: "cob", ornek: ["What's your job?", "İşin ne?"] },
            { en: "doctor", tr: "doktor", ok: "daktır" },
            { en: "nurse", tr: "hemşire", ok: "nörs" },
            { en: "engineer", tr: "mühendis", ok: "encinir", ipucu: "e sesiyle başlar, o yüzden an: an engineer." },
            { en: "driver", tr: "şoför, sürücü", ok: "drayvır" },
            { en: "cook", tr: "aşçı", ok: "kuk" },
            { en: "waiter", tr: "garson", ok: "ueytır" },
            { en: "police officer", tr: "polis memuru", ok: "pıliis ofisır" },
            { en: "lawyer", tr: "avukat", ok: "looyır" },
            { en: "farmer", tr: "çiftçi", ok: "faarmır" },
            { en: "actor", tr: "oyuncu, aktör", ok: "ektır", ipucu: "a sesiyle başlar: an actor." },
            { en: "manager", tr: "müdür, yönetici", ok: "menıcır" },
            { en: "worker", tr: "işçi", ok: "uörkır" },
          ],
        },
        {
          ad: "Nerede?",
          kelimeler: [
            { en: "at", tr: "-de, -da (nerede?)", ok: "et", ornek: ["She's at work.", "O işte."], ipucu: "Türkçede ek sonda (evde), İngilizcede kelime önde (at home)." },
            { en: "work", tr: "iş, işyeri", ok: "uörk", ornek: ["He's at work now.", "O şu an işte."] },
            { en: "home", tr: "ev", ok: "houm", ipucu: "Evde = at home. Arada a ya da the yok." },
            { en: "school", tr: "okul", ok: "skuul" },
            { en: "hospital", tr: "hastane", ok: "haspitıl" },
            { en: "office", tr: "ofis, büro", ok: "ofis" },
            { en: "restaurant", tr: "restoran, lokanta", ok: "restırant" },
            { en: "shop", tr: "dükkân, mağaza", ok: "şap" },
          ],
        },
        {
          ad: "Küçük kelimeler",
          kelimeler: [
            { en: "an", tr: "bir (sesli harften önce)", ok: "en", ornek: ["I'm an engineer.", "Mühendisim."] },
            { en: "now", tr: "şimdi, şu an", ok: "nau" },
          ],
        },
      ],
      kaliplar: [
        { en: "What's your job?", tr: "İşin ne? / Ne iş yapıyorsun?" },
        { en: "I'm a doctor.", tr: "Doktorum." },
        { en: "I'm an engineer.", tr: "Mühendisim.", not: "Sesli harften önce an." },
        { en: "I'm a nurse at a hospital.", tr: "Bir hastanede hemşireyim." },
        { en: "She's at work now.", tr: "O şu an işte." },
        { en: "My son is a student at this school.", tr: "Oğlum bu okulda öğrenci." },
      ],
      gramer: [
        {
          baslik: "a mı, an mı?",
          metin: [
            "Meslekten önce a gelir: a doctor. Ama kelime sesli bir harf sesiyle (a, e, i, o, u) başlıyorsa a yerine an denir; söylemesi kolay olsun diye.",
            "Türkçede ikisinin de karşılığı yok. “Bir doktorum” gibi düşünebilirsin.",
          ],
          ornekler: [
            { tr: ["Ben doktor", "-um"], en: "I am [a] doctor." },
            { tr: ["Ben mühendis", "-im"], en: "I am [an] engineer." },
            { tr: ["O oyuncu"], en: "She is [an] actor." },
          ],
          notlar: ["a + doctor, nurse, cook, driver…", "an + engineer, actor"],
        },
        {
          baslik: "-de eki = at (ve öne geçer)",
          metin: [
            "“Nerede?” sorusunu Türkçede -de / -da eki cevaplar: ev-de, iş-te, okul-da. İngilizcede bu ek at kelimesidir ve yerin önüne gelir. from ile aynı mantık.",
          ],
          ornekler: [
            { tr: ["O ev", "-de"], en: "She is [at] home." },
            { tr: ["Ben iş", "-te", "-yim"], en: "I am [at] work." },
            { tr: ["Onlar okul", "-da"], en: "They are [at] school." },
          ],
          notlar: ["at home, at work, at school: arada a ya da the yok."],
        },
        {
          baslik: "Çoğulda a yok, -s var",
          metin: ["Tek kişi için a doctor, birden çok kişi için doctors. Çoğulda a düşer, sona -s gelir. Türkçede “Onlar doktor” deriz; çoğul eki bile gerekmez."],
          ornekler: [
            { tr: ["O doktor"], en: "He is [a] doctor." },
            { tr: ["Onlar doktor"], en: "They are doctor[s]." },
            { tr: ["Biz öğretmen", "-iz"], en: "We are teacher[s]." },
          ],
        },
      ],
      diyaloglar: [
        {
          baslik: "Okulda tanışma",
          sahne: "Selin ve Mark, çocuklarının okulundaki veli toplantısında tanışıyor.",
          kisiler: { M: { ad: "Mark", ses: "erkek" }, S: { ad: "Selin", ses: "kadin" } },
          satirlar: [
            { kim: "M", en: "Hello! I'm Mark. My son is a student at this school.", tr: "Merhaba! Ben Mark. Oğlum bu okulda öğrenci." },
            { kim: "S", en: "Hi, Mark! I'm Selin. Nice to meet you.", tr: "Selam Mark! Ben Selin. Tanıştığımıza memnun oldum." },
            { kim: "M", en: "Nice to meet you too. What's your job, Selin?", tr: "Ben de memnun oldum. Ne iş yapıyorsun Selin?" },
            { kim: "S", en: "I'm a nurse. I'm a nurse at a hospital. And you?", tr: "Hemşireyim. Bir hastanede hemşireyim. Ya sen?" },
            { kim: "M", en: "I'm an engineer.", tr: "Ben mühendisim." },
            { kim: "S", en: "And your wife? What's her job?", tr: "Ya eşin? Onun işi ne?" },
            { kim: "M", en: "She's a doctor. She's at work now.", tr: "O doktor. Şu an işte." },
            { kim: "S", en: "My husband is a cook. He's at work now too.", tr: "Eşim aşçı. O da şu an işte." },
            { kim: "M", en: "Nice! See you, Selin!", tr: "Ne güzel! Görüşürüz Selin!" },
            { kim: "S", en: "Bye, Mark!", tr: "Hoşça kal Mark!" },
          ],
        },
      ],
      alistirmalar: {
        bosluk: [
          { cumle: "She is ___ engineer.", tr: "O mühendis.", secenekler: ["a", "an", "at"], cevap: "an" },
          { cumle: "He is ___ doctor.", tr: "O doktor.", secenekler: ["a", "an", "at"], cevap: "a" },
          { cumle: "I am at ___ now. (evde)", tr: "Şu an evdeyim.", secenekler: ["home", "work", "school"], cevap: "home" },
          { cumle: "They are at ___. (okulda)", tr: "Onlar okulda.", secenekler: ["home", "school", "work"], cevap: "school" },
          { cumle: "My father is a ___. (aşçı)", tr: "Babam aşçı.", secenekler: ["cook", "nurse", "driver"], cevap: "cook" },
          { cumle: "We are ___ work.", tr: "Biz işteyiz.", secenekler: ["at", "from", "to"], cevap: "at" },
          { cumle: "What's your ___?", tr: "İşin ne?", secenekler: ["job", "home", "at"], cevap: "job" },
          { cumle: "They are ___. (doktorlar)", tr: "Onlar doktor.", secenekler: ["doctors", "a doctor", "doctor"], cevap: "doctors" },
        ],
        siralama: [
          { cevap: "What's your job?", tr: "İşin ne?" },
          { cevap: "I am an engineer.", tr: "Ben mühendisim." },
          { cevap: "She is at work now.", tr: "O şu an işte." },
          { cevap: "My mother is a nurse.", tr: "Annem hemşire." },
        ],
      },
      motor: {
        aciklama: "Meslekler ve yerler. a mı an mı, dikkat et.",
        kaliplar: [["be", "pos"]],
        malzeme: { ozne: [...ZAMIR, ...AILE.slice(0, 2), ...ES], durum: [...MESLEK, ...YER] },
      },
      konusma: [
        { en: "What's your job?", tr: "İşin ne?", ornek: "I'm a student. / I'm a nurse.", ornekTr: "Öğrenciyim. / Hemşireyim." },
        { en: "What's your mother's job?", tr: "Annenin işi ne?", ornek: "She's a teacher.", ornekTr: "O öğretmen." },
        { en: "Where is your father now?", tr: "Baban şu an nerede?", ornek: "He's at work. / He's at home.", ornekTr: "İşte. / Evde." },
      ],
      test: [
        { soru: "She is ___ engineer.", secenekler: ["a", "an", "at"], dogru: 1, aciklama: "engineer e sesiyle başlar: an." },
        { soru: "“evde” İngilizcede hangisi?", secenekler: ["at home", "from home", "a home"], dogru: 0, aciklama: "-de = at, ve öne geçer." },
        { soru: "“Onlar doktor.”", secenekler: ["They are doctor.", "They are doctors.", "They are a doctors."], dogru: 1, aciklama: "Çoğulda a düşer, sona -s gelir." },
        { soru: "“What's your job?” ne soruyor?", secenekler: ["İşin ne?", "Nerelisin?", "Adın ne?"], dogru: 0, aciklama: "job = iş, meslek." },
        { soru: "“nurse” ne demek?", secenekler: ["hemşire", "garson", "müdür"], dogru: 0, aciklama: "waiter = garson, manager = müdür." },
      ],
    },

    // ================================================================ 2.3
    {
      kod: "a1-02-3",
      no: 3,
      baslik: "Değil mi, mi?",
      hedef: "“Değilim” der, “… misin?” diye sorar ve kısa cevap verirsin.",
      kelimeGruplari: [
        {
          ad: "Değil ve soru",
          kelimeler: [
            { en: "not", tr: "değil", ok: "nat", ornek: ["I'm not a doctor.", "Doktor değilim."], ipucu: "am / is / are'dan sonra gelir: I am not." },
            { en: "or", tr: "ya da, veya", ok: "or", ornek: ["Is he a doctor or a nurse?", "O doktor mu, hemşire mi?"] },
            { en: "OK", tr: "tamam", ok: "okey" },
            { en: "maybe", tr: "belki", ok: "meybi" },
          ],
        },
        {
          ad: "Yer ve zaman",
          kelimeler: [
            { en: "here", tr: "burada, burası", ok: "hiır", ipucu: "Burada = here. Önüne at gelmez." },
            { en: "there", tr: "orada, orası", ok: "dher" },
            { en: "that", tr: "şu, o", ok: "dhet", ornek: ["Who's that?", "Şu kim?"] },
            { en: "today", tr: "bugün", ok: "tıdey" },
          ],
        },
        {
          ad: "Durum",
          kelimeler: [
            { en: "married", tr: "evli", ok: "merid" },
            { en: "single", tr: "bekâr", ok: "singıl" },
            { en: "young", tr: "genç", ok: "yang" },
            { en: "busy", tr: "meşgul, yoğun", ok: "bizi", ipucu: "u harfi 'i' okunur: bi-zi." },
          ],
        },
      ],
      kaliplar: [
        { en: "Are you a teacher?", tr: "Öğretmen misin?" },
        { en: "Yes, I am.", tr: "Evet, öyleyim.", not: "Kısa cevapta am tekrar edilir." },
        { en: "No, I'm not.", tr: "Hayır, değilim." },
        { en: "Is she at home?", tr: "O evde mi?" },
        { en: "No, she isn't. She's at work.", tr: "Hayır, değil. İşte.", not: "isn't = is not" },
        { en: "Who's that?", tr: "Şu kim?" },
        { en: "Are you married?", tr: "Evli misin?" },
      ],
      gramer: [
        {
          baslik: "değil = not",
          metin: [
            "Türkçede “değil” kelimesi zaten ayrı yazılır; ona -im, -sin eklenir: değil-im. İngilizcede de not ayrı bir kelimedir ve am / is / are'dan hemen sonra gelir.",
            "Konuşurken is not → isn't, are not → aren't olur. I am not kısalınca I'm not olur (amn't diye bir şey yok).",
          ],
          ornekler: [
            { tr: ["Ben öğretmen", "değil", "-im"], en: "I am [not] a teacher." },
            { tr: ["O ev", "-de", "değil"], en: "She [isn't] at home." },
            { tr: ["Onlar Türk", "değil"], en: "They [aren't] Turkish." },
          ],
          notlar: ["I'm not", "he / she isn't", "you / we / they aren't"],
        },
        {
          baslik: "Soru eki -mi = am / is / are başa geçer",
          metin: [
            "Türkçede soru yapmak için cümlenin sonuna mi eki koyarız: Öğretmen misin? İngilizcede mi eki yoktur; onun yerine is / are cümlenin en başına geçer.",
            "Cümlenin geri kalanı aynı kalır. Sesin sonda yükselir.",
          ],
          ornekler: [
            { tr: ["Sen öğretmen", "-sin."], en: "You [are] a teacher." },
            { tr: ["Öğretmen", "mi", "-sin?"], en: "[Are] you a teacher?" },
            { tr: ["O ev", "-de", "mi?"], en: "[Is] she at home?" },
            { tr: ["Onlar evli", "mi?"], en: "[Are] they married?" },
          ],
        },
        {
          baslik: "Kısa cevap: Yes, I am. No, she isn't.",
          metin: [
            "Türkçede “Evet.” demek yeter. İngilizcede kısa cevapta kişi ve am / is / are tekrar edilir. Sadece “Yes.” demek kaba değil ama eksik duyulur.",
          ],
          ornekler: [
            { tr: ["Öğrenci misin?", "Evet."], en: "Yes, I [am]." },
            { tr: ["Öğrenci misin?", "Hayır."], en: "No, I['m not]." },
            { tr: ["O evli mi?", "Hayır."], en: "No, she [isn't]." },
          ],
          notlar: ["Olumlu kısa cevapta kısaltma yok: Yes, I am. (Yes, I'm yanlış)"],
        },
        {
          baslik: "Soru kelimesiyle: Where is he?",
          metin: ["Soru kelimesi (where, who, what, how) en başa gelir, sonra is / are."],
          ornekler: [
            { tr: ["O nerede?"], en: "[Where] [is] he?" },
            { tr: ["Şu kim?"], en: "[Who] [is] that?" },
          ],
        },
      ],
      diyaloglar: [
        {
          baslik: "Telefonda",
          sahne: "Anna, Emre'yi arıyor.",
          kisiler: { A: { ad: "Anna", ses: "kadin" }, E: { ad: "Emre", ses: "erkek" } },
          satirlar: [
            { kim: "A", en: "Hello, Emre! Are you at home?", tr: "Merhaba Emre! Evde misin?" },
            { kim: "E", en: "No, I'm not. I'm at work.", tr: "Hayır, değilim. İşteyim." },
            { kim: "A", en: "Are you busy?", tr: "Meşgul müsün?" },
            { kim: "E", en: "Yes, I am. Sorry, Anna.", tr: "Evet. Kusura bakma Anna." },
            { kim: "A", en: "OK. Is your sister at home?", tr: "Tamam. Kız kardeşin evde mi?" },
            { kim: "E", en: "No, she isn't. She's at school today.", tr: "Hayır, değil. Bugün okulda." },
            { kim: "A", en: "Is your mother there?", tr: "Annen orada mı?" },
            { kim: "E", en: "Yes, she is. She's at home.", tr: "Evet. O evde." },
            { kim: "A", en: "Thank you, Emre! Bye!", tr: "Teşekkürler Emre! Hoşça kal!" },
            { kim: "E", en: "Bye, Anna!", tr: "Hoşça kal Anna!" },
          ],
        },
        {
          baslik: "Kim bu?",
          sahne: "Selin ve Mark bir düğünde. Mark birini gösteriyor.",
          kisiler: { M: { ad: "Mark", ses: "erkek" }, S: { ad: "Selin", ses: "kadin" } },
          satirlar: [
            { kim: "M", en: "Selin, who's that?", tr: "Selin, şu kim?" },
            { kim: "S", en: "That's my brother, Emre.", tr: "Şu benim ağabeyim Emre." },
            { kim: "M", en: "Is he a doctor?", tr: "O doktor mu?" },
            { kim: "S", en: "No, he isn't. He's an engineer.", tr: "Hayır, değil. Mühendis." },
            { kim: "M", en: "Is he married?", tr: "Evli mi?" },
            { kim: "S", en: "No, he isn't. He's single. And he's very busy!", tr: "Hayır, değil. Bekâr. Ve çok meşgul!" },
          ],
        },
      ],
      alistirmalar: {
        bosluk: [
          { cumle: "I am ___ a doctor.", tr: "Ben doktor değilim.", secenekler: ["not", "no", "or"], cevap: "not" },
          { cumle: "___ you a student?", tr: "Öğrenci misin?", secenekler: ["Are", "Is", "Am"], cevap: "Are" },
          { cumle: "___ she at home?", tr: "O evde mi?", secenekler: ["Are", "Is", "Am"], cevap: "Is" },
          { cumle: "No, he ___. (değil)", tr: "Hayır, değil.", secenekler: ["isn't", "aren't", "not"], cevap: "isn't" },
          { cumle: "They ___ at work. (değil)", tr: "Onlar işte değil.", secenekler: ["isn't", "aren't", "not"], cevap: "aren't" },
          { cumle: "Yes, I ___.", tr: "Evet, öyleyim.", secenekler: ["am", "is", "are"], cevap: "am" },
          { cumle: "Is he a doctor ___ a nurse?", tr: "O doktor mu, hemşire mi?", secenekler: ["or", "and", "too"], cevap: "or" },
          { cumle: "___ is your father?", tr: "Baban nerede?", secenekler: ["Where", "Who", "How"], cevap: "Where" },
        ],
        siralama: [
          { cevap: "Are you at home?", tr: "Evde misin?" },
          { cevap: "She is not at school.", tr: "O okulda değil." },
          { cevap: "Is your father a doctor?", tr: "Baban doktor mu?" },
          { cevap: "No, I am not.", tr: "Hayır, değilim." },
        ],
      },
      motor: {
        aciklama: "Olumsuz ve soru. değil = not; soru eki yerine is / are başa geçer.",
        kaliplar: [
          ["be", "neg"],
          ["be", "q"],
        ],
        malzeme: { ozne: [...ZAMIR, ...COGUL, AILE[0], AILE[3]], durum: DURUM_COGUL },
      },
      konusma: [
        { en: "Are you a student?", tr: "Öğrenci misin?", ornek: "Yes, I am. / No, I'm not. I'm a teacher.", ornekTr: "Evet. / Hayır, değilim. Öğretmenim." },
        { en: "Is your mother at home now?", tr: "Annen şu an evde mi?", ornek: "No, she isn't. She's at work.", ornekTr: "Hayır, değil. İşte." },
        { en: "Are you married?", tr: "Evli misin?", ornek: "No, I'm not. I'm single.", ornekTr: "Hayır, değilim. Bekârım." },
        { en: "Are you busy today?", tr: "Bugün meşgul müsün?", ornek: "Yes, I am. / No, I'm not.", ornekTr: "Evet. / Hayır, değilim." },
      ],
      test: [
        { soru: "“Ben öğretmen değilim.”", secenekler: ["I am not a teacher.", "I not am a teacher.", "I am a teacher not."], dogru: 0, aciklama: "not, am'den hemen sonra gelir." },
        { soru: "“O evde mi?”", secenekler: ["She is at home?", "Is she at home?", "She at home is?"], dogru: 1, aciklama: "Soru eki yok; is başa geçer." },
        { soru: "“Are you a doctor?” Hayır diye kısa cevap:", secenekler: ["No, I am.", "No, I'm not.", "No, I isn't."], dogru: 1, aciklama: "I ile am: No, I'm not." },
        { soru: "They ___ at school. (değil)", secenekler: ["isn't", "aren't", "not"], dogru: 1, aciklama: "they ile are: aren't." },
        { soru: "“değil” İngilizcede hangisi?", secenekler: ["not", "no", "or"], dogru: 0, aciklama: "no = hayır, or = ya da." },
      ],
    },

    // ================================================================ 2.4
    {
      kod: "a1-02-4",
      no: 4,
      baslik: "Tekrar ve ünite testi",
      hedef: "Aileni ve işini anlatır, başkasına sorular sorarsın.",
      tekrar: true,
      kelimeGruplari: [],
      kaliplar: [],
      gramer: [
        {
          baslik: "Ünitenin özeti",
          metin: [
            "Bu ünitede Türkçedeki üç eki daha İngilizcede kelime olarak gördün: iyelik eki (-m → my), -de (→ at) ve soru eki (-mi → is / are başa). Bir de değil = not.",
          ],
          ornekler: [
            { tr: ["anne", "-m"], en: "[my] mother" },
            { tr: ["O iş", "-te"], en: "She is [at] work." },
            { tr: ["Ben doktor", "değil", "-im"], en: "I am [not] a doctor." },
            { tr: ["Evli", "mi", "-sin?"], en: "[Are] you married?" },
            { tr: ["O mühendis"], en: "He is [an] engineer." },
          ],
          notlar: ["my, your, his, her, our, their", "a doctor, an engineer", "at home, at work, at school", "isn't, aren't, I'm not"],
        },
      ],
      diyaloglar: [],
      okuma: {
        baslik: "Mert'in ailesi",
        satirlar: [
          { en: "Hi! I'm Mert. I'm sixteen years old.", tr: "Selam! Ben Mert. On altı yaşındayım." },
          { en: "This is my family.", tr: "Bu benim ailem." },
          { en: "My father is a driver. His name is Kemal.", tr: "Babam şoför. Onun adı Kemal." },
          { en: "My mother is a nurse at a hospital. Her name is Elif.", tr: "Annem bir hastanede hemşire. Onun adı Elif." },
          { en: "My sister is twenty. She's a student. She isn't married.", tr: "Ablam yirmi yaşında. Öğrenci. Evli değil." },
          { en: "My grandmother is very old. She's at home today.", tr: "Babaannem çok yaşlı. Bugün evde." },
          { en: "We are from Ankara.", tr: "Biz Ankaralıyız." },
        ],
        sorular: [
          { en: "Mert is sixteen years old.", tr: "Mert on altı yaşında.", dogru: true },
          { en: "His father is a doctor.", tr: "Babası doktor.", dogru: false },
          { en: "His mother is a nurse.", tr: "Annesi hemşire.", dogru: true },
          { en: "His sister is married.", tr: "Ablası evli.", dogru: false },
          { en: "His grandmother is at home today.", tr: "Babaannesi bugün evde.", dogru: true },
        ],
      },
      alistirmalar: {
        bosluk: [
          { cumle: "Elif is my mother. ___ name is Elif.", tr: "Elif benim annem. Onun adı Elif.", secenekler: ["Her", "His", "Our"], cevap: "Her" },
          { cumle: "He is ___ actor.", tr: "O oyuncu.", secenekler: ["a", "an", "at"], cevap: "an" },
          { cumle: "My father is ___ work.", tr: "Babam işte.", secenekler: ["at", "from", "a"], cevap: "at" },
          { cumle: "___ your sister married?", tr: "Kız kardeşin evli mi?", secenekler: ["Is", "Are", "Am"], cevap: "Is" },
          { cumle: "No, I'm ___. I'm single.", tr: "Hayır, değilim. Bekârım.", secenekler: ["not", "no", "isn't"], cevap: "not" },
        ],
        siralama: [
          { cevap: "His name is Kemal.", tr: "Onun adı Kemal." },
          { cevap: "Is your mother a nurse?", tr: "Annen hemşire mi?" },
          { cevap: "We are not at home.", tr: "Biz evde değiliz." },
        ],
      },
      motor: {
        aciklama: "Ünitenin bütün cümleleri karışık: olumlu, olumsuz, soru.",
        kaliplar: [
          ["be", "pos"],
          ["be", "neg"],
          ["be", "q"],
        ],
        malzeme: { ozne: [...ZAMIR, ...COGUL, ...AILE], durum: DURUM_COGUL },
      },
      konusma: [
        { en: "Who are they?", tr: "Bunlar kim? (Ailenin fotoğrafını göster, tanıt.)", ornek: "This is my mother. Her name is Ayşe. This is my father. His name is Murat.", ornekTr: "Bu annem, adı Ayşe. Bu babam, adı Murat." },
        { en: "What's your job?", tr: "İşin ne?", ornek: "I'm a student. / I'm an engineer.", ornekTr: "Öğrenciyim. / Mühendisim." },
        { en: "What's your father's job?", tr: "Babanın işi ne?", ornek: "He's a driver.", ornekTr: "O şoför." },
        { en: "Are you married?", tr: "Evli misin?", ornek: "No, I'm not. I'm single.", ornekTr: "Hayır, değilim. Bekârım." },
        { en: "Is your mother at work today?", tr: "Annen bugün işte mi?", ornek: "No, she isn't. She's at home.", ornekTr: "Hayır, değil. Evde." },
        { en: "Hello! Who are you?", tr: "Merhaba! Sen kimsin? (Kendini ve aileni tanıt.)", ornek: "Hi! I'm Mert. I'm sixteen. I'm a student. My father is a driver and my mother is a nurse.", ornekTr: "Selam! Ben Mert. On altı yaşındayım. Öğrenciyim. Babam şoför, annem hemşire." },
      ],
      test: [
        { soru: "“Babam” İngilizcede hangisi?", secenekler: ["my father", "your father", "his father"], dogru: 0, aciklama: "-m eki = my." },
        { soru: "Ayşe'nin kardeşi → ___ brother", secenekler: ["his", "her", "their"], dogru: 1, aciklama: "Ayşe kadın: her." },
        { soru: "He is ___ engineer.", secenekler: ["a", "an", "at"], dogru: 1, aciklama: "Sesli harften önce an." },
        { soru: "“Onlar işte.”", secenekler: ["They are at work.", "They are work.", "They at work."], dogru: 0, aciklama: "-te = at; are de unutulmaz." },
        { soru: "“Evli misin?”", secenekler: ["You are married?", "Are you married?", "Married you are?"], dogru: 1, aciklama: "Soru eki yerine are başa geçer." },
        { soru: "“Is she a teacher?” Evet diye kısa cevap:", secenekler: ["Yes, she is.", "Yes, she's.", "Yes, is she."], dogru: 0, aciklama: "Olumlu kısa cevapta kısaltma yok." },
        { soru: "“O doktor değil.”", secenekler: ["He not a doctor.", "He isn't a doctor.", "He aren't a doctor."], dogru: 1, aciklama: "he ile is → isn't." },
        { soru: "“Onlar doktor.”", secenekler: ["They are doctors.", "They are a doctor.", "They are doctor."], dogru: 0, aciklama: "Çoğulda a düşer, -s gelir." },
        { soru: "“children” ne demek?", secenekler: ["çocuklar", "kızlar", "ebeveynler"], dogru: 0, aciklama: "child → children." },
        { soru: "“bugün” İngilizcede hangisi?", secenekler: ["now", "today", "here"], dogru: 1, aciklama: "now = şimdi, here = burada." },
      ],
    },
  ],
};

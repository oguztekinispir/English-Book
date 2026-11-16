/**
 * Seviye testi: 5 basamak × 4 soru. Her basamak A1 planında bir ünite aralığına denk gelir.
 * Öğrenci bir basamakta 3'ten az doğru yaparsa test orada biter ve o basamağın ilk ünitesinden
 * başlaması önerilir (A1 birikimli ilerler; bilmediği basamaktan sonrası sorulmaz).
 * Sorular özgündür; doğru cevap her zaman secenekler[0], ekranda karıştırılır.
 */

export type SeviyeSoruTuru = "cevir" | "bosluk" | "dinle";

export interface SeviyeSoru {
  tur: SeviyeSoruTuru;
  /** cevir: Türkçe cümle · bosluk: ___ içeren İngilizce cümle · dinle: okunacak İngilizce cümle */
  soru: string;
  /** İlk seçenek doğru cevaptır */
  secenekler: string[];
  /** Cevaptan sonra gösterilen kısa açıklama */
  aciklama: string;
}

export interface SeviyeBasamak {
  /** Bu basamakta zorlanırsa başlanacak ünite (A1_PLAN sırası) */
  baslangic: number;
  ad: string;
  /** Sonuç ekranında: "am / is / are, my / your" gibi */
  konu: string;
  sorular: SeviyeSoru[];
}

export const SEVIYE_TESTI: SeviyeBasamak[] = [
  {
    baslangic: 1,
    ad: "Tanışma",
    konu: "I am / you are, my / your, a / an",
    sorular: [
      {
        tur: "cevir",
        soru: "Merhaba, benim adım Deniz.",
        secenekler: ["Hello, my name is Deniz.", "Hello, I name is Deniz.", "Hello, me name Deniz."],
        aciklama: "“Benim adım” = my name. Ardından is gelir: my name is.",
      },
      {
        tur: "dinle",
        soru: "Where are you from?",
        secenekler: ["Nerelisin?", "Kaç yaşındasın?", "Adın ne?", "Nasılsın?"],
        aciklama: "Where = nerede, from = -den. Where are you from? = Nerelisin?",
      },
      {
        tur: "bosluk",
        soru: "She ___ a nurse.",
        secenekler: ["is", "am", "are", "be"],
        aciklama: "He / she / it ile is kullanılır: She is a nurse.",
      },
      {
        tur: "cevir",
        soru: "Annem öğretmen.",
        secenekler: ["My mother is a teacher.", "My mother teacher.", "My mother is teacher.", "Mother my is a teacher."],
        aciklama: "Türkçede “-dir” söylenmez ama İngilizcede is şart. Meslekten önce de a gelir: a teacher.",
      },
    ],
  },
  {
    baslangic: 3,
    ad: "Durumlar ve eşyalar",
    konu: "Are you…?, have got, there is / are, in / on / under",
    sorular: [
      {
        tur: "cevir",
        soru: "Yorgun musun?",
        secenekler: ["Are you tired?", "You are tired?", "Do you tired?", "Is you tired?"],
        aciklama: "Soruda are başa geçer: Are you tired?",
      },
      {
        tur: "cevir",
        soru: "İki kız kardeşim var.",
        secenekler: ["I have got two sisters.", "I have got two sister.", "There is two sisters.", "I am two sisters."],
        aciklama: "Sahip olmak: have got. İki tane olduğu için sister → sisters.",
      },
      {
        tur: "bosluk",
        soru: "There ___ three books on the table.",
        secenekler: ["are", "is", "have", "has"],
        aciklama: "Birden fazla şey için there are: There are three books.",
      },
      {
        tur: "cevir",
        soru: "Kedi masanın altında.",
        secenekler: ["The cat is under the table.", "The cat is on the table.", "The cat is in the table.", "The cat under the table."],
        aciklama: "Altında = under. Türkçedeki -da eki İngilizcede ayrı bir kelime olur.",
      },
    ],
  },
  {
    baslangic: 6,
    ad: "Günlük hayat",
    konu: "geniş zaman, he works, Do you…?, can",
    sorular: [
      {
        tur: "cevir",
        soru: "Her sabah kahve içerim.",
        secenekler: ["I drink coffee every morning.", "I drinking coffee every morning.", "I am drink coffee every morning.", "I drinks coffee every morning."],
        aciklama: "Geniş zaman: I drink. Her sabah (every morning) cümlenin sonuna gelir.",
      },
      {
        tur: "bosluk",
        soru: "My brother ___ in a bank.",
        secenekler: ["works", "work", "is work", "working"],
        aciklama: "He / she ile geniş zamanda fiile -s eklenir: he works.",
      },
      {
        tur: "cevir",
        soru: "Çay sever misin?",
        secenekler: ["Do you like tea?", "Are you like tea?", "Does you like tea?", "You like tea?"],
        aciklama: "Fiilli soruda Do başa gelir: Do you like tea?",
      },
      {
        tur: "cevir",
        soru: "Yüzemem.",
        secenekler: ["I can't swim.", "I don't can swim.", "I not swim.", "I can swim not."],
        aciklama: "-eme / -ama eki İngilizcede can't olur: I can't swim.",
      },
    ],
  },
  {
    baslangic: 10,
    ad: "Dışarıda",
    konu: "in May / on Monday, yol tarifi, How much…?",
    sorular: [
      {
        tur: "bosluk",
        soru: "My birthday is ___ May.",
        secenekler: ["in", "on", "at", "to"],
        aciklama: "Aylardan önce in: in May. Günlerden önce on: on Monday.",
      },
      {
        tur: "dinle",
        soru: "Turn left at the bank.",
        secenekler: ["Bankadan sola dön.", "Bankadan sağa dön.", "Banka solda.", "Bankaya git."],
        aciklama: "Turn left = sola dön, at the bank = bankada / bankadan.",
      },
      {
        tur: "cevir",
        soru: "Bu ceket ne kadar?",
        secenekler: ["How much is this jacket?", "How many is this jacket?", "What much is this jacket?", "How much this jacket?"],
        aciklama: "Fiyat sorarken How much is…? kullanılır.",
      },
      {
        tur: "bosluk",
        soru: "It's cold. ___ the window, please.",
        secenekler: ["Close", "Closes", "Closing", "You close"],
        aciklama: "Rica ya da emir cümlesi fiilin yalın haliyle başlar: Close the window.",
      },
    ],
  },
  {
    baslangic: 13,
    ad: "Şimdi ve dün",
    konu: "I am working, was / were, geçmiş zaman",
    sorular: [
      {
        tur: "cevir",
        soru: "Şu an kitap okuyorum.",
        secenekler: ["I am reading a book now.", "I read a book now.", "I reading a book now.", "I am read a book now."],
        aciklama: "-ıyor eki = am / is / are + fiil-ing: I am reading.",
      },
      {
        tur: "bosluk",
        soru: "We ___ at home yesterday.",
        secenekler: ["were", "was", "are", "did"],
        aciklama: "Geçmişte durum: I / he / she → was, we / you / they → were.",
      },
      {
        tur: "cevir",
        soru: "Dün sinemaya gittim.",
        secenekler: ["I went to the cinema yesterday.", "I goed to the cinema yesterday.", "I go to the cinema yesterday.", "I was go to the cinema yesterday."],
        aciklama: "go düzensiz bir fiil, geçmişi went.",
      },
      {
        tur: "cevir",
        soru: "Hafta sonu ne yaptın?",
        secenekler: ["What did you do at the weekend?", "What you did at the weekend?", "What do you did at the weekend?", "What were you do at the weekend?"],
        aciklama: "Geçmiş zaman sorusu: What did you do…? (did başa, fiil yalın).",
      },
    ],
  },
];

/** Basamak geçme sınırı (4 sorudan) */
export const SEVIYE_GECME = 3;

export interface SeviyeSonucu {
  /** Başlaması önerilen ünite sırası (1..14). A1'i tamamen geçtiyse 15. */
  unite: number;
  /** Her basamağın doğru sayısı (çözülmeyen basamak yok) */
  puanlar: number[];
}

/** Basamak puanlarından öneri çıkarır. puanlar sırayla, çözüldüğü kadar. */
export function seviyeSonucu(puanlar: number[]): SeviyeSonucu {
  const i = puanlar.findIndex((p) => p < SEVIYE_GECME);
  return { unite: i === -1 ? (puanlar.length === SEVIYE_TESTI.length ? 15 : SEVIYE_TESTI[puanlar.length].baslangic) : SEVIYE_TESTI[i].baslangic, puanlar };
}

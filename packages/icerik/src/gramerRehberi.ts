/**
 * Gramer anahtarı: Türkçedeki ekler İngilizcede ayrı kelimedir.
 * Orijinal içerik. [köşeli parantez] = vurgulu kısım.
 */
export interface RehberSatiri {
  ek: string;
  en: string;
  /** "I [am] tired." */
  ornek: string;
  /** "Yorgun[um]." */
  tr: string;
}

export const EK_ANAHTARI: { baslik: string; satirlar: RehberSatiri[] }[] = [
  {
    baslik: "Zaman ekleri",
    satirlar: [
      { ek: "-ım, -sın, -dır (şimdi, durum)", en: "am / is / are", ornek: "I [am] tired.", tr: "Yorgun[um]." },
      { ek: "-dı, -dum (geçmiş, durum)", en: "was / were", ornek: "I [was] tired.", tr: "Yorgun[dum]." },
      { ek: "-ır, -er (geniş zaman)", en: "fiil yalın; he / she ile -s", ornek: "He work[s].", tr: "Çalış[ır]." },
      { ek: "-dı (geçmiş, eylem)", en: "fiil + ed (ya da düzensiz)", ornek: "I work[ed]. I [went].", tr: "Çalış[tım]. Git[tim]." },
      { ek: "-ıyor (şu an)", en: "am / is / are + fiil-ing", ornek: "I am work[ing].", tr: "Çalış[ıyor]um." },
      { ek: "-ecek (gelecek)", en: "will + fiil", ornek: "I [will] go.", tr: "Gid[eceğ]im." },
      { ek: "-ebil (yapabilmek)", en: "can + fiil", ornek: "I [can] swim.", tr: "Yüz[ebil]irim." },
    ],
  },
  {
    baslik: "Soru ve olumsuz",
    satirlar: [
      { ek: "-mı (durum sorusu)", en: "Are / Is / Am başa", ornek: "[Are] you tired?", tr: "Yorgun [mu]sun?" },
      { ek: "-mı (eylem sorusu)", en: "Do / Does başa", ornek: "[Do] you work?", tr: "Çalışır [mı]sın?" },
      { ek: "-dı mı (geçmiş sorusu)", en: "Did başa", ornek: "[Did] you sleep?", tr: "Uyu[du]n [mu]?" },
      { ek: "değil", en: "not", ornek: "I am [not] tired.", tr: "Yorgun [değil]im." },
      { ek: "-me, -ma (eylem olumsuz)", en: "don't / doesn't", ornek: "I [don't] work.", tr: "Çalış[ma]m." },
      { ek: "-medi (geçmiş olumsuz)", en: "didn't", ornek: "I [didn't] sleep.", tr: "Uyu[ma]dım." },
    ],
  },
  {
    baslik: "Yer, yön, sahiplik, bağlaçlar",
    satirlar: [
      { ek: "-de, -da (yer)", en: "at / in / on", ornek: "[at] work, [in] Istanbul", tr: "iş[te], İstanbul'[da]" },
      { ek: "-e, -a (yön)", en: "to", ornek: "I go [to] work.", tr: "İş[e] giderim." },
      { ek: "-den, -dan", en: "from", ornek: "[from] Turkey", tr: "Türkiye'[den]" },
      { ek: "benim, senin (-im, -in)", en: "my, your, his, her", ornek: "[my] name", tr: "ad[ım]" },
      { ek: "-ler, -lar (çoğul)", en: "-s", ornek: "hand[s]", tr: "el[ler]" },
      { ek: "bir", en: "a / an", ornek: "[a] student", tr: "[bir] öğrenci" },
      { ek: "ile, -la, -le", en: "with", ornek: "[with] my family", tr: "aile[mle]" },
      { ek: "için", en: "for", ornek: "[for] you", tr: "senin [için]" },
      { ek: "ve, ama, çünkü", en: "and, but, because", ornek: "tired [but] happy", tr: "yorgun [ama] mutlu" },
      { ek: "var (sahiplik)", en: "have / has", ornek: "I [have] a car.", tr: "Arabam [var]." },
      { ek: "var (bir yerde)", en: "there is / there are", ornek: "[There is] a park.", tr: "Bir park [var]." },
    ],
  },
];

/** "Kelime kelime çöz" örnekleri */
export const COZUM_ORNEKLERI: { en: string; coz: string; tr: string }[] = [
  { en: "I [didn't] sleep well.", coz: "I (ben) + didn't (-medi) + sleep (uyu) + well (iyi)", tr: "İyi uyu[ma]dım." },
  { en: "[Do] you work [at] home?", coz: "Do (-mı) + you (sen) + work (çalış) + at (-de) + home (ev)", tr: "Ev[de] çalışır [mı]sın?" },
  { en: "[My] name [is] Emre.", coz: "My (benim) + name (ad) + is (-dır) + Emre", tr: "Ad[ım] Emre." },
];

/**
 * "Eki bul" oyunu: cümledeki işaretli İngilizce kelime, Türkçedeki hangi ekin yerine geçiyor?
 * Orijinal cümleler (kitaptan alıntı yok). [köşeli parantez] = işaretli kelime.
 */
export interface EkiBulSorusu {
  s: string;
  /** Türkçedeki karşılığı (şık olarak gösterilir) */
  a: string;
  tr: string;
  /** Hangi ünitede öğretiliyor (15 = A2) */
  u: number;
}

export const EKI_BUL: EkiBulSorusu[] = [
  { s: "I [am] a student.", a: "-ım / -sın (şimdi, durum)", tr: "Öğrenciyim.", u: 1 },
  { s: "She [is] my friend.", a: "-ım / -sın (şimdi, durum)", tr: "O benim arkadaşım.", u: 1 },
  { s: "We [are] from Turkey.", a: "-ım / -sın (şimdi, durum)", tr: "Türkiye'deniz.", u: 1 },
  { s: "I [was] tired.", a: "-dı / -dum (geçmiş, durum)", tr: "Yorgundum.", u: 14 },
  { s: "They [were] at home.", a: "-dı / -dum (geçmiş, durum)", tr: "Evdeydiler.", u: 14 },
  { s: "[Are] you a teacher?", a: "-mı (soru, durum)", tr: "Öğretmen misin?", u: 2 },
  { s: "[Is] she Turkish?", a: "-mı (soru, durum)", tr: "O Türk mü?", u: 2 },
  { s: "I am [not] hungry.", a: "değil", tr: "Aç değilim.", u: 2 },
  { s: "He is [not] at work.", a: "değil", tr: "O işte değil.", u: 2 },
  { s: "She [works] in a bank.", a: "-ır / -er (geniş zaman)", tr: "O bir bankada çalışır.", u: 7 },
  { s: "He [drinks] tea every day.", a: "-ır / -er (geniş zaman)", tr: "O her gün çay içer.", u: 7 },
  { s: "I [don't] like coffee.", a: "-me / -ma (olumsuz, eylem)", tr: "Kahveyi sevmem.", u: 8 },
  { s: "She [doesn't] eat fish.", a: "-me / -ma (olumsuz, eylem)", tr: "O balık yemez.", u: 8 },
  { s: "[Do] you speak English?", a: "-mı (soru, eylem)", tr: "İngilizce konuşur musun?", u: 8 },
  { s: "[Does] he live here?", a: "-mı (soru, eylem)", tr: "O burada mı yaşar?", u: 8 },
  { s: "I [watched] TV.", a: "-dı (geçmiş, eylem)", tr: "Televizyon izledim.", u: 14 },
  { s: "We [went] home.", a: "-dı (geçmiş, eylem)", tr: "Eve gittik.", u: 14 },
  { s: "I [didn't] sleep well.", a: "-medi (geçmiş olumsuz)", tr: "İyi uyumadım.", u: 14 },
  { s: "[Did] you call me?", a: "-dı mı (geçmiş sorusu)", tr: "Beni aradın mı?", u: 14 },
  { s: "I [can] swim.", a: "-ebil (yapabilmek)", tr: "Yüzebilirim.", u: 9 },
  { s: "[Can] you help me?", a: "-ebil (yapabilmek)", tr: "Bana yardım edebilir misin?", u: 9 },
  { s: "I [will] call you.", a: "-ecek (gelecek)", tr: "Seni arayacağım.", u: 15 },
  { s: "I am [working] now.", a: "-ıyor (şu an)", tr: "Şu an çalışıyorum.", u: 13 },
  { s: "I am [at] home.", a: "-de / -da (yer)", tr: "Evdeyim.", u: 5 },
  { s: "She lives [in] London.", a: "-de / -da (yer)", tr: "O Londra'da yaşar.", u: 5 },
  { s: "I go [to] school.", a: "-e / -a (yön)", tr: "Okula giderim.", u: 6 },
  { s: "I'm [from] Turkey.", a: "-den / -dan", tr: "Türkiye'denim.", u: 1 },
  { s: "[My] name is Ali.", a: "benim (-im)", tr: "Benim adım Ali.", u: 1 },
  { s: "What is [your] name?", a: "senin (-in)", tr: "Senin adın ne?", u: 1 },
  { s: "I have two [cats].", a: "-ler / -lar (çoğul)", tr: "İki kedim var.", u: 4 },
  { s: "She is [a] teacher.", a: "bir", tr: "O bir öğretmen.", u: 1 },
  { s: "I go [with] my friend.", a: "ile (-la / -le)", tr: "Arkadaşımla giderim.", u: 6 },
  { s: "This is [for] you.", a: "için", tr: "Bu senin için.", u: 8 },
  { s: "I'm tired, [but] I'm happy.", a: "ama", tr: "Yorgunum ama mutluyum.", u: 3 },
  { s: "I [have] a car.", a: "var (sahiplik)", tr: "Arabam var.", u: 4 },
  { s: "[There is] a park here.", a: "var (bir yerde)", tr: "Burada bir park var.", u: 5 },
  { s: "You [should] sleep.", a: "-meli / -malı", tr: "Uyumalısın.", u: 15 },
];

export const EKI_BUL_SIKLARI = [...new Set(EKI_BUL.map((x) => x.a))];

/** Öğrencinin ulaştığı üniteye kadar öğretilmiş ekler */
export const ekiBulHavuzu = (enUstUnite: number) => EKI_BUL.filter((x) => x.u <= enUstUnite);

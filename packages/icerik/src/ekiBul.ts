/**
 * "Eki bul" oyunu: cümledeki işaretli İngilizce kelime, Türkçedeki hangi ekin yerine geçiyor?
 * Orijinal cümleler (kitaptan alıntı yok). [köşeli parantez] = işaretli kelime.
 */
export interface EkiBulSorusu {
  s: string;
  /** Türkçedeki karşılığı (şık olarak gösterilir) */
  a: string;
  tr: string;
}

export const EKI_BUL: EkiBulSorusu[] = [
  { s: "I [am] a student.", a: "-ım / -sın (şimdi, durum)", tr: "Öğrenciyim." },
  { s: "She [is] my friend.", a: "-ım / -sın (şimdi, durum)", tr: "O benim arkadaşım." },
  { s: "We [are] from Turkey.", a: "-ım / -sın (şimdi, durum)", tr: "Türkiye'deniz." },
  { s: "I [was] tired.", a: "-dı / -dum (geçmiş, durum)", tr: "Yorgundum." },
  { s: "They [were] at home.", a: "-dı / -dum (geçmiş, durum)", tr: "Evdeydiler." },
  { s: "[Are] you a teacher?", a: "-mı (soru, durum)", tr: "Öğretmen misin?" },
  { s: "[Is] she Turkish?", a: "-mı (soru, durum)", tr: "O Türk mü?" },
  { s: "I am [not] hungry.", a: "değil", tr: "Aç değilim." },
  { s: "He is [not] at work.", a: "değil", tr: "O işte değil." },
  { s: "She [works] in a bank.", a: "-ır / -er (geniş zaman)", tr: "O bir bankada çalışır." },
  { s: "He [drinks] tea every day.", a: "-ır / -er (geniş zaman)", tr: "O her gün çay içer." },
  { s: "I [don't] like coffee.", a: "-me / -ma (olumsuz, eylem)", tr: "Kahveyi sevmem." },
  { s: "She [doesn't] eat fish.", a: "-me / -ma (olumsuz, eylem)", tr: "O balık yemez." },
  { s: "[Do] you speak English?", a: "-mı (soru, eylem)", tr: "İngilizce konuşur musun?" },
  { s: "[Does] he live here?", a: "-mı (soru, eylem)", tr: "O burada mı yaşar?" },
  { s: "I [watched] TV.", a: "-dı (geçmiş, eylem)", tr: "Televizyon izledim." },
  { s: "We [went] home.", a: "-dı (geçmiş, eylem)", tr: "Eve gittik." },
  { s: "I [didn't] sleep well.", a: "-medi (geçmiş olumsuz)", tr: "İyi uyumadım." },
  { s: "[Did] you call me?", a: "-dı mı (geçmiş sorusu)", tr: "Beni aradın mı?" },
  { s: "I [can] swim.", a: "-ebil (yapabilmek)", tr: "Yüzebilirim." },
  { s: "[Can] you help me?", a: "-ebil (yapabilmek)", tr: "Bana yardım edebilir misin?" },
  { s: "I [will] call you.", a: "-ecek (gelecek)", tr: "Seni arayacağım." },
  { s: "I am [working] now.", a: "-ıyor (şu an)", tr: "Şu an çalışıyorum." },
  { s: "I am [at] home.", a: "-de / -da (yer)", tr: "Evdeyim." },
  { s: "She lives [in] London.", a: "-de / -da (yer)", tr: "O Londra'da yaşar." },
  { s: "I go [to] school.", a: "-e / -a (yön)", tr: "Okula giderim." },
  { s: "I'm [from] Turkey.", a: "-den / -dan", tr: "Türkiye'denim." },
  { s: "[My] name is Ali.", a: "benim (-im)", tr: "Benim adım Ali." },
  { s: "What is [your] name?", a: "senin (-in)", tr: "Senin adın ne?" },
  { s: "I have two [cats].", a: "-ler / -lar (çoğul)", tr: "İki kedim var." },
  { s: "She is [a] teacher.", a: "bir", tr: "O bir öğretmen." },
  { s: "I go [with] my friend.", a: "ile (-la / -le)", tr: "Arkadaşımla giderim." },
  { s: "This is [for] you.", a: "için", tr: "Bu senin için." },
  { s: "I'm tired, [but] I'm happy.", a: "ama", tr: "Yorgunum ama mutluyum." },
  { s: "I [have] a car.", a: "var (sahiplik)", tr: "Arabam var." },
  { s: "[There is] a park here.", a: "var (bir yerde)", tr: "Burada bir park var." },
  { s: "You [should] sleep.", a: "-meli / -malı", tr: "Uyumalısın." },
];

export const EKI_BUL_SIKLARI = [...new Set(EKI_BUL.map((x) => x.a))];

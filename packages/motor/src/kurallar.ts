/** Her kalıp için öğretmen notu: başlık (t), formül (f), Türkçe ek mantığıyla kural (r). */
import type { Meta } from "./tipler";

export interface Kural {
  t: string;
  f: string;
  r: string;
}

export const RULES: Record<string, Kural> = {
  "be-pos": { t: "Şimdi durum: yorgunum, evdeyim", f: "KİM + am / is / are + durum", r: "Türkçede durumu ek söyler: yorgun-um, yorgun-sun, yorgun-dur.\nİngilizcede bu ek ayrı bir kelimedir: am / is / are. Bu kelime olmadan cümle kurulmaz (“I tired” yanlış).\nI → am · he / she / it → is · you / we / they → are" },
  "be-neg": { t: "Şimdi durum, olumsuz: yorgun değilim", f: "KİM + am / is / are + not + durum", r: "değil = not. not, am / is / are kelimesinden HEMEN SONRA gelir.\nKısası: is not → isn't, are not → aren't (I am not'ın kısası yok: I'm not).\nDurum cümlesinde don't / doesn't KULLANILMAZ." },
  "be-q": { t: "Şimdi durum, soru: yorgun musun?", f: "Am / Is / Are + KİM + durum ?", r: "İngilizcede -mı soru eki yok. Soru yapmak için am / is / are cümlenin BAŞINA geçer.\nHe is happy. → Is he happy?\nYani kelimeler aynı, sadece yer değişiyor." },
  "bePast-pos": { t: "Geçmiş durum: yorgundum, evdeydi", f: "KİM + was / were + durum", r: "-dı / -dum eki (yorgun-dum) İngilizcede was / were olur.\nI / he / she / it → was · you / we / they → were\nKısaca: am ve is → was, are → were." },
  "bePast-neg": { t: "Geçmiş durum, olumsuz: yorgun değildim", f: "KİM + was / were + not + durum", r: "değildi = was not / were not. Kısası: wasn't / weren't.\nnot, was / were kelimesinden hemen sonra gelir.\nDurum cümlesinde didn't KULLANILMAZ." },
  "bePast-q": { t: "Geçmiş durum, soru: yorgun muydun?", f: "Was / Were + KİM + durum ?", r: "-mıydı eki İngilizcede yok; was / were cümlenin BAŞINA geçer.\nHe was happy. → Was he happy?\nKelimeler aynı, sadece was başa geçti." },
  "simple-pos": { t: "Geniş zaman: çalışırım, kahve içer", f: "KİM + fiil   (he / she / it ise: fiil + s)", r: "Hep, genelde yaptığın işler. Türkçedeki -ır / -er eki İngilizcede YOK; fiil yalın kalır: I work.\nTek istisna: he / she / it ile fiile -s eklenir: he works, she drinks, he goes.\nBurada am / is / are KULLANILMAZ (“I am work” yanlış). am / is / are sadece durum için: I am tired." },
  "simple-neg": { t: "Geniş zaman, olumsuz: çalışmam", f: "KİM + don't / doesn't + fiil", r: "-me / -ma eki = don't (do not). he / she / it ile: doesn't (does not).\ndoesn't kelimesi -s'yi kendisi taşır, fiil yalın kalır: he doesn't work (works değil).\nSadece not yazmak yetmez (“I not work” yanlış)." },
  "simple-q": { t: "Geniş zaman, soru: çalışır mısın?", f: "Do / Does + KİM + fiil ?", r: "-mı soru eki = cümlenin başına Do. he / she / it ile Does.\nDoes -s'yi kendisi taşır, fiil yalın kalır: Does he work? (works değil)." },
  "past-pos": { t: "Geçmiş zaman: çalıştım, kahve içti", f: "KİM + fiilin geçmiş hali (work → worked)", r: "-dı eki fiilin kendisine işlenir: work → worked, walk → walked.\nDüzensiz fiiller ezberlenir: drink → drank, go → went, eat → ate, sleep → slept, sit → sat, run → ran.\nHer kişide aynıdır (I worked, he worked). was / were ve did KULLANILMAZ." },
  "past-neg": { t: "Geçmiş zaman, olumsuz: çalışmadım", f: "KİM + didn't + fiil (yalın)", r: "-medi / -madı = didn't (did not).\nGeçmişi didn't zaten taşıyor; o yüzden fiil yalın kalır: I didn't go (went değil), he didn't work (worked değil)." },
  "can-pos": { t: "Yapabilmek: yüzebilirim", f: "KİM + can + fiil (yalın)", r: "-ebil / -abil eki (çalış-abil-ir-im) İngilizcede can olur.\ncan herkes için aynıdır: I can, he can (cans yok). Fiil yalın kalır: he can work (works değil).\ncan'den sonra to gelmez." },
  "can-neg": { t: "Yapamamak: çalışamam", f: "KİM + can't + fiil (yalın)", r: "-eme / -ama eki (çalış-ama-m) = can't (cannot).\nHerkes için aynı: I can't, she can't. Fiil yalın kalır." },
  "can-q": { t: "Yapabilir misin?", f: "Can + KİM + fiil ?", r: "-ebilir mi? = Can cümlenin BAŞINA geçer: Can you swim?\nDo kullanılmaz (“Do you can…” yanlış)." },
  "will-pos": { t: "Gelecek: çalışacağım", f: "KİM + will + fiil (yalın)", r: "-ecek / -acak eki (çalış-acağ-ım) = will.\nHerkes için aynı: I will, he will. Fiil yalın: he will work (works değil).\nKısası: I'll, you'll, he'll." },
  "will-neg": { t: "Gelecek, olumsuz: çalışmayacağım", f: "KİM + won't + fiil (yalın)", r: "-meyecek / -mayacak = won't (will not).\nFiil yalın kalır: I won't go." },
  "will-q": { t: "Gelecek, soru: çalışacak mısın?", f: "Will + KİM + fiil ?", r: "-ecek mi? = Will cümlenin BAŞINA geçer: Will you work?" },
  "past-q": { t: "Geçmiş zaman, soru: çalıştın mı?", f: "Did + KİM + fiil (yalın) ?", r: "-dı mı = cümlenin başına Did.\nGeçmişi Did taşıyor, fiil yalın kalır: Did you go? (Did you went değil)." },
};

/** "simple-neg" gibi kural anahtarı. Zayıf nokta takibi bu anahtarla tutulur. */
export const ruleKey = (m: Pick<Meta, "form" | "pol">): string => m.form + "-" + m.pol;

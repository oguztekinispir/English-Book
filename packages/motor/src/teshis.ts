/**
 * Hata teşhisi: öğrencinin yanlış cevabını kurallarla ve Türkçe ek mantığıyla açıklar.
 * Yapay zekâ kullanmaz.
 *
 * Çıktı düz metindir. Vurgulanacak kelimeler [[böyle]] işaretlenir;
 * arayüz bunları <mark> ile gösterir (bkz. isaretParcala). Metin HTML kaçışı yapılmadan gelir;
 * arayüz kendisi kaçırmalı (React bunu zaten yapar).
 *
 * Önemli: diagnose cevabın YANLIŞ olduğunu varsayar. Önce matchAns ile kontrol et,
 * sadece ok=false ise diagnose çağır. (Doğru cevaba "sıra farklı" der.)
 */
import { lev, tokz } from "./kontrol";
import { inf } from "./turkce";
import { cap } from "./uretec";
import type { Soru } from "./tipler";

export interface Ipucu {
  /** hata = yanlış yapılan şey · ipucu = ek bilgi (💡) */
  tur: "hata" | "ipucu";
  metin: string;
}

const mk = (w: string): string => `[[${w}]]`;

/** "[[am]] eksik" → [{t:"am",vurgu:true},{t:" eksik"}] */
export function isaretParcala(metin: string): { t: string; vurgu?: true }[] {
  const out: { t: string; vurgu?: true }[] = [];
  const re = /\[\[(.+?)\]\]/g;
  let i = 0,
    m: RegExpExecArray | null;
  while ((m = re.exec(metin))) {
    if (m.index > i) out.push({ t: metin.slice(i, m.index) });
    out.push({ t: m[1], vurgu: true });
    i = m.index + m[0].length;
  }
  if (i < metin.length) out.push({ t: metin.slice(i) });
  return out;
}

/** Teşhis kelime sırasıyla ilgili bir hata içeriyor mu? (Arayüz kelime sırası şemasını gösterir.) */
export const siraHatasi = (d: Ipucu[]): boolean => d.some((x) => /sıra/i.test(x.metin));

export function diagnose(it: Soru, user: string): Ipucu[] {
  const m = it.meta,
    u = tokz(user),
    e = tokz(it.en),
    out: Ipucu[] = [],
    seen = new Set<string>(),
    add = (h: string, used: string[] = []) => {
      out.push({ tur: "hata", metin: h });
      used.forEach((w) => seen.add(w));
    };
  if (!m || !u.length) return out;
  const has = (w: string) => u.includes(w),
    SUBJ = ["i", "you", "he", "she", "we", "they", "it"],
    subjE = m.s.en.toLowerCase();
  const uSubj = u.find((w) => SUBJ.includes(w)),
    BE = ["am", "is", "are", "was", "were"],
    uBe = u.filter((w) => BE.includes(w));
  const subjTr = (x: string) =>
    ({ i: "Ben", you: "Sen / Siz", he: "O (erkek)", she: "O (kadın)", we: "Biz", they: "Onlar", it: "O (eşya, hayvan)" } as Record<string, string>)[x];

  // 1) özne
  if (m.s.nz) {
    const sw = tokz(m.s.en);
    if (!sw.every(has)) add(`Özne: “${m.s.tr}” = ${mk(m.s.en)}.${m.s.tr === "Arkadaşım" ? " (-ım eki burada “benim” demek → my)" : ""}`);
    sw.forEach((w) => seen.add(w));
  } else if (!uSubj) add(`Özne (KİM?) eksik. “${m.s.tr}” = ${mk(m.s.en)}. Türkçede özneyi atabiliriz (“yorgunum”), İngilizcede özne her zaman yazılır.`);
  else if (uSubj !== subjE) {
    if (["he", "she"].includes(uSubj) && ["he", "she"].includes(subjE))
      add(`“O (erkek)” = ${mk("he")}, “O (kadın)” = ${mk("she")}. Türkçede ikisi de “o”, İngilizcede ayrı.`, [uSubj]);
    else add(`Özne farklı: ${mk(uSubj)} = ${subjTr(uSubj)}. Burada “${m.s.tr}” var, yani ${mk(m.s.en)}.`, [uSubj]);
  }

  // 2) soru sırası
  if (m.pol === "q") {
    const aux = e[0];
    if (u[0] !== aux) {
      if ([...SUBJ, "my", "the"].includes(u[0]) && has(aux))
        add(`Soru sırası: ${mk(aux)} kelimesini cümlenin BAŞINA almalısın. Senin yazdığın “${user.trim()}” düz cümle gibi okunur. Türkçede soruyu -mı eki yapar; İngilizcede kelimenin yeri değişir.`, [aux]);
      else if (!has(aux) && !(m.form.startsWith("be") && uBe.length))
        add(`Soru kelimesi eksik: soru cümlesi ${mk(cap(aux))} ile başlar. Türkçedeki “-mı” eki İngilizcede ${mk(cap(aux))} olur.`);
      else if ([...SUBJ, "my", "the"].includes(u[0])) add(`Soru sırası: soru cümlesinde özne (${u[0]}) başa gelmez; ${mk(cap(aux))} başa gelir.`);
    }
  }

  if (m.form === "be" || m.form === "bePast") {
    const past = m.form === "bePast";
    if (has("do") || has("does") || has("did"))
      add(`Durum cümlesinde (yorgun, mutlu, evde) ${mk("do / does / did")} kullanılmaz. Bunlar fiiller (çalışmak, içmek) içindir. Durum için ${mk(past ? "was / were" : "am / is / are")} kullan.`, ["do", "does", "did"]);
    if (!uBe.length)
      add(`${mk(m.be!)} eksik. Türkçede “${m.compTr}” kelimesine gelen ek (${past ? "-dı / -dum" : "-ım / -sın / -dır"}) İngilizcede ayrı bir kelimedir: ${mk(m.be!)}. Bu kelime olmadan İngilizce durum cümlesi olmaz.`);
    else if (uBe[0] !== m.be) {
      const w = uBe[0],
        wPast = w === "was" || w === "were";
      if (wPast !== past)
        add(past ? `Zaman yanlış: ${mk(w)} şimdiki zaman. Türkçede “-dı / -dum / -mıydı” var, yani geçmiş: ${mk(m.be!)}.` : `Zaman yanlış: ${mk(w)} geçmiş zaman. Türkçede -dı eki yok, yani şimdi: ${mk(m.be!)}.`, [w]);
      else
        add(`Kişiye uymuyor: ${m.s.en} ile ${mk(m.be!)} kullanılır, ${w} değil. ${past ? "I / he / she → was · you / we / they → were" : "I → am · he / she → is · you / we / they → are"}.`, [w]);
    }
    if (m.pol === "neg") {
      if (!has("not")) add(`“değil” = ${mk("not")}. ${m.be} kelimesinden hemen sonra gelir: ${mk(m.be + " not")}.`);
      else {
        const bi = u.findIndex((w) => BE.includes(w)),
          ni = u.indexOf("not");
        if (bi >= 0 && ni < bi) add(`not'ın yeri: önce ${m.be}, sonra not → ${mk(m.be + " not")}.`, ["not"]);
      }
    }
    if (m.pol !== "neg" && has("not")) add(`Türkçe cümlede “değil” yok, ${mk("not")} fazla.`, ["not"]);
  } else if (m.form === "can" || m.form === "will") {
    const md = m.form,
      v = m.v!,
      ng = md === "can" ? "can't" : "won't",
      uv = u.find((w) => [v.en, v.en3, v.past].includes(w) || lev(w, v.en) <= 1),
      DO = ["do", "does", "did"];
    if (uBe.length) add(`${mk(uBe[0])} burada olmaz. ${md === "can" ? "Yapabilmek" : "Gelecek"} cümlesinde sadece ${mk(md)} + fiil.`, uBe);
    const ud = u.filter((w) => DO.includes(w));
    if (ud.length)
      add(`${md} ile ${mk(ud[0])} kullanılmaz. ${m.pol === "q" ? `Soru için ${mk(cap(md))} başa gelir.` : m.pol === "neg" ? `Olumsuz için ${mk(ng)}.` : `Sadece ${md} + fiil.`}`, ud);
    if (!has(md))
      add(md === "can" ? `“-ebil / -abil” eki (yapabilmek) = ${mk("can")}${m.pol === "neg" ? `; olumsuzu (-eme / -ama) = ${mk("can't")}` : ""}.` : `“-ecek / -acak” eki (gelecek) = ${mk("will")}${m.pol === "neg" ? `; olumsuzu (-meyecek) = ${mk("won't")}` : ""}.`);
    else if (m.pol === "neg" && !has("not")) add(`Türkçede olumsuz ek var (${md === "can" ? "-eme / -ama" : "-meyecek / -mayacak"}): ${mk(ng)} olmalı.`, [md]);
    else if (m.pol !== "neg" && has("not")) add(`Türkçede olumsuz ek yok; ${mk(md)} olmalı, ${ng} değil.`, ["not"]);
    if (uv && uv !== v.en) add(`${md} kelimesinden sonra fiil hep yalın kalır: ${mk(v.en)} (${uv} değil).`, [uv]);
    if (!uv) add(`Fiil eksik ya da farklı: “${inf(v.stem)}” = ${mk(v.en)}.`);
    if (has("to") && !e.includes("to")) add(`${md}'den sonra to gelmez: ${mk(md + " " + v.en)}.`, ["to"]);
  } else {
    const v = m.v!,
      past = m.form === "past",
      third = m.third;
    const reg = v.en.replace(/e$/, "") + "ed",
      forms = { base: v.en, s: v.en3, past: v.past, reg };
    const uv = u.find((w) => Object.values(forms).includes(w) || w === v.en + "s" || w === v.en + "ed" || lev(w, v.en) <= 1);
    const DO = ["do", "does", "did"],
      uDo = u.filter((w) => DO.includes(w));
    if (uBe.length)
      add(`Burada ${mk(uBe[0])} olmaz. “${inf(v.stem)}” bir fiil (iş, hareket). ${uBe[0]} sadece durum cümlelerinde kullanılır (I am tired). ${m.pol === "pos" ? (past ? `Geçmişte fiilin kendisi değişir: ${mk(e.join(" "))}.` : `Fiil cümlesinde kişi + fiil yeter: ${mk(cap(e.join(" ")))}.`) : `Olumsuz ve soruda yardımcı kelime ${mk(past ? "did" : third ? "does" : "do")} olur.`}`, uBe);
    if (!uv) add(`Fiil eksik ya da farklı: “${inf(v.stem)}” = ${mk(v.en)}.`);
    if (!past && m.pol === "pos" && uv) {
      if (third && uv === v.en) add(`${m.s.nz ? m.s.en + " tek kişi (he / she gibi), bu" : "he / she"} ile fiile -s gelir: ${mk(v.en3)}. (I work, ama he ${v.en3}.)`, [uv]);
      else if (!third && uv === v.en3) add(`-s sadece he / she / it ile gelir. ${m.s.en} ile fiil yalın: ${mk(v.en)}.`, [uv]);
      else if (uv === v.past || uv === reg) add(`Zaman yanlış: ${mk(uv)} geçmiş. Türkçede “-ır / -er” var (${v.aor}), yani geniş zaman: ${mk(third ? v.en3 : v.en)}.`, [uv]);
      if (uDo.length)
        add(`Olumlu cümlede ${mk(uDo[0])} kullanılmaz; sadece KİM + fiil. do sadece iki yerde çıkar: olumsuzda (“-me / -ma” eki → don't) ve soruda (“-mı” eki → Do başa). Türkçede bu ekler yoksa do da yok.`, uDo);
    }
    if (!past && m.pol !== "pos") {
      const need = third ? "does" : "do";
      if (!uDo.length && m.pol === "neg") add(`“-me / -ma” eki = ${mk(third ? "doesn't" : "don't")}. Sadece not yazmak yetmez; ${mk((third ? "doesn't " : "don't ") + v.en)}.`);
      else if (uDo[0] !== need)
        add(uDo[0] === "did" ? `${mk("did")} geçmiş zaman için. Türkçede -dı yok (geniş zaman), yani ${mk(need)}.` : `${m.s.en} ile ${mk(need)} kullanılır: ${third ? "he / she / it → does" : "I / you / we / they → do"}.`, uDo);
      if (m.pol === "neg" && uDo.length && !has("not")) add(`not eksik: ${mk(third ? "doesn't" : "don't")} = ${third ? "does" : "do"} + not.`);
      if (uv && uv !== v.en) add(`${third ? "does / doesn't" : "do / don't"} kullanınca fiil hep yalın kalır: ${mk(v.en)} (${uv} değil).${third ? " -s'yi does zaten taşıyor." : ""}`, [uv]);
    }
    if (past && m.pol === "pos" && uv) {
      if (uv === reg && v.irr) add(`${v.en} düzensiz bir fiil: geçmişi ${mk(v.past)} (${reg} değil). Düzensizler -ed almaz, ezberlenir.`, [uv]);
      else if (uv !== v.past) add(`Zaman yanlış: Türkçedeki -dı / -tı eki geçmiş demek. ${v.en} → ${mk(v.past)}${v.irr ? " (düzensiz)" : ""}.`, [uv]);
      if (uDo.length) add(`Olumlu geçmiş cümlede ${mk("did")} kullanılmaz; fiilin kendisi değişir: ${mk(v.past)}.`, uDo);
    }
    if (past && m.pol !== "pos") {
      if (!has("did") && m.pol === "neg") add(`“-medi / -madı” = ${mk("didn't")}. ${has("not") ? "Sadece not yetmez; did + not = didn't." : ""} → ${mk("didn't " + v.en)}.`, uDo);
      else if (m.pol === "neg" && !has("not")) add(`not eksik: ${mk("didn't")} = did + not.`);
      if (uDo.some((w) => w !== "did")) add(`${mk(uDo.find((w) => w !== "did")!)} geniş zaman içindir. Türkçede -dı var, yani geçmiş: ${mk("did")}.`, uDo);
      if (uv && uv !== v.en) add(`did / didn't kullanınca fiil yalın kalır: ${mk(v.en)} (${uv} değil). Geçmişi did zaten taşıyor; iki kere geçmiş yapılmaz.`, [uv]);
    }
  }

  // tümleç (happy, coffee, at home...)
  const comp = [m.comp, ...(m.alt || [])].map(tokz).reduce((b, c) => (c.filter((w) => !has(w)).length < b.filter((w) => !has(w)).length ? c : b)),
    miss = comp.filter((w) => !has(w));
  if (miss.length) {
    const near = miss.map((w) => [w, u.find((x) => !seen.has(x) && !e.includes(x) && lev(x, w) <= Math.max(1, Math.floor(w.length / 3)))] as const);
    near.forEach(([w, x]) => {
      if (x) add(`Yazım: ${x} → ${mk(w)}.`, [x]);
    });
    const real = near.filter(([, x]) => !x).map(([w]) => w);
    if (real.length) {
      add(`“${m.compTr}” = ${mk(m.comp)}. ${real.length < comp.length ? "Eksik kelime: " + real.join(" ") : "Bu kısım eksik ya da farklı."}`);
      const PREP: Record<string, string> = {
        to:
          m.v && m.v.en === "listen"
            ? `${mk("listen")} kelimesi hep ${mk("to")} ile kullanılır: listen to + şey (listen to music). Türkçede “müzik dinlerim” derken ek yok, o yüzden to'yu göremezsin. Kalıbı tek parça ezberle: ${mk("listen to")}.`
            : `Türkçedeki -e / -a eki (işe, okula → nereye?) İngilizcede ${mk("to")} olur. Ek kelimenin sonunda saklı, İngilizcede başa ayrı kelime olarak gelir.`,
        at: `Türkçedeki -de / -da eki (evde, işte → nerede?) İngilizcede ${mk("at")} olur: at home, at work.`,
        in: `-de / -da eki (parkta, denizde, ofiste) bir yerin içini anlatırken ${mk("in")} olur: in the park.`,
        on: `Günlerle ${mk("on")} kullanılır: on Monday (pazartesi). Türkçede ek yok.`,
        the: `Belli bir yer için ${mk("the")} gelir: the park, the office, the sea, the newspaper. Türkçede karşılığı yok; kalıpla birlikte ezberle.`,
        a:
          m.comp === "a lot" || m.comp.startsWith("a lot")
            ? `${mk("a lot")} = çok. Buradaki “a” kalıbın parçası, tek başına anlamı yok.`
            : `Meslek ya da tek bir şey söylerken başına ${mk("a")} gelir: I am ${mk("a")} student, she is ${mk("a")} teacher. Türkçede karşılığı yok; “bir öğrenciyim” gibi düşün.`,
        an: `Sesli harfle (a, e, i, o, u sesiyle) başlayan kelimeden önce ${mk("a")} değil ${mk("an")} gelir: ${mk("an")} engineer, ${mk("an")} actor. Söylemesi kolay olsun diye.`,
        from: `Türkçedeki -den / -dan eki (Türkiye'den, Almanya'dan → nereden?) İngilizcede ${mk("from")} olur ve yerin ÖNÜNE gelir: ${mk("from")} Turkey.`,
      };
      real.filter((w) => PREP[w]).forEach((w) => out.push({ tur: "ipucu", metin: PREP[w] }));
    }
  }

  // fazla kelime
  const extra = u.filter(
    (w) =>
      !e.includes(w) &&
      !seen.has(w) &&
      !SUBJ.includes(w) &&
      !["my", "the"].includes(w) &&
      !BE.includes(w) &&
      !["do", "does", "did", "not"].includes(w) &&
      !(m.v && lev(w, m.v.en) <= 1) &&
      !comp.some((c) => lev(c, w) <= 2),
  );
  if (extra.length) add(`Fazla ya da yanlış kelime: ${extra.join(", ")}.`);
  if (m.v && m.pol !== "q") {
    const vi = u.findIndex((w) => [m.v!.en, m.v!.en3, m.v!.past].includes(w)),
      ci = u.indexOf(tokz(m.comp)[0]);
    if (vi >= 0 && ci >= 0 && vi > ci && out.length)
      add(`Kelime sırası: fiil (${mk(u[vi])}) “${m.comp}” kısmından ÖNCE gelir. Türkçede fiil sonda, İngilizcede KİM'den hemen sonra.`);
  }
  if (!out.length)
    add(`Kelimeler doğru ama sıra farklı. İngilizcede sıra sabittir: ${m.pol === "q" ? "Yardımcı kelime + KİM + ..." : "KİM + fiil / am-is-are + ..."} → ${mk(it.en)}`);
  return out;
}


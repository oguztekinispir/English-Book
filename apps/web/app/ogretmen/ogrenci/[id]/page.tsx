import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CAMP_L, RULES } from "@ti/motor";
import { Ust } from "@/components/Ust";
import { NotFormu, NotSil } from "@/components/OgretmenNotlari";
import { oturum } from "@/lib/supabase/sunucu";
import { once, yuzde } from "@/lib/zaman";
import { dersler, gunAnahtari, gunluk, kaynaklar, KAYNAK_AD, kartOzeti, seri, tahminiDakika, yas, zorKelimeler } from "@/lib/analiz";
import { cevaplariGetir } from "@/lib/ogrenci-veri";
import "../../../hesap.css";
import "../../ogretmen.css";

export const metadata: Metadata = { title: "Öğrenci" };

const GUNLER = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const tarih = (s: string) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default async function OgrenciDetayi({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ sadece?: string }> }) {
  const { id } = await params;
  const { sadece } = await searchParams;
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris");
  if (profil?.rol !== "ogretmen" && profil?.rol !== "yonetici") redirect("/ogrenci");

  // RLS: sadece bağlı öğrencinin profili döner
  const { data: ogr } = await sb.from("profiller").select("id, ad, dogum_tarihi, dogum_yili, veli_eposta, veli_onayi_at, olusturma").eq("id", id).maybeSingle();
  if (!ogr) notFound();

  const [{ satirlar, dersVar }, zayif, durum, bag, kart, notlar] = await Promise.all([
    cevaplariGetir(sb, [id], 30),
    sb.from("zayif_kurallar").select("kural, hata, toplam").eq("ogrenci_id", id).order("hata", { ascending: false }),
    sb.from("ogrenci_durumu").select("yol_en_ust").eq("ogrenci_id", id).maybeSingle(),
    sb.from("baglantilar").select("olusturma").eq("ogretmen_id", user.id).eq("ogrenci_id", id).maybeSingle(),
    sb.from("tekrar_kartlari").select("kutu, sonraki").eq("ogrenci_id", id),
    sb.from("ogretmen_notlari").select("id, metin, olusturma").eq("ogrenci_id", id).order("olusturma", { ascending: false }).limit(20),
  ]);

  const c = satirlar;
  const hafta = c.filter((x) => Date.now() - new Date(x.zaman).getTime() < 7 * 86400_000);
  const gun14 = gunluk(c, 14);
  const enCokGun = Math.max(1, ...gun14.map((g) => g.toplam));
  const aktifGun30 = new Set(c.map((x) => gunAnahtari(x.zaman))).size;
  const kaynak = kaynaklar(c);
  const dersDurum = dersler(c);
  const baslanan = dersDurum.filter((d) => d.cevap > 0);
  const zor = zorKelimeler(c);
  const kartlar = kartOzeti((kart.data ?? []) as { kutu: number; sonraki: string }[]);
  const kurallar = (zayif.data || []) as { kural: string; hata: number; toplam: number }[];
  const yol = (durum.data?.yol_en_ust as number | undefined) ?? 0;
  const enCok = Math.max(1, ...kurallar.map((k) => k.hata));
  const ogrYas = yas(ogr.dogum_tarihi as string | null) ?? (ogr.dogum_yili ? new Date().getFullYear() - (ogr.dogum_yili as number) : null);
  const kucuk = ogrYas !== null && ogrYas < 18;
  const son = c[0]?.zaman ?? null;
  const notListe = (notlar.data ?? []) as { id: number; metin: string; olusturma: string }[];
  const liste = (sadece === "yanlis" ? c.filter((x) => !x.dogru) : c).slice(0, 20);

  // Öğretmene öneri: en çok vakit isteyen tek şey
  const oneri = (() => {
    const k = kurallar[0];
    if (!c.length) return "Son 30 günde hiç çalışmamış. Kısa bir hatırlatma ya da birlikte bir ders iyi gelebilir.";
    if (hafta.length === 0) return `Bu hafta çalışmadı (son çalışma ${once(son)}). Seriyi yeniden başlatmak için küçük bir hedef verin: günde 10 kart.`;
    if (k && k.hata >= 3 && k.hata / k.toplam > 0.3) return `Derste ${RULES[k.kural]?.t ?? k.kural} üzerinde durun: son 30 günde ${k.toplam} denemede ${k.hata} hata. Formül: ${RULES[k.kural]?.f ?? ""}`;
    if (zor.length >= 3) return `Şu kelimeleri birlikte tekrar edin: ${zor.slice(0, 4).map((z) => z.en).join(", ")}.`;
    if (kartlar.bugun > 25) return `${kartlar.bugun} tekrar kartı birikmiş. Kartlar birikince unutma hızlanır; birkaç gün kısa tekrar yeter.`;
    return "İyi gidiyor. Sıradaki derse geçmeye hazır görünüyor.";
  })();

  return (
    <div className="sayfa">
      <Ust aktif="panel" />
      <main className="panel">
        <p>
          <Link href="/ogretmen" className="geri">
            Öğrencilerin
          </Link>
        </p>

        <header className="ogr-kapak">
          <div>
            <h1>{(ogr.ad as string) || "İsimsiz öğrenci"}</h1>
            <p className="ogr-kunye">
              {ogrYas !== null && <span>{ogrYas} yaş</span>}
              {bag.data?.olusturma && <span>{tarih(bag.data.olusturma as string)} tarihinden beri öğrencin</span>}
              <span>Son çalışma: {once(son)}</span>
              {kucuk && <span className={ogr.veli_onayi_at ? "etiket-iyi" : "etiket-uyari"}>{ogr.veli_onayi_at ? "Veli onayı var" : "Veli onayı bekleniyor"}</span>}
            </p>
          </div>
        </header>

        <p className="oneri-kutusu">
          <b>Öneri:</b> {oneri}
        </p>

        <div className="ozet-seridi">
          <div>
            <b>{seri(c)}</b>
            <span>gün seri</span>
          </div>
          <div>
            <b>{aktifGun30}</b>
            <span>/ 30 gün çalıştı</span>
          </div>
          <div>
            <b>{tahminiDakika(hafta)}</b>
            <span>dk bu hafta (yaklaşık)</span>
          </div>
          <div>
            <b>{hafta.length}</b>
            <span>cevap bu hafta, %{yuzde(hafta.filter((x) => x.dogru).length, hafta.length)} doğru</span>
          </div>
          <div>
            <b>{baslanan.length}</b>
            <span>derse başladı</span>
          </div>
          <div>
            <b>{kartlar.ogrenildi}</b>
            <span>/ {kartlar.toplam} kelime öğrenildi</span>
          </div>
        </div>

        <section className="panel-kutu yaprak" aria-labelledby="g-b">
          <h2 id="g-b">Son 14 gün</h2>
          <ol className="gun-cubuk" aria-label="Gün gün cevap sayısı">
            {gun14.map((g) => {
              const d = new Date(g.gun + "T12:00:00Z");
              return (
                <li key={g.gun} title={`${g.gun}: ${g.toplam} cevap, ${g.dogru} doğru`}>
                  <span className="gc-sayi">{g.toplam || ""}</span>
                  <span className="gc-kutu">
                    <i style={{ height: `${(g.toplam / enCokGun) * 100}%` }} className={g.toplam ? "" : "bos"} />
                  </span>
                  <span className="gc-gun">{GUNLER[d.getUTCDay()]}</span>
                </li>
              );
            })}
          </ol>
          {kaynak.length > 0 && (
            <ul className="kaynak-liste" aria-label="Neyle çalıştı (30 gün)">
              {kaynak.map((k) => (
                <li key={k.kaynak}>
                  <b>{k.ad}</b> {k.toplam} <small>%{yuzde(k.dogru, k.toplam)} doğru</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="panel-izgara">
          <section className="panel-kutu genis yaprak" aria-labelledby="d-b">
            <h2 id="d-b">Dersler</h2>
            {!dersVar && <p className="form-hata">Ders ders takip için Supabase'de 0004 göçünü çalıştırın.</p>}
            <div className="tablo-kap">
              <table className="ders-tablo">
                <thead>
                  <tr>
                    <th scope="col">Ders</th>
                    <th scope="col">Çözdüğü</th>
                    <th scope="col">Doğru</th>
                    <th scope="col">Test</th>
                    <th scope="col">Son</th>
                  </tr>
                </thead>
                <tbody>
                  {dersDurum.map((d) => (
                    <tr key={d.kod} className={d.cevap ? "" : "soluk"}>
                      <th scope="row">
                        <span className="dt-no">{d.etiket}</span> {d.baslik}
                      </th>
                      <td>{d.cevap || "Başlamadı"}</td>
                      <td>{d.cevap ? `%${yuzde(d.dogru, d.cevap)}` : ""}</td>
                      <td>
                        {d.testToplam ? (
                          <span className={d.testDogru / d.testToplam >= 0.8 ? "iyi" : "orta"}>
                            {d.testDogru} / {d.testToplam}
                          </span>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>{d.son ? once(d.son) : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel-kutu yaprak" aria-labelledby="t-b">
            <h2 id="t-b">Tekrar kartları</h2>
            {kartlar.toplam ? (
              <>
                <div className="sayilar">
                  <p>
                    <b>{kartlar.bugun}</b>
                    <span>bugün bekleyen</span>
                  </p>
                  <p>
                    <b>{kartlar.toplam}</b>
                    <span>toplam kart</span>
                  </p>
                </div>
                <ol className="kutu-cubuk" aria-label="Kutulara göre kartlar">
                  {kartlar.kutular.map((n, i) => (
                    <li key={i} style={{ flexGrow: Math.max(n, 0.0001) }} className={`k${i}`} title={`Kutu ${i}: ${n} kart`}>
                      {n > 0 && n}
                    </li>
                  ))}
                </ol>
                <p className="not">Soldan sağa: yeni ya da bilemediği kartlar → 14 günde bir gelen, iyi bildiği kartlar.</p>
              </>
            ) : (
              <p className="not">Henüz tekrar kartı yok (ya da kartlar sadece kendi cihazında).</p>
            )}
          </section>

          <section className="panel-kutu yaprak" aria-labelledby="z-b">
            <h2 id="z-b">Zorlandığı kelimeler</h2>
            {zor.length ? (
              <ul className="zor-liste">
                {zor.map((z) => (
                  <li key={z.en}>
                    <b lang="en">{z.en}</b> <span>{z.tr}</span> <small className="hata-sayi">{z.hata}×</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="not">Kartlarda ve oyunlarda belirgin bir zorluk yok.</p>
            )}
          </section>

          <section className="panel-kutu genis yaprak" aria-labelledby="k-b">
            <h2 id="k-b">Cümle kurarken: kural kural son 30 gün</h2>
            <p className="not">
              Cümle yolu: seviye {yol + 1} / {CAMP_L.length}, {CAMP_L[Math.min(yol, CAMP_L.length - 1)].t}
            </p>
            {kurallar.length ? (
              <ul className="kural-cubuk">
                {kurallar.map((k) => (
                  <li key={k.kural}>
                    <span className="kc-ad">{RULES[k.kural]?.t ?? k.kural}</span>
                    <span className="kc-cubuk" aria-hidden="true">
                      <i style={{ width: `${(k.hata / enCok) * 100}%` }} />
                    </span>
                    <span className="kc-sayi">
                      {k.hata} hata / {k.toplam}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="not">Son 30 günde cümle motorunda çalışmamış.</p>
            )}
          </section>

          <section className="panel-kutu yaprak" aria-labelledby="n-b">
            <h2 id="n-b">Notların</h2>
            <p className="not">Sadece sen görürsün. Ders sonrası ne çalıştığınızı, neye dikkat edeceğini yaz.</p>
            <NotFormu ogrenciId={id} />
            {notListe.length > 0 && (
              <ul className="not-liste">
                {notListe.map((n) => (
                  <li key={n.id}>
                    <p>{n.metin}</p>
                    <small>
                      {tarih(n.olusturma)} <NotSil id={n.id} />
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="panel-kutu yaprak son-cevaplar" aria-labelledby="c-b">
          <div className="sc-baslik">
            <h2 id="c-b">Son cevapları</h2>
            <nav aria-label="Cevap süzgeci">
              <Link href={`/ogretmen/ogrenci/${id}`} aria-current={sadece !== "yanlis" ? "page" : undefined}>
                Hepsi
              </Link>
              <Link href={`/ogretmen/ogrenci/${id}?sadece=yanlis`} aria-current={sadece === "yanlis" ? "page" : undefined}>
                Sadece yanlışlar
              </Link>
            </nav>
          </div>
          {liste.length ? (
            <ul>
              {liste.map((x) => (
                <li key={x.id} className={x.dogru ? "dogru" : "yanlis"}>
                  <span className="sc-isaret" aria-label={x.dogru ? "doğru" : "yanlış"}>
                    {x.dogru ? "✓" : "✗"}
                  </span>
                  <span className="sc-metin">
                    <span className="sc-soru">{x.soru}</span>
                    {!x.dogru && (
                      <span className="sc-cevap">
                        {x.cevap ? <s>{x.cevap}</s> : <span className="not">{x.kaynak === "tekrar" ? "bilemedi" : "boş bıraktı"}</span>} <b>{x.beklenen}</b>
                      </span>
                    )}
                  </span>
                  <span className="sc-yan">
                    {KAYNAK_AD[x.kaynak] ?? x.kaynak}
                    {x.ders && <small>Ders {x.ders.replace(/^a1-0?(\d+)-(\d+)$/, "$1.$2")}</small>}
                    <small>{once(x.zaman)}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="not">Henüz cevap yok.</p>
          )}
        </section>
      </main>
    </div>
  );
}

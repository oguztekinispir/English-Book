import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Ust } from "@/components/Ust";
import { BaglanFormu, KodKarti } from "@/components/PanelParcalari";
import { EpostaFormu, HesabiSil, OgretmendenAyril, ProfilFormu, SifreFormu, Tercihler, VerilerimiIndir } from "@/components/Hesap";
import { oturum } from "@/lib/supabase/sunucu";
import { yas } from "@/lib/analiz";
import "../hesap.css";
import "./hesabim.css";

export const metadata: Metadata = { title: "Hesabım" };

const tarih = (s?: string | null) => (s ? new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "");
const ROL_AD: Record<string, string> = { ogrenci: "Öğrenci", ogretmen: "Öğretmen", yonetici: "Yönetici" };

export default async function Hesabim() {
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris?sonra=/hesap");
  if (!profil) redirect("/panel");
  const p = profil as typeof profil & { ayarlar?: Record<string, unknown>; olusturma?: string; kvkk_onayi_at?: string | null };
  const ogrenci = p.rol === "ogrenci";
  const ogrYas = yas(p.dogum_tarihi) ?? (p.dogum_yili ? new Date().getFullYear() - p.dogum_yili : null);
  const kucuk = ogrenci && ogrYas !== null && ogrYas < 18;

  const bag = ogrenci
    ? await sb.from("baglantilar").select("ogretmen_id, olusturma").eq("ogrenci_id", user.id).eq("durum", "aktif")
    : await sb.from("baglantilar").select("ogrenci_id, olusturma").eq("ogretmen_id", user.id).eq("durum", "aktif");
  const bagIds = (bag.data ?? []).map((b) => (ogrenci ? (b as { ogretmen_id: string }).ogretmen_id : (b as { ogrenci_id: string }).ogrenci_id));
  const kisiler = bagIds.length ? ((await sb.from("profiller").select("id, ad, ayarlar").in("id", bagIds)).data ?? []) : [];

  return (
    <div className="sayfa">
      <Ust aktif="hesap" />
      <main className="panel hesabim">
        <div className="panel-baslik">
          <div>
            <h1>Hesabım</h1>
            <p className="not">
              {ROL_AD[p.rol]} hesabı, {tarih(p.olusturma)} tarihinden beri üye
            </p>
          </div>
          <form action="/cikis" method="post">
            <button className="dugme">Çıkış yap</button>
          </form>
        </div>

        <nav className="hesap-menu" aria-label="Hesap bölümleri">
          <a href="#profil">Profil</a>
          <a href="#giris">E-posta ve şifre</a>
          <a href="#baglanti">{ogrenci ? "Öğretmenlerim" : "Öğrenci bağlama"}</a>
          <a href="#uyelik">Üyelik</a>
          <a href="#tercih">Tercihler</a>
          <a href="#veri">Verilerim</a>
        </nav>

        <div className="hesap-izgara">
          <section id="profil" className="panel-kutu yaprak" aria-labelledby="h-profil">
            <h2 id="h-profil">Profil</h2>
            <ProfilFormu id={user.id} ad={p.ad} ayarlar={p.ayarlar ?? {}} rol={p.rol} veliEposta={p.veli_eposta} kucuk={kucuk} />
            {ogrenci && (
              <dl className="bilgi-listesi">
                <div>
                  <dt>Doğum tarihi</dt>
                  <dd>{p.dogum_tarihi ? `${tarih(p.dogum_tarihi)} (${ogrYas} yaş)` : "Girilmemiş"}</dd>
                </div>
                {kucuk && (
                  <div>
                    <dt>Veli onayı</dt>
                    <dd>{p.veli_onayi_at ? `Var (${tarih(p.veli_onayi_at)})` : "Bekleniyor"}</dd>
                  </div>
                )}
              </dl>
            )}
            {ogrenci && <p className="not">Doğum tarihin yanlışsa öğretmeninden ya da bizden düzeltmemizi iste; veli onayı buna bağlı.</p>}
          </section>

          <section id="giris" className="panel-kutu yaprak" aria-labelledby="h-giris">
            <h2 id="h-giris">E-posta ve şifre</h2>
            <EpostaFormu eposta={user.email ?? ""} />
            <hr />
            <SifreFormu />
          </section>

          <section id="baglanti" className="panel-kutu yaprak" aria-labelledby={ogrenci ? "h-bag" : "kod-baslik"}>
            {ogrenci ? (
              <>
                <h2 id="h-bag">Öğretmenlerim</h2>
                {kisiler.length ? (
                  <ul className="kisi-listesi">
                    {kisiler.map((k) => {
                      const b = (bag.data ?? []).find((x) => (x as { ogretmen_id: string }).ogretmen_id === k.id);
                      const okul = (k.ayarlar as Record<string, unknown> | null)?.okul as string | undefined;
                      return (
                        <li key={k.id as string}>
                          <span>
                            <b>{(k.ad as string) || "Öğretmen"}</b>
                            <small>
                              {okul ? `${okul}, ` : ""}
                              {tarih(b?.olusturma as string)} tarihinden beri
                            </small>
                          </span>
                          <OgretmendenAyril ogretmenId={k.id as string} ad={(k.ad as string) || "Öğretmenin"} />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="not">Bağlı öğretmenin yok. Öğretmeninden 6 haneli kodu iste.</p>
                )}
                <p className="not">Bağlı öğretmenin çalışmalarını, doğru-yanlışlarını ve tekrar kartlarını görür. Şifreni göremez.</p>
                <BaglanFormu />
              </>
            ) : (
              <>
                <KodKarti kod={p.davet_kodu || "------"} />
                <p>
                  <b>{kisiler.length}</b> bağlı öğrencin var. <Link href="/ogretmen">Öğrencilerine git</Link>
                </p>
              </>
            )}
          </section>

          <section id="uyelik" className="panel-kutu yaprak" aria-labelledby="h-uye">
            <h2 id="h-uye">Üyelik</h2>
            <p className="uyelik-rozet">{ogrenci ? "Ücretsiz erken erişim" : "Öğretmen hesabı: ücretsiz"}</p>
            <p className="not">
              {ogrenci
                ? "Platform şu an geliştirme döneminde ve bütün özellikler ücretsiz. Ücretli üyelik başlamadan önce sana haber vereceğiz; hiçbir ödeme kendiliğinden alınmaz."
                : "Öğretmenler platformu ücretsiz kullanır. Öğrencilerinin ilerlemesini görmek için ücret yok."}
            </p>
          </section>

          <section id="tercih" className="panel-kutu yaprak" aria-labelledby="h-ter">
            <h2 id="h-ter">Tercihler</h2>
            <Tercihler />
          </section>

          <section id="veri" className="panel-kutu yaprak" aria-labelledby="h-veri">
            <h2 id="h-veri">Verilerim</h2>
            <p className="not">
              Kişisel verilerin Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenir. Hangi verinin tutulduğunu görmek için hepsini indirebilir, istersen hesabını
              kalıcı olarak silebilirsin. <Link href="/kvkk">Aydınlatma metni</Link>
            </p>
            {p.kvkk_onayi_at && <p className="not">Aydınlatma metnini {tarih(p.kvkk_onayi_at)} tarihinde onayladın.</p>}
            <div className="dugmeler">
              <VerilerimiIndir rol={p.rol} />
            </div>
            <hr />
            <HesabiSil rol={p.rol} />
          </section>
        </div>
      </main>
    </div>
  );
}

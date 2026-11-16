"use client";
/** Öğretmen: yeni ödev. 1) Ne? 2) Kime? 3) Son gün 4) Not */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UNITELER } from "@ti/icerik";
import { RULES } from "@ti/motor";
import { supabaseTarayici } from "@/lib/supabase/istemci";
import { hataTr } from "@/lib/hata";
import { MOTOR_ADETLERI, TEKRAR_ADETLERI, odevBasligi, odevTarifi, type OdevHedef } from "@/lib/odev";

export interface FormOgrenci {
  id: string;
  ad: string;
}

type Tur = OdevHedef["tur"];
const TURLER: { tur: Tur; ad: string; aciklama: string }[] = [
  { tur: "ders", ad: "Ders bitir", aciklama: "Öğrenci dersi çalışır, sondaki testi %80 doğruyla geçer." },
  { tur: "tekrar", ad: "Tekrar kartı", aciklama: "Öğrendiği kelimelerin tekrar kartlarını çözer." },
  { tur: "motor", ad: "Cümle pratiği", aciklama: "Seçtiğiniz kalıptan doğru cümleler kurar." },
];

const bugunTarih = () => new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);
const gunSonra = (n: number) => new Date(Date.now() + 3 * 3600_000 + n * 86400_000).toISOString().slice(0, 10);

export function OdevFormu({ ogrenciler, secili }: { ogrenciler: FormOgrenci[]; secili?: string }) {
  const router = useRouter();
  const dersler = useMemo(() => UNITELER.flatMap((u) => u.dersler.map((d) => ({ kod: d.kod, ad: `Ders ${u.sira}.${d.no}: ${d.baslik}`, unite: `Ünite ${u.sira}: ${u.baslik}` }))), []);
  const [tur, setTur] = useState<Tur>("ders");
  const [ders, setDers] = useState(dersler[0]?.kod ?? "");
  const [tekrarAdet, setTekrarAdet] = useState(20);
  const [kural, setKural] = useState("be-pos");
  const [motorAdet, setMotorAdet] = useState(15);
  const [kime, setKime] = useState<Set<string>>(() => new Set(secili && ogrenciler.some((o) => o.id === secili) ? [secili] : ogrenciler.length === 1 ? [ogrenciler[0].id] : []));
  const [son, setSon] = useState(gunSonra(7));
  const [not, setNot] = useState("");
  const [durum, setDurum] = useState("");

  const hedef: OdevHedef = tur === "ders" ? { tur, ders } : tur === "tekrar" ? { tur, adet: tekrarAdet } : { tur, kural, adet: motorAdet };
  const hepsi = kime.size === ogrenciler.length && ogrenciler.length > 0;

  const degistir = (id: string) =>
    setKime((k) => {
      const y = new Set(k);
      if (y.has(id)) y.delete(id);
      else y.add(id);
      return y;
    });

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kime.size) return setDurum("En az bir öğrenci seçin.");
    setDurum("gonder");
    const sb = supabaseTarayici();
    const { data, error } = await sb
      .from("odevler")
      .insert({ baslik: odevBasligi(hedef), aciklama: not.trim() || null, hedef, son_tarih: son || null })
      .select("id")
      .single();
    if (error || !data) return setDurum(hataTr(error?.message));
    const { error: e2 } = await sb.from("odev_atamalari").insert([...kime].map((ogrenci_id) => ({ odev_id: data.id, ogrenci_id })));
    if (e2) {
      await sb.from("odevler").delete().eq("id", data.id);
      return setDurum(hataTr(e2.message));
    }
    router.push("/ogretmen/odevler?yeni=1");
    router.refresh();
  };

  return (
    <form className="odev-formu" onSubmit={gonder}>
      <fieldset>
        <legend>1. Ne yapacak?</legend>
        <div className="odev-turler">
          {TURLER.map((t) => (
            <label key={t.tur} className={tur === t.tur ? "secili" : ""}>
              <input type="radio" name="tur" checked={tur === t.tur} onChange={() => setTur(t.tur)} />
              <b>{t.ad}</b>
              <small>{t.aciklama}</small>
            </label>
          ))}
        </div>

        {tur === "ders" && (
          <label className="alan">
            <span>Ders</span>
            <select value={ders} onChange={(e) => setDers(e.target.value)}>
              {UNITELER.map((u) => (
                <optgroup key={u.kod} label={`Ünite ${u.sira}: ${u.baslik}`}>
                  {dersler
                    .filter((d) => d.unite === `Ünite ${u.sira}: ${u.baslik}`)
                    .map((d) => (
                      <option key={d.kod} value={d.kod}>
                        {d.ad}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        )}
        {tur === "tekrar" && (
          <label className="alan">
            <span>Kaç kart?</span>
            <select value={tekrarAdet} onChange={(e) => setTekrarAdet(+e.target.value)}>
              {TEKRAR_ADETLERI.map((n) => (
                <option key={n} value={n}>
                  {n} kart
                </option>
              ))}
            </select>
          </label>
        )}
        {tur === "motor" && (
          <div className="alan-ikili">
            <label className="alan">
              <span>Kalıp</span>
              <select value={kural} onChange={(e) => setKural(e.target.value)}>
                {Object.entries(RULES).map(([k, r]) => (
                  <option key={k} value={k}>
                    {r.t}
                  </option>
                ))}
              </select>
            </label>
            <label className="alan">
              <span>Kaç doğru cümle?</span>
              <select value={motorAdet} onChange={(e) => setMotorAdet(+e.target.value)}>
                {MOTOR_ADETLERI.map((n) => (
                  <option key={n} value={n}>
                    {n} cümle
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <p className="odev-onizleme">
          Öğrenci şunu görecek: <b>{odevBasligi(hedef)}</b>. {odevTarifi(hedef)}
        </p>
      </fieldset>

      <fieldset>
        <legend>2. Kime?</legend>
        {ogrenciler.length ? (
          <>
            <label className="kutu-sec hepsi">
              <input type="checkbox" checked={hepsi} onChange={() => setKime(hepsi ? new Set() : new Set(ogrenciler.map((o) => o.id)))} />
              Bütün öğrencilerim ({ogrenciler.length})
            </label>
            <div className="ogrenci-sec">
              {ogrenciler.map((o) => (
                <label key={o.id} className="kutu-sec">
                  <input type="checkbox" checked={kime.has(o.id)} onChange={() => degistir(o.id)} />
                  {o.ad || "İsimsiz öğrenci"}
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="not">Henüz bağlı öğrenciniz yok. Öğrencileriniz davet kodunuzla bağlanınca burada görünür.</p>
        )}
      </fieldset>

      <fieldset>
        <legend>3. Son gün</legend>
        <div className="son-gun">
          <input type="date" value={son} min={bugunTarih()} onChange={(e) => setSon(e.target.value)} aria-label="Son gün" />
          {[
            [1, "Yarın"],
            [3, "3 gün"],
            [7, "1 hafta"],
          ].map(([n, ad]) => (
            <button key={n} type="button" className={`dugme sade kucuk${son === gunSonra(n as number) ? " secili" : ""}`} onClick={() => setSon(gunSonra(n as number))}>
              {ad}
            </button>
          ))}
          <button type="button" className={`dugme sade kucuk${!son ? " secili" : ""}`} onClick={() => setSon("")}>
            Son gün yok
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>4. Not (isteğe bağlı)</legend>
        <textarea rows={2} maxLength={500} value={not} onChange={(e) => setNot(e.target.value)} placeholder="Ör. Özellikle he / she ile is'e dikkat et." aria-label="Öğrenciye not" />
      </fieldset>

      {durum && durum !== "gonder" && <p className="form-hata">{durum}</p>}
      <button type="submit" className="dugme ana buyuk" disabled={durum === "gonder" || !kime.size}>
        {kime.size > 1 ? `${kime.size} öğrenciye ödevi ver` : "Ödevi ver"}
      </button>
    </form>
  );
}

export function OdevSil({ id }: { id: string }) {
  const router = useRouter();
  const [emin, setEmin] = useState(false);
  if (!emin)
    return (
      <button type="button" className="dugme sade kucuk" onClick={() => setEmin(true)}>
        Sil
      </button>
    );
  return (
    <span className="sil-onay">
      Silinsin mi?
      <button
        type="button"
        className="dugme kucuk tehlike"
        onClick={async () => {
          await supabaseTarayici().from("odevler").delete().eq("id", id);
          router.refresh();
        }}
      >
        Evet, sil
      </button>
      <button type="button" className="dugme sade kucuk" onClick={() => setEmin(false)}>
        Vazgeç
      </button>
    </span>
  );
}

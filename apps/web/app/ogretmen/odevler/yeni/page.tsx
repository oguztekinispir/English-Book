import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Ust } from "@/components/Ust";
import { OdevFormu } from "@/components/OdevFormu";
import { oturum } from "@/lib/supabase/sunucu";
import "../../../hesap.css";
import "../../ogretmen.css";

export const metadata: Metadata = { title: "Yeni ödev" };

export default async function YeniOdev({ searchParams }: { searchParams: Promise<{ ogrenci?: string }> }) {
  const { ogrenci } = await searchParams;
  const { sb, user, profil } = await oturum();
  if (!user) redirect("/giris?sonra=/ogretmen/odevler/yeni");
  if (profil?.rol !== "ogretmen" && profil?.rol !== "yonetici") redirect("/ogrenci");
  const { data } = await sb.from("ogrenci_ozetleri").select("ogrenci_id, ad").eq("ogretmen_id", user.id);
  const ogrenciler = ((data ?? []) as { ogrenci_id: string; ad: string | null }[])
    .map((o) => ({ id: o.ogrenci_id, ad: o.ad || "" }))
    .sort((a, b) => a.ad.localeCompare(b.ad, "tr"));

  return (
    <div className="sayfa">
      <Ust aktif="panel" />
      <main className="panel dar">
        <p>
          <Link href="/ogretmen/odevler" className="geri">
            Ödevler
          </Link>
        </p>
        <h1>Yeni ödev</h1>
        <OdevFormu ogrenciler={ogrenciler} secili={ogrenci} />
      </main>
    </div>
  );
}

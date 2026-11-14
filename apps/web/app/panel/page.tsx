import { redirect } from "next/navigation";
import { oturum } from "@/lib/supabase/sunucu";

/** Girişten sonra role göre yönlendirir */
export default async function Panel() {
  const { user, profil } = await oturum();
  if (!user) redirect("/giris");
  redirect(profil?.rol === "ogretmen" || profil?.rol === "yonetici" ? "/ogretmen" : "/ogrenci");
}

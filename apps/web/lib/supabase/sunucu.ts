import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

/** Sunucu bileşenleri ve route'lar için Supabase istemcisi (çerezlerden oturum) */
export async function supabaseSunucu() {
  const cerez = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cerez.getAll(),
      setAll: (liste) => {
        try {
          liste.forEach(({ name, value, options }) => cerez.set(name, value, options));
        } catch {
          /* sunucu bileşeninden çağrıldıysa yok say; middleware yeniler */
        }
      },
    },
  });
}

export type Rol = "ogrenci" | "ogretmen" | "yonetici";
export interface Profil {
  id: string;
  ad: string;
  rol: Rol;
  davet_kodu: string | null;
  dogum_yili: number | null;
  veli_eposta: string | null;
  veli_onayi_at: string | null;
}

/** Giriş yapan kullanıcı ve profili (yoksa null) */
export async function oturum() {
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { sb, user: null, profil: null as Profil | null };
  const { data } = await sb.from("profiller").select("*").eq("id", user.id).maybeSingle();
  return { sb, user, profil: (data as Profil | null) ?? null };
}

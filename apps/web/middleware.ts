import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "./lib/supabase/config";

const KORUMALI = ["/panel", "/ogrenci", "/ogretmen", "/hesap"];

export async function middleware(req: NextRequest) {
  // Sadece geliştirmede, sahte verili önizleme (bkz. lib/supabase/onizleme.ts)
  if (process.env.NODE_ENV !== "production" && process.env.TI_ONIZLEME === "1") return NextResponse.next();
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (liste) => {
        liste.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        liste.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  // Oturumu tazele (süresi dolmuş token'ı yeniler)
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user && KORUMALI.some((p) => req.nextUrl.pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("sonra", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico|.*\\.(?:png|jpg|svg|webp)$).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import { supabaseSunucu } from "@/lib/supabase/sunucu";

/** E-posta doğrulama / şifre sıfırlama linkinden dönüş */
export async function GET(req: NextRequest) {
  const kod = req.nextUrl.searchParams.get("code");
  const sonra = req.nextUrl.searchParams.get("sonra") || "/panel";
  if (kod) {
    const sb = await supabaseSunucu();
    const { error } = await sb.auth.exchangeCodeForSession(kod);
    if (!error) return NextResponse.redirect(new URL(sonra.startsWith("/") ? sonra : "/panel", req.url));
  }
  return NextResponse.redirect(new URL("/giris?hata=dogrulama", req.url));
}

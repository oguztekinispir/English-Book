import { NextResponse, type NextRequest } from "next/server";
import { supabaseSunucu } from "@/lib/supabase/sunucu";

export async function POST(req: NextRequest) {
  const sb = await supabaseSunucu();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}

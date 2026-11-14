"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

let tek: SupabaseClient | null = null;
/** Tarayıcıdaki Supabase istemcisi (tek örnek) */
export function supabaseTarayici(): SupabaseClient {
  tek ??= createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  return tek;
}

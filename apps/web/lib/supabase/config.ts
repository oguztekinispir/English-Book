// Supabase bağlantı bilgileri. Publishable key tarayıcıya açık gider; veriyi RLS kuralları korur.
// Vercel'de NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY tanımlanırsa onlar kullanılır.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vnvjexaodujoumgekfuq.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_nmpZrF7GA0pnIK5S6UMhzg_t18pD9Yo";

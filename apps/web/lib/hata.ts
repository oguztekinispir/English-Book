/** Supabase hata mesajlarını Türkçeye çevirir. */
export function hataTr(m?: string | null): string {
  if (!m) return "Bir şey ters gitti. Tekrar dene.";
  const s = m.toLowerCase();
  if (s.includes("invalid login credentials")) return "E-posta ya da şifre yanlış.";
  if (s.includes("email not confirmed")) return "E-postanı henüz doğrulamadın. Gelen kutundaki linke tıkla (spam klasörüne de bak).";
  if (s.includes("user already registered") || s.includes("already been registered")) return "Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.";
  if (s.includes("password should be at least") || s.includes("weak password")) return "Şifre en az 8 karakter olmalı.";
  if (s.includes("rate limit") || s.includes("too many")) return "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar dene.";
  if (s.includes("unable to validate email") || s.includes("invalid email")) return "E-posta adresi geçerli görünmüyor.";
  if (s.includes("failed to fetch") || s.includes("network")) return "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.";
  if (s.includes("öğretmen") || s.includes("giriş yap") || s.includes("kendi kod")) return m; // veritabanından gelen Türkçe mesaj
  return "Bir şey ters gitti: " + m;
}

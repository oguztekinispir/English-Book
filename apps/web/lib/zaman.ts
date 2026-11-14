/** "3 saat önce", "dün", "5 gün önce" */
export function once(iso?: string | null): string {
  if (!iso) return "henüz çalışmadı";
  const fark = (Date.now() - new Date(iso).getTime()) / 1000;
  if (fark < 60) return "az önce";
  if (fark < 3600) return `${Math.floor(fark / 60)} dakika önce`;
  if (fark < 86400) return `${Math.floor(fark / 3600)} saat önce`;
  const gun = Math.floor(fark / 86400);
  if (gun === 1) return "dün";
  if (gun < 30) return `${gun} gün önce`;
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export const yuzde = (d: number, t: number) => (t ? Math.round((d / t) * 100) : 0);

/**
 * Hikâye: Moda Apartmanı. A1 boyunca aynı karakterler.
 * Avatarlar bu renklerle çizilir (kendi çizimimiz). Diyalogdaki kişi adı buradaki ada eşleşir.
 */
export interface Karakter {
  ad: string;
  kunye: string;
  hikaye: string;
  ses: "kadin" | "erkek";
  zemin: string;
  ten: string;
  sac: string;
  giysi: string;
  uzunSac?: boolean;
}

export const KARAKTERLER: Karakter[] = [
  { ad: "Deniz", kunye: "19, öğrenci, İzmirli", hikaye: "Moda Apartmanı'na yeni taşındı, İngilizceye sıfırdan başlıyor. Hedefi: yazın Londra'da bir dil okulu.", ses: "erkek", zemin: "#eaf6ff", ten: "#d9a77c", sac: "#2b2118", giysi: "#2f55e4" },
  { ad: "Lisa", kunye: "öğretmen, Londralı", hikaye: "Dil kafesinde İngilizce dersi veriyor. Türkçeyi biraz biliyor.", ses: "kadin", zemin: "#fff0f3", ten: "#f2c9a5", sac: "#e2b04a", giysi: "#e86a5c", uzunSac: true },
  { ad: "Ece", kunye: "Deniz'in komşusu", hikaye: "Apartmanın neşesi; herkesi herkesle tanıştırır. Kardeşi Kerem sık sık uğrar.", ses: "kadin", zemin: "#fff4d6", ten: "#e8b48f", sac: "#6b3a1f", giysi: "#ffb238", uzunSac: true },
  { ad: "John", kunye: "Londralı, yeni komşu", hikaye: "Apartmana yeni taşındı. Ne iş yaptığını kimseye söylemiyor.", ses: "erkek", zemin: "#e6f6ee", ten: "#f0c8a8", sac: "#b5651d", giysi: "#10845a" },
  { ad: "Anna", kunye: "Alman, öğrenci", hikaye: "İstanbul'da Türkçe öğreniyor. Emre ile dil değişimi yapıyor.", ses: "kadin", zemin: "#f1ecff", ten: "#f5d2b8", sac: "#d9a441", giysi: "#7a5af8", uzunSac: true },
  { ad: "Emre", kunye: "mühendis", hikaye: "Dil kafesinin müdavimi, Selin'in ağabeyi. Bekâr ve hep meşgul.", ses: "erkek", zemin: "#eef1fa", ten: "#c99a72", sac: "#1f1a17", giysi: "#39415c" },
  { ad: "Selin", kunye: "hemşire", hikaye: "Emre'nin kız kardeşi. Oğlu Efe, Mark'ın oğluyla aynı okulda.", ses: "kadin", zemin: "#ffeef0", ten: "#d9a77c", sac: "#3a2418", giysi: "#e05a7a", uzunSac: true },
  { ad: "Mark", kunye: "mühendis, Amerikalı", hikaye: "İşi için İstanbul'a gelmiş. Eşi Sarah doktor.", ses: "erkek", zemin: "#e8edff", ten: "#e9bf9b", sac: "#8a6a4a", giysi: "#2f55e4" },
  { ad: "Kerem", kunye: "Ece'nin kardeşi", hikaye: "On beş yaşında, apartmana sık sık uğruyor.", ses: "erkek", zemin: "#fff4d6", ten: "#e8b48f", sac: "#4a2a14", giysi: "#ff8a3d" },
  { ad: "Sarah", kunye: "doktor, Mark'ın eşi", hikaye: "Hastanede çalışıyor; hep işte.", ses: "kadin", zemin: "#e8edff", ten: "#f2c9a5", sac: "#7a4a2a", giysi: "#10845a", uzunSac: true },
];

export const karakterBul = (ad: string) => KARAKTERLER.find((k) => k.ad === ad);

import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import "../hesap.css";

export const metadata: Metadata = { title: "Aydınlatma metni" };

/** TASLAK: Yayından önce bir avukata kontrol ettirilmeli. */
export default function Kvkk() {
  return (
    <div className="sayfa">
      <Ust aktif="ana" />
      <main className="metin-sayfa yaprak">
        <h1>Kişisel verilerin işlenmesi hakkında aydınlatma metni</h1>
        <p className="taslak">Bu metin taslaktır ve deneme sürümü içindir. Platform herkese açılmadan önce hukuki olarak gözden geçirilecektir.</p>

        <h2>Hangi verileri topluyoruz</h2>
        <ul>
          <li>Hesap bilgileri: adın, e-posta adresin, doğum yılın, hesap türün (öğrenci / öğretmen).</li>
          <li>18 yaşından küçük kullanıcılar için velinin e-posta adresi.</li>
          <li>Çalışma kayıtları: yaptığın alıştırmalar, verdiğin cevaplar, doğru / yanlış bilgisi, tarih ve süre.</li>
          <li>Yazma günlüğüne yazdığın metinler.</li>
        </ul>

        <h2>Neden topluyoruz</h2>
        <ul>
          <li>Hesabını açmak ve ilerlemeni cihazların arasında saklamak için.</li>
          <li>Sana hangi kuralda zorlandığını göstermek ve tekrar kartlarını buna göre hazırlamak için.</li>
          <li>Bir öğretmene bağlandıysan, öğretmeninin çalışmalarını görebilmesi için.</li>
        </ul>

        <h2>Kim görüyor</h2>
        <p>
          Çalışma kayıtlarını sen ve <b>sadece kendi kodunu girerek bağlandığın öğretmenler</b> görür. Bir öğretmenden ayrıldığında o öğretmen kayıtlarını artık
          göremez. Verilerin üçüncü kişilere satılmaz.
        </p>

        <h2>Nerede saklanıyor</h2>
        <p>Veriler Avrupa Birliği içindeki (Frankfurt) sunucularda saklanır. Bağlantılar şifrelidir.</p>

        <h2>Hakların</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında verilerine erişme, düzeltme, silinmesini isteme ve işlenmesine itiraz etme hakkın vardır. Bunun için
          bizimle iletişime geçebilirsin.
        </p>
      </main>
    </div>
  );
}

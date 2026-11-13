/** Türkçe ek rehberi: hangi ek İngilizcede ne olur. (Prototipteki ek envanteri.) */
const SATIRLAR: [string, string, string, string][] = [
  ["-mek / -mak", "Fiilin sözlük hali. Kökü bulmak için at.", "iç-mek → iç, yaz-mak → yaz", "drink, write"],
  ["-ır / -er / -ar", "Geniş zaman: hep, genelde yaparım", "iç-er-im, yaz-ar", "I drink, he writes"],
  ["-ıyor / -iyor", "Şu an yapıyor", "iç-iyor-um", "I am drinking"],
  ["-dı / -di / -du / -dü, -tı / -ti / -tu / -tü", "Geçmiş", "iç-ti-m, yorgun-du-m", "I drank, I was tired"],
  ["-ecek / -acak", "Gelecek", "iç-eceğ-im, yaz-acak", "I will drink, he will write"],
  ["-ma / -me", "Olumsuz (iş cümlesinde)", "iç-me-m, iç-me-di-m", "I don't drink, I didn't drink"],
  ["değil", "Olumsuz (durum cümlesinde)", "yorgun değil-im", "I am not tired"],
  ["-mı / -mi / -mu / -mü", "Soru", "iç-ti-n mi? yorgun mu-sun?", "Did you drink? Are you tired?"],
  ["-(y)ım / -m", "ben", "yorgun-um, iç-ti-m", "I"],
  ["-sın / -n", "sen", "yorgun-sun, iç-ti-n", "you"],
  ["-(y)ız / -k", "biz", "yorgun-uz, iç-ti-k", "we"],
  ["-lar / -ler", "onlar, çoğul", "iç-er-ler, kitap-lar", "they, books"],
  ["-de / -da / -te / -ta", "nerede?", "ev-de, iş-te", "at home, at work"],
  ["-e / -a / -ye / -ya", "nereye?", "iş-e, ev-e", "to work, home"],
  ["-den / -dan", "nereden?", "ev-den", "from home"],
  ["-ım / -ın (sahiplik)", "benim, senin", "ev-im, ev-in", "my house, your house"],
  ["-y-", "Araya giren ses. Anlamı yok.", "mutlu-y-du-m", "—"],
];

export function EkRehberi() {
  return (
    <details className="rehber yaprak" id="ek-rehberi">
      <summary>
        <span>Türkçe ek rehberi</span>
        <small>Hangi ek İngilizcede ne olur?</small>
      </summary>
      <div className="rehber-ic">
        <p>
          Türkçede kelime parçalardan yapılır: <b>kök + ekler</b>. İngilizcede bu eklerin çoğu <b>ayrı kelimedir</b>. Bir Türkçe kelimeyi çevirmeden önce ekleri
          sağdan sola kes, kökü bul.
        </p>
        <p className="ornek-satir">
          <span className="parca root">
            <b>uyu</b>
            <i>sleep</i>
          </span>
          <span className="parca suf">
            <b>ma</b>
            <i>olumsuz</i>
          </span>
          <span className="parca suf">
            <b>dı</b>
            <i>geçmiş</i>
          </span>
          <span className="parca pers">
            <b>k</b>
            <i>biz</i>
          </span>
          <span className="esit">=</span>
          <b lang="en" className="ing">
            We didn&apos;t sleep.
          </b>
        </p>
        <div className="tablo">
          <table>
            <thead>
              <tr>
                <th>Ek</th>
                <th>Ne yapar</th>
                <th>Örnek</th>
                <th>İngilizcede</th>
              </tr>
            </thead>
            <tbody>
              {SATIRLAR.map((r) => (
                <tr key={r[0]}>
                  <td>
                    <span className="ek-isaret">{r[0]}</span>
                  </td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td lang="en">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rehber-kurallar">
          <div>
            <h4>Neden bir ekin 4 şekli var?</h4>
            <p>Türkçe ekin sesini kelimeye uydurur. Anlam değişmez. Kelimedeki son sesli harfe bak:</p>
            <ul>
              <li>a, ı → ı: yaz-dı, kız-dı</li>
              <li>e, i → i: gel-di, iç-ti</li>
              <li>o, u → u: koş-tu, uyu-du</li>
              <li>ö, ü → ü: yürü-dü, gör-dü</li>
            </ul>
          </div>
          <div>
            <h4>d mi, t mi?</h4>
            <p>
              Kelime <b>ç f h k p s ş t</b> harflerinden biriyle bitiyorsa (Fıstıkçı Şahap) d → t olur: iç-ti, koş-tu, yap-tı. Yine aynı ek.
            </p>
            <h4>k neden ğ oldu?</h4>
            <p>Sondaki k'den sonra sesli gelince yumuşar: yazacak + ım → yazacağım.</p>
          </div>
          <div>
            <h4>Kökü 3 adımda bul</h4>
            <ol>
              <li>Sondan kişi ekini kes (m, n, k, -sın, -ler).</li>
              <li>Sonra zaman ekini kes (dı, ır, ecek, ıyor).</li>
              <li>Sonra olumsuz ya da soru ekini kes (ma, mı). Kalan kök.</li>
            </ol>
            <p className="not">içmedin → içmedi-n → içme-di → iç-me → iç = drink. -dı + -me = didn&apos;t → You didn&apos;t drink.</p>
          </div>
        </div>
      </div>
    </details>
  );
}

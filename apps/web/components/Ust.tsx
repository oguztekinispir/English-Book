import Link from "next/link";

export function Ust({ aktif }: { aktif: "ana" | "pratik" }) {
  return (
    <header className="ust">
      <Link href="/" className="marka" aria-label="Türkçeden İngilizce, ana sayfa">
        Türkçe<span className="tire">-</span>
        <span className="marka-ek">den</span>
        <span style={{ marginLeft: 6 }}>İngilizce</span>
      </Link>
      <nav aria-label="Ana menü">
        <Link href="/" aria-current={aktif === "ana" ? "page" : undefined}>
          Nasıl çalışır
        </Link>
        <Link href="/pratik" aria-current={aktif === "pratik" ? "page" : undefined}>
          Pratik
        </Link>
      </nav>
    </header>
  );
}

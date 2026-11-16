import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BECERI_DERSLERI, beceriBul } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { BeceriDersi } from "@/components/beceri/BeceriDersi";
import "../../uniteler/unite.css";
import "../../calisma.css";
import "../../gramer/gramer.css";
import "../beceriler.css";

type P = { params: Promise<{ kod: string }> };

export function generateStaticParams() {
  return BECERI_DERSLERI.map((d) => ({ kod: d.kod }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = beceriBul((await params).kod);
  return { title: d ? `${d.tur === "okuma" ? "Okuma" : "Yazma"}: ${d.baslik}` : "Okuma ve yazma" };
}

export default async function BeceriSayfasi({ params }: P) {
  const d = beceriBul((await params).kod);
  if (!d) notFound();
  return (
    <div className="sayfa">
      <Ust aktif="beceriler" />
      <main className="calisma gk-sayfa">
        <p>
          <Link href="/beceriler" className="geri">
            Okuma ve yazma
          </Link>
        </p>
        <header className="gk-kapak">
          <span className="rozet">{d.seviye}</span> <span className="bl-tur">{d.tur === "okuma" ? "Okuma" : "Yazma"}: {d.metinTuru}</span>
          <h1>{d.baslik}</h1>
          <p className="gk-merak">{d.aciklama}</p>
        </header>
        <BeceriDersi d={d} />
      </main>
    </div>
  );
}

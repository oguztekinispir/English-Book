import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GRAMER_KONULARI, gramerKonusuBul } from "@ti/icerik";
import { Ust } from "@/components/Ust";
import { GramerKonuCalis } from "@/components/GramerKonuCalis";
import "../../uniteler/unite.css";
import "../../calisma.css";
import "../gramer.css";

type P = { params: Promise<{ kod: string }> };

export function generateStaticParams() {
  return GRAMER_KONULARI.map((k) => ({ kod: k.kod }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const k = gramerKonusuBul((await params).kod);
  return { title: k ? `Gramer: ${k.baslik}` : "Gramer" };
}

export default async function GramerKonuSayfasi({ params }: P) {
  const k = gramerKonusuBul((await params).kod);
  if (!k) notFound();
  return (
    <div className="sayfa">
      <Ust aktif="gramer" />
      <main className="calisma gk-sayfa">
        <p>
          <Link href="/gramer" className="geri">
            Gramer konuları
          </Link>
        </p>
        <header className="gk-kapak">
          <span className="rozet">{k.seviye}</span>
          <h1>{k.baslik}</h1>
          <p className="gk-en" lang="en">
            {k.baslikEn}
          </p>
          <p className="gk-merak">{k.merak}</p>
        </header>
        <GramerKonuCalis k={k} />
      </main>
    </div>
  );
}

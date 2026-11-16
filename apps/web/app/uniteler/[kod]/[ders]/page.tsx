import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dersBul } from "@ti/icerik";
import { DersIcerik } from "@/components/unite/DersIcerik";

type P = { params: Promise<{ kod: string; ders: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { kod, ders } = await params;
  const b = dersBul(`${kod}-${ders}`);
  return { title: b ? `Ders ${b.u.sira}.${b.d.no}: ${b.d.baslik}` : "Ders" };
}

export default async function DersSayfasi({ params }: P) {
  const { kod, ders } = await params;
  const b = dersBul(`${kod}-${ders}`);
  if (!b) notFound();
  return <DersIcerik u={b.u} d={b.d} />;
}

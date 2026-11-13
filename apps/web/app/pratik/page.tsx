import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import { Pratik } from "./Pratik";
import "./pratik.css";

export const metadata: Metadata = {
  title: "Pratik: cümle yolu ve serbest antrenman",
};

export default function PratikSayfasi() {
  return (
    <div className="sayfa">
      <Ust aktif="pratik" />
      <main>
        <Pratik />
      </main>
    </div>
  );
}

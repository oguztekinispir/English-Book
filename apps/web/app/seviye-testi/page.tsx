import type { Metadata } from "next";
import { Ust } from "@/components/Ust";
import { SeviyeTesti } from "@/components/SeviyeTesti";
import { oturum } from "@/lib/supabase/sunucu";
import "../uniteler/unite.css";
import "./seviye.css";

export const metadata: Metadata = {
  title: "Seviye testi",
  description: "Kısa bir testle İngilizcede nereden başlaman gerektiğini öğren. Kayıt gerekmez.",
};

/** Girişsiz de açık. Middleware'de korunmaz. */
export default async function SeviyeSayfasi() {
  const { user } = await oturum().catch(() => ({ user: null }));
  return (
    <div className="sayfa">
      <Ust aktif="seviye" />
      <main className="seviye">
        <h1>Nereden başlamalısın?</h1>
        <p className="seviye-alt">Herkes sıfırdan başlamıyor. Bu test, bildiğin konuları atlayıp sana uygun üniteden başlamanı sağlar.</p>
        <SeviyeTesti girisli={!!user} />
      </main>
    </div>
  );
}

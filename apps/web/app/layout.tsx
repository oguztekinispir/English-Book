import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Türkçeden İngilizce: ekler İngilizcede kelime olur",
  description:
    "Türkçe cümleyi gör, İngilizcesini yaz. Yanlış yaparsan nedenini Türkçenin ekleriyle öğren. A1 seviyesi için cümle motoru ve 19 seviyelik cümle yolu.",
};

export const viewport: Viewport = { themeColor: "#fafbff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

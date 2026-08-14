import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusTrack — Tu día, en bloques que sí puedes sostener",
  description:
    "El planificador visual para mentes con TDAH que reprograma imprevistos al instante, sin cobros ocultos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chivo:wght@600;700&family=Hanken+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}

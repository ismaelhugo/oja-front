import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Operação Janela Aberta - Transparência Pública com IA",
  description: "Plataforma de transparência e acesso à informação pública no Brasil. Consulte gastos de deputados federais (CEAP) através de IA conversacional e interfaces intuitivas.",
  keywords: ["transparência pública", "CEAP", "deputados federais", "gastos públicos", "inteligência artificial", "Brasil"],
  authors: [{ name: "Operação Janela Aberta" }],
  openGraph: {
    title: "Operação Janela Aberta",
    description: "Transparência e acesso à informação pública no Brasil através de inteligência artificial",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: "/image.png",
    apple: "/image.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${InterFont.variable} ${InterFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

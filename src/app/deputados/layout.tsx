import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de Deputados Federais - Operação Janela Aberta",
  description: "Explore a lista completa de deputados federais brasileiros. Filtre por partido, estado e nome para encontrar informações específicas sobre gastos públicos.",
  keywords: ["deputados federais", "lista deputados", "CEAP", "gastos públicos", "transparência", "Brasil"],
  openGraph: {
    title: "Lista de Deputados Federais",
    description: "Explore a lista completa de deputados federais brasileiros",
    type: "website",
  },
};

export default function DeputadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

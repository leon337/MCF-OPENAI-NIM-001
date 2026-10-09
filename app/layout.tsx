import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCF / NVIDIA NIM",
  description: "Starter workspace para aplicações de IA com Next.js, Vercel e NVIDIA NIM.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

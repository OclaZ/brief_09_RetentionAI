import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- CETTE LIGNE EST CRUCIALE !

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RetentionAI Dashboard",
  description: "RH Dashboard powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      {/* On applique la classe de police et de fond ici */}
      <body className={`${inter.variable} font-sans bg-background text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
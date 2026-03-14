import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import PWAWrapper from "@/components/PWAWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "SNAE - Sistema Nacional de Aprendizagem ao Estudante",
  description:
    "Plataforma educacional digital inclusiva para estudantes do ensino secundário. Acesse conteúdos educacionais, tire dúvidas e prepare-se para exames.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SNAE",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
            <PWAWrapper>{children}</PWAWrapper></AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

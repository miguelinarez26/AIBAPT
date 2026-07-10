import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import { assetPath } from "@/lib/assets";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIBAPT | Asociación Iberoamericana de Psicotrauma",
  description: "Asociación Iberoamericana de Psicotrauma. Uniendo profesionales en Iberoamérica para avanzar en el estudio, prevención y tratamiento del trauma psicológico con un enfoque orgánico y humano.",
  icons: {
    icon: assetPath("/images/favicon_official.png"),
    shortcut: assetPath("/images/favicon_official.png"),
    apple: assetPath("/images/favicon_official.png"),
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round|Material+Icons" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            classNames: {
              toast: 'font-sans shadow-lg rounded-2xl',
              info: '!bg-secondary/10 !border-secondary/30 !text-primary dark:!text-secondary-light',
              success: '!bg-primary/10 !border-primary/30 !text-primary dark:!text-primary-light',
              warning: '!bg-highlight/10 !border-highlight/30 !text-amber-700 dark:!text-amber-500',
              error: '!bg-accent/10 !border-accent/30 !text-accent dark:!text-accent-light',
            }
          }}
        />
      </body>
    </html>
  );
}

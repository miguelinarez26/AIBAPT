import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/components/providers/AuthProvider";

// Layout raíz — provee los providers globales a todas las rutas.
// El HTML y metadata localizada se manejan en [lang]/layout.tsx,
// pero las rutas legacy (fuera de [lang]) también necesitan los providers.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round|Material+Icons" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden">
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

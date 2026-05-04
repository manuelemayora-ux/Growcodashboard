import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stockly — Inventario y Ventas para PyMEs",
  description:
    "Sistema SaaS de gestión de inventario y ventas diseñado para PyMEs en El Salvador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

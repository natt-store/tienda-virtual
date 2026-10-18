import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { FavoritesProvider } from "@/components/favorites/FavoritesContext";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Natt Store",
  description: "Todo lo que amas, en un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <ChatBot />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
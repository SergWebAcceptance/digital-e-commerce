import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <CartProvider>
          <body className={inter.className}>
            <Header />
            <main>{children}</main>
            <Footer />
          </body>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import SearchPanel from "@/components/SearchPanel";
import AuthPanel from "@/components/AuthPanel";
import { ToastProvider } from "@/components/ToastProvider";


export const metadata: Metadata = {
  title: "Aamir Fabrics | Premium Unstitched Fabrics",
  description:
    "Your destination for premium unstitched fabrics from Pakistan's finest brands. Shop Sapphire, Khaadi, Gul Ahmed, Maria B, and more.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-secondary text-primary font-body antialiased overflow-x-hidden w-full">
        <Providers>
          <ToastProvider>
            <Navbar />
            <CartSidebar />
            <SearchPanel />
            <AuthPanel />
            <main>{children}</main>
            <Footer />

          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

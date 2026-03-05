import { Inter } from "next/font/google";
import "../styles/main.scss";
import Providers from "@/context/Providers";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BuyLog",
  description: "Buy and Sell with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />

          <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0 py-6">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
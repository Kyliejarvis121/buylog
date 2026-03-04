import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import Providers from "@/context/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
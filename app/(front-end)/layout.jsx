import "@/styles/main.scss";
import Providers from "@/context/Providers";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="w-full overflow-x-hidden">
            <Navbar />

            <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0 py-6">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
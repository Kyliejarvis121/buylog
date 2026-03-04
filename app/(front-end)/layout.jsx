import Script from "next/script";
import Footer from "@/components/frontend/Footer";
import Navbar from "@/components/frontend/Navbar";
import ThemeProvider from "@/components/ThemeProvider";

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="w-full overflow-x-hidden">
            <Navbar />

            <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0 py-6">
              {children}
            </main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
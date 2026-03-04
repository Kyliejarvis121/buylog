import "@/styles/main.scss";
import Providers from "@/context/Providers";
import AdsenseScript from "@/components/frontend/AdsenseScript";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <Providers>
          {/* Adsense loads after hydration */}
          <AdsenseScript />

          {children}
        </Providers>
      </body>
    </html>
  );
}
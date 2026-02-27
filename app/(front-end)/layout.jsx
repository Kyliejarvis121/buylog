import Script from "next/script";
import Footer from "@/components/frontend/Footer";
import Navbar from "@/components/frontend/Navbar";
import React from "react";

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-9597681757893442"
        />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9597681757893442"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body>
        <div className="w-full overflow-x-hidden">
          <Navbar />

          <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0 py-6">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
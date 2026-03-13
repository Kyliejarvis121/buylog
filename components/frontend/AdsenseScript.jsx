"use client";

import Script from "next/script";

export default function AdsenseScript() {
  return (
    <Script
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9597681757893442"
      crossOrigin="anonymous"
    />
  );
}
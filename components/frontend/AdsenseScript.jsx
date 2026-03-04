"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function AdsenseScript() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense init error (ignore on dev)", e);
    }
  }, []);

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9597681757893442"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
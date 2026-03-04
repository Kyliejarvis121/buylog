"use client";

import { useEffect } from "react";

export default function AdsenseScript() {
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src*="adsbygoogle.js"]'
    );

    // Prevent loading twice
    if (existingScript) return;

    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9597681757893442";
    script.async = true;
    script.crossOrigin = "anonymous";

    document.body.appendChild(script);
  }, []);

  return null;
}
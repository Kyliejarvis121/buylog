"use client";

import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import AdsenseScript from "@/components/frontend/AdsenseScript";
import { initPushNotifications } from "@/lib/pushNotifications";
import React, { useEffect } from "react";

export default function Layout({ children }) {
  useEffect(() => {
    initPushNotifications();

    const handler = (e) => {
      const link = e.target.closest("a[target='_blank']");
      if (link && link.href.includes("buylogint.com")) {
        e.preventDefault();
        window.location.href = link.href;
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <>
      <AdsenseScript />
      <Navbar />
      <main className="max-w-6xl mx-auto py-6 px-8 lg:px-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
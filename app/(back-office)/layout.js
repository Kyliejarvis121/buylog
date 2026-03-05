"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  // PRESENCE (kept)
  useEffect(() => {
    const updateOnline = async () => {
      try {
        await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "online" }),
        });
      } catch (err) {
        console.warn("Presence update failed");
      }
    };

    const sendOffline = () => {
      try {
        navigator.sendBeacon(
          "/api/presence",
          new Blob([JSON.stringify({ status: "offline" })])
        );
      } catch (err) {}
    };

    updateOnline();

    window.addEventListener("beforeunload", sendOffline);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendOffline();
      }
    });

    return () => {
      sendOffline();
      window.removeEventListener("beforeunload", sendOffline);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-hidden">

      {/* Sidebar (fixed width) */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Area */}
      <div className="flex flex-col flex-1">

        {/* Navbar (fixed) */}
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Page Content */}
        <main
          className="
            flex-1
            mt-16
            p-6
            overflow-y-auto
          "
        >
          {children}
        </main>

      </div>
    </div>
  );
}
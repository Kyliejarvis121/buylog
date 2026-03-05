"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    try {
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "online" }),
      });
    } catch (e) {}

    const handleOffline = () => {
      try {
        navigator.sendBeacon(
          "/api/presence",
          new Blob([JSON.stringify({ status: "offline" })])
        );
      } catch (e) {}
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleOffline();
      }
    };

    window.addEventListener("beforeunload", handleOffline);
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, []);

  return (
    <div className="w-full min-h-screen">
      <div className="flex">

        {/* Sidebar */}
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Main Area (no forced zoom) */}
        <div className="flex-1 lg:ml-64 min-h-screen">

          <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

          <main className="mt-14 px-3 sm:px-4 py-4 w-full">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
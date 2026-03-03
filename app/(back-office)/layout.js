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
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex relative">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <div className="flex-1 lg:ml-64 bg-slate-100 dark:bg-slate-900 min-h-screen w-full">
          <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

          <main className="mt-16 px-4 sm:px-6 py-6 w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
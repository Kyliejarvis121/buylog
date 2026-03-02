"use client";
export const dynamic = "force-dynamic";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // ✅ Set user online when dashboard loads
    fetch("/api/presence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "online" }),
    });

    // ✅ Handle tab close / refresh
    const handleOffline = () => {
      navigator.sendBeacon(
        "/api/presence",
        JSON.stringify({ status: "offline" })
      );
    };

    // ✅ Handle tab hidden (user switches tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        navigator.sendBeacon(
          "/api/presence",
          JSON.stringify({ status: "offline" })
        );
      }
    };

    window.addEventListener("beforeunload", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 bg-slate-100 dark:bg-slate-900 min-h-screen w-full">
          {/* Navbar */}
          <Navbar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />

          {/* Page Content */}
          <main className="mt-16 px-4 sm:px-6 py-6 w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
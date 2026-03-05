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

    window.addEventListener("beforeunload", handleOffline);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* MOBILE: column, DESKTOP: row */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Sidebar */}
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">

          {/* Navbar */}
          <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

          {/* Page Content */}
          <main className="flex-1 mt-16 px-4 sm:px-6 lg:px-8 py-6 w-full">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  // PRESENCE PING (optional but good)
  useEffect(() => {
    const updatePresence = async () => {
      try {
        await fetch("/api/presence", { method: "POST" });
      } catch (err) {
        console.warn("Presence update failed");
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Area */}
      <div className="flex flex-col flex-1 lg:ml-64 bg-slate-100 dark:bg-slate-900">

        {/* Navbar */}
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto overflow-x-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
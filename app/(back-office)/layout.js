"use client";
import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState, useEffect } from "react";
import "../../styles/main.scss";

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
    <div className="flex">
      {/* Sidebar */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <div className="lg:ml-64 ml-0 flex-grow bg-slate-100 min-h-screen">
        {/* Navbar */}
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Page Content */}
        <main className="p-8 bg-slate-100 dark:bg-slate-900 text-slate-50 min-h-screen mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
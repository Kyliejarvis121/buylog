"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="flex flex-col flex-1 lg:ml-64 bg-slate-100 dark:bg-slate-900">

        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Page Content (NO extra container) */}
        <main className="flex-1 mt-16 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
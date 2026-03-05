"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64 bg-slate-100 dark:bg-slate-900">

        {/* Dashboard Header */}
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Page Content */}
        <main className="flex-1 mt-16 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 text-slate-900 dark:text-slate-100">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-grow lg:ml-64 bg-slate-100 dark:bg-slate-900">

        {/* Dashboard Header */}
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Page Content */}
        <main className="p-8 mt-16 flex-grow text-slate-900 dark:text-slate-100">
          {children}
        </main>

      </div>
    </div>
  );
}
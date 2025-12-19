"use client";

import Navbar from "@/components/backoffice/Navbar";
import Sidebar from "@/components/backoffice/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

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

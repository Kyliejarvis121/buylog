import Footer from "@/components/frontend/Footer";
import Navbar from "@/components/frontend/Navbar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-0 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}

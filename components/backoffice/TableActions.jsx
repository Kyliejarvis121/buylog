"use client";

import React from "react";
import { Download, Plus, Search, Trash2 } from "lucide-react";

export default function TableActions() {
  return (
    <div className="flex justify-between py-6 px-12 bg-white dark:bg-slate-700 rounded-lg items-center gap-8 ">
      <button className="relative inline-flex items-center justify-center py-3 px-4 space-x-3  text-base font-medium text-gray-900 rounded-lg group dark:bg-slate-800 bg-slate-100  border border-slate-900 dark:border-lime-500  dark:text-white">
        <Download />
        <span>Export</span>
      </button>

      <div className="flex-grow">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:text-white"
            placeholder="Search for items"
          />
        </div>
      </div>

      <button className="flex items-center space-x-2 bg-red-600 text-white rounded-lg px-6 py-3">
        <Trash2 />
        <span>Bulk Delete</span>
      </button>
    </div>
  );
}

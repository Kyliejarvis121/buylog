"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Breadcrumb({ title, resultCount }) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 3;

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, resultCount);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">

      {/* Breadcrumb Path */}
      <div className="flex items-center text-slate-700 dark:text-slate-300">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>

        <ChevronRight className="w-4 h-4 mx-1" />

        <span className="font-medium text-slate-900 dark:text-slate-100">
          {title}
        </span>
      </div>

      {/* Result Count */}
      <div className="text-slate-600 dark:text-slate-400">
        {resultCount > 0 ? (
          <span>
            Showing <span className="font-semibold text-slate-900 dark:text-white">
              {startRange}-{endRange}
            </span>{" "}
            of <span className="font-semibold">{resultCount}</span> results
          </span>
        ) : (
          <span>No results found</span>
        )}
      </div>

    </div>
  );
}
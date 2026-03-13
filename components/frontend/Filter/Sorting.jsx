"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Sorting({ title, slug, isSearch }) {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") || "";
  const min = searchParams.get("min") || 0;
  const max = searchParams.get("max") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const baseUrl = isSearch
    ? `/search?search=${search}&page=${page}&min=${min}&max=${max}`
    : `/category/${slug}?page=${page}&min=${min}&max=${max}`;

  const sortingOptions = [
    { label: "Relevance", sort: "" },
    { label: "Price: Low to High", sort: "asc" },
    { label: "Price: High to Low", sort: "desc" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      {/* Title */}
      <h2 className="text-lg md:text-2xl font-medium text-slate-900 dark:text-slate-100">
        {isSearch && "Search Results - "}
        {title}
      </h2>

      {/* Sorting Dropdown Style */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-300">Sort by:</span>

        <select
          className="border rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          value={sortParam}
          onChange={(e) => {
            const sort = e.target.value;
            window.location.href = sort
              ? `${baseUrl}&sort=${sort}`
              : baseUrl;
          }}
        >
          {sortingOptions.map((opt) => (
            <option key={opt.sort} value={opt.sort}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
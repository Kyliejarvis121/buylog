"use client";
import { Circle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { getPriceRanges } from "@/lib/priceRanges";

export default function PriceFilter({ slug, isSearch }) {
  const searchParams = useSearchParams();
  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "asc";
  const page = parseInt(searchParams.get("page")) || 1;
  const router = useRouter();
  const { handleSubmit, reset, register } = useForm();

  // 👇 Category-based ranges (Jiji-style)
  const priceRanges = getPriceRanges(slug);

  function onSubmit(data) {
    const { min, max } = data;

    router.push(
      `/category/${slug}?page=${page}&sort=${sort}&min=${min || ""}&max=${max || ""}`
    );

    reset();
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Price
        </h2>

        <Link
          className="text-xs text-lime-700 hover:underline"
          href={isSearch ? `/search?search=${search}` : `/category/${slug}`}
        >
          Reset
        </Link>
      </div>

      {/* Filter Links */}
      <div className="flex flex-col gap-2">
        {priceRanges.map((range) => {
          const active =
            (range.min && range.min == minParam) ||
            (range.max && range.max == maxParam) ||
            (range.min && range.max && range.min == minParam && range.max == maxParam);

          return (
            <Link
              key={range.label}
              href={
                isSearch
                  ? `?${new URLSearchParams({
                      search,
                      page,
                      sort,
                      min: range.min || "",
                      max: range.max || "",
                    })}`
                  : `?${new URLSearchParams({
                      page,
                      sort,
                      min: range.min || "",
                      max: range.max || "",
                    })}`
              }
              className={`flex items-center gap-2 text-sm ${
                active
                  ? "text-lime-600 font-medium"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <Circle className="w-4 h-4 flex-shrink-0" />
              {range.label}
            </Link>
          );
        })}
      </div>

      {/* Manual Range */}
      {isSearch ? null : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-3 mt-4"
        >
          <input
            {...register("min")}
            type="number"
            placeholder="Min"
            className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />

          <input
            {...register("max")}
            type="number"
            placeholder="Max"
            className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />

          <button
            type="submit"
            className="col-span-2 bg-lime-600 text-white py-2 rounded text-sm"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}
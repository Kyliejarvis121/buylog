"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Paginate({ totalPages, isSearch }) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "asc";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const search = searchParams.get("search");
  const currentPage = Number(searchParams.get("page")) || 1;

  function buildUrl(page) {
    const params = new URLSearchParams({
      page,
      sort,
      min,
      max,
    });

    if (isSearch) {
      params.set("search", search || "");
    }

    return `?${params.toString()}`;
  }

  return (
    <Pagination>
      <PaginationContent>

        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? buildUrl(currentPage - 1) : buildUrl(1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Pages */}
        {totalPages <= 5 ? (
          Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href={buildUrl(i + 1)}
                isActive={i + 1 === currentPage}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <>
            {/* First few */}
            {Array.from({ length: 3 }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={buildUrl(i + 1)}
                  isActive={i + 1 === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            {/* Last page */}
            <PaginationItem>
              <PaginationLink
                href={buildUrl(totalPages)}
                isActive={totalPages === currentPage}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages
                ? buildUrl(currentPage + 1)
                : buildUrl(totalPages)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}
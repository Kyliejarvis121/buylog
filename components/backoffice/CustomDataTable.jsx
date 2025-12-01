"use client";
import React, { useState } from "react";

export default function CustomDataTable({ data, type }) {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentlyDisplayedData = data?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((data?.length || 0) / PAGE_SIZE);
  const itemStartIndex = startIndex + 1;
  const itemEndIndex = Math.min(startIndex + PAGE_SIZE, data?.length || 0);

  // Define columns based on type
  let columns = [];
  if (type === "farmers") {
    columns = [
      { header: "Name", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "Phone", accessor: "phone" },
      { header: "Active", accessor: "isActive", cell: (row) => (row.isActive ? "Yes" : "No") },
      { header: "Status", accessor: "status" },
      { header: "Created At", accessor: "createdAt" },
    ];
  } else if (type === "users") {
    columns = [
      { header: "Name", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "Role", accessor: "role" },
      { header: "Verified", accessor: "emailVerified", cell: (row) => (row.emailVerified ? "Yes" : "No") },
      { header: "Created At", accessor: "createdAt" },
    ];
  } else if (type === "orders") {
    columns = [
      { header: "Order Number", accessor: "orderNumber" },
      { header: "Customer", accessor: "firstName" },
      { header: "Status", accessor: "status" },
      { header: "Created At", accessor: "createdAt" },
    ];
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50 px-4">{type}</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="px-6 py-3">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentlyDisplayedData.map((row, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-6 py-4">
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav className="flex items-center justify-between p-4" aria-label="Table navigation">
          <span className="text-gray-500 dark:text-gray-400">
            Showing {itemStartIndex}-{itemEndIndex} of {data?.length || 0}
          </span>
          <div className="inline-flex">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-l"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-r"
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

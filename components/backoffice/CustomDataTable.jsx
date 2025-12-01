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

  // Define columns inside the client component
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
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentlyDisplayedData.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {col.cell ? col.cell(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

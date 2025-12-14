"use client";

import React from "react";
import DataTable from "@/components/data-table-components/DataTable";

export const columns = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Category",
    accessorKey: "category.title",
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (info) => `$${info.getValue()?.toFixed(2) || "0.00"}`,
  },
  {
    header: "Stock",
    accessorKey: "productStock",
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (info) => (info.getValue() ? "Active" : "Inactive"),
  },
];

export default function FarmerProductsTable({ products }) {
  return <DataTable data={products} columns={columns} />;
}

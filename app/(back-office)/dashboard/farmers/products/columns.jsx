// app/backoffice/dashboard/farmers/products/columns.js
import { ColumnDef } from "@tanstack/react-table";

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
    cell: (info) => `$${info.getValue().toFixed(2)}`,
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

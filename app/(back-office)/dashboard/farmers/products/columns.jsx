// app/(back-office)/dashboard/farmers/products/columns.js
"use client";

import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import Status from "@/components/DataTableColumns/Status";
import DateColumn from "@/components/DataTableColumns/DateColumn";

export const columns = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="imageUrl" />,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortableColumn column={column} title="Title" />,
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "productStock",
    header: "Stock",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <Status row={row} accessorKey="isActive" />,
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <ActionColumn
  row={row}
  title="Product"
  editEndpoint={`/dashboard/farmers/products/edit/${product.id}`}
  endpoint={`/api/farmers/products/${product.id}`}
/>


      );
    },
  },  
];

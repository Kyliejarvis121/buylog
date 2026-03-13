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
    accessorKey: "farmer",
    header: "Farmer",
    cell: ({ row }) => row.original.farmer?.name || "—", // ✅ display farmer name
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.title || "—", // ✅ display category title
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `UGX ${row.original.salePrice ?? row.original.price}`,
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
          editEndpoint={`admin/products/update/${product.id}`} // updated for admin
          endpoint={`admin/products/${product.id}`}
        />
      );
    },
  },
];

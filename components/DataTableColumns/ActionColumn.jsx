"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import DeleteBtn from "../Actions/DeleteBtn";
import EditBtn from "../Actions/EditBtn";

/**
 * ActionColumn
 * @param {object} row - Row object from the table
 * @param {string} title - Title to show in Delete/Edit buttons
 * @param {string} editEndpoint - Endpoint for editing the product
 * @param {boolean} isFarmer - Whether this row belongs to a farmer (default: false)
 */
export default function ActionColumn({ row, title, editEndpoint, isFarmer = false }) {
  const product = row.original;

  // If no product ID, hide the column
  if (!product?.id) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Delete button */}
        <DropdownMenuItem>
          <DeleteBtn id={product.id} title={title} isFarmer={isFarmer} />
        </DropdownMenuItem>

        {/* Edit button */}
        <DropdownMenuItem>
          <EditBtn title={title} editEndpoint={editEndpoint} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

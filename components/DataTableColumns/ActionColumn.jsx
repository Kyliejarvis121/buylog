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
import { useRouter } from "next/navigation";
import DeleteBtn from "@/components/Actions/DeleteBtn";

export default function ActionColumn({
  row,
  title = "Item",
  editBasePath,
  type,
}) {
  const router = useRouter();
  const item = row.original;

  if (!item?.id) return null;

  const handleEdit = () => {
    if (!editBasePath) {
      console.warn("editBasePath is missing");
      return;
    }

    router.push(`${editBasePath}/${item.id}`);
  };

  // ✅ only allow valid delete types
  const validDeleteTypes = ["customer", "farmerProduct", "product"];
  const deleteType = validDeleteTypes.includes(type) ? type : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* EDIT (dropdown item) */}
        <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
          Edit
        </DropdownMenuItem>

        {/* DELETE (only if valid type) */}
        {deleteType && (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DeleteBtn id={item.id} title={title} type={deleteType} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
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
  const item = row?.original;

  if (!item?.id) return null;

  const handleEdit = () => {
    if (!editBasePath) return;
    router.push(`${editBasePath}/${item.id}`);
  };

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

        {/* EDIT */}
        {editBasePath && (
          <DropdownMenuItem onClick={handleEdit}>
            Edit
          </DropdownMenuItem>
        )}

        {/* DELETE */}
        {type && (
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()} // prevent dropdown auto close issue
          >
            <DeleteBtn
              id={item.id}
              title={title}
              type={type}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
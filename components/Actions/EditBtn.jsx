"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function EditBtn({ editEndpoint }) {
  const router = useRouter();

  const handleEdit = () => {
    if (!editEndpoint.startsWith("/")) {
      router.push(`/${editEndpoint}`);
    } else {
      router.push(editEndpoint);
    }
  };

  return (
    <button
      onClick={handleEdit}
      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
    >
      <Pencil className="w-4 h-4" />
      Edit
    </button>
  );
}

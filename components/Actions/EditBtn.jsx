"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function EditBtn({ editEndpoint }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 text-sm"
      onClick={() => router.push(editEndpoint)}
    >
      <Pencil className="h-4 w-4" />
      Edit
    </button>
  );
}

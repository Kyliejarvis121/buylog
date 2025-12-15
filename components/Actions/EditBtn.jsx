"use client";

import { useRouter } from "next/navigation";

export default function EditBtn({ editEndpoint }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/${editEndpoint}`)}
      className="text-blue-600 hover:underline"
    >
      Edit
    </button>
  );
}

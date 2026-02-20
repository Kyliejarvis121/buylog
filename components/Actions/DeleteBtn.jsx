"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function DeleteBtn({ endpoint, title }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!endpoint) {
      toast.error("Delete endpoint is missing");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this ${title}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/${endpoint}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Delete failed");
      }

      toast.success(`${title} deleted successfully`);
      router.refresh();
    } catch (error) {
      console.error("DELETE ERROR:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 text-red-600 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {loading ? "Deleting..." : `Delete ${title}`}
    </button>
  );
}
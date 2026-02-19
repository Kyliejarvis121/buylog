"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function DeleteBtn({ id, title }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    // Confirm deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      // Call your DELETE API
      const res = await fetch(`/api/farmer/product/${id}`, {
        method: "DELETE",
      });

      // Parse response
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Delete failed");

      toast.success(`${title} deleted successfully`);
      
      // Refresh page or table
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
      className="font-medium text-red-600 dark:text-red-500 flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      <span>{loading ? "Deleting..." : `Delete ${title}`}</span>
    </button>
  );
}

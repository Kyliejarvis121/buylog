"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

export default function DeleteBtn({
  id,
  title = "Item",
  type,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!id) {
      toast.error("ID is missing");
      return;
    }

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

      // ✅ Clean endpoint mapping
      const endpoints = {
        customer: `/api/customers/${id}`,
        farmerProduct: `/api/farmers/products/${id}`,
        product: `/api/products/${id}`,
      };

      const endpoint = endpoints[type];

      if (!endpoint) {
        throw new Error("Invalid delete type");
      }

      const res = await fetch(endpoint, { method: "DELETE" });

      const data = await res.json().catch(() => ({}));

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
      className="font-medium text-red-600 flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      <span>{loading ? "Deleting..." : `Delete ${title}`}</span>
    </button>
  );
}
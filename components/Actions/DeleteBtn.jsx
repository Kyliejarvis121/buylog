"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

export default function DeleteBtn({
  id,
  title = "Item",
  type = "product", // "product" | "farmerProduct" | "customer"
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

      // ✅ Determine endpoint safely
      let endpoint = "";

      switch (type) {
        case "farmerProduct":
          endpoint = `/api/farmers/products/${id}`;
          break;

        case "customer":
          endpoint = `/api/admin/customers/${id}`;
          break;

        default:
          endpoint = `/api/products/${id}`;
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      // ✅ SAFE JSON parsing (prevents JSON.parse crash)
      let data = {};
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = {};
        }
      }

      if (!res.ok) {
        throw new Error(data?.message || "Delete failed");
      }

      toast.success(`${title} deleted successfully`);

      // Refresh page properly
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
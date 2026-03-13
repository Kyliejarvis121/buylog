// app/dashboard/staff/[id]/page.jsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import { prisma } from "@/lib/prismadb";
import { notFound } from "next/navigation";

export default async function UpdateStaff({ params }) {
  const { id } = params;

  let staff;

  try {
    staff = await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching staff: {error.message}
      </div>
    );
  }

  if (!staff) return notFound();

  async function updateStaff(formData) {
    "use server";

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const role = formData.get("role");

    await prisma.user.update({
      where: { id },
      data: { name, email, phone, role },
    });
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Update Staff</h2>

      <form action={updateStaff} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={staff.name}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={staff.email}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            defaultValue={staff.phone || ""}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            defaultValue={staff.role}
            className="w-full p-2 border rounded"
            required
          >
            <option value="ADMIN">Admin</option>
            <option value="FARMER">Farmer</option>
            <option value="USER">User</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Staff
        </button>
      </form>
    </div>
  );
}

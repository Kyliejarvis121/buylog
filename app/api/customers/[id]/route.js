import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ===============================
   DELETE CUSTOMER
=============================== */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        farmers: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // 2️⃣ PROTECT ADMIN ACCOUNTS
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

    // 3️⃣ Delete related records FIRST (IMPORTANT)
    if (user.orders.length > 0) {
      await prisma.order.deleteMany({
        where: { userId: id },
      });
    }

    if (user.farmers.length > 0) {
      await prisma.farmer.deleteMany({
        where: { userId: id },
      });
    }

    // 4️⃣ Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete customer", error: error.message },
      { status: 500 }
    );
  }
}

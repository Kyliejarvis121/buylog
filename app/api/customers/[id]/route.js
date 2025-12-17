import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ===============================
   GET SINGLE CUSTOMER
=============================== */
export async function GET(req, { params: { id } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        farmers: true, // include if needed
        orders: true,  // include if needed
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

/* ===============================
   DELETE CUSTOMER
=============================== */
export async function DELETE(req, { params: { id } }) {
  try {
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

    // Prevent deleting admin accounts
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

    // Delete related orders and farmers first
    if (user.orders.length > 0) {
      await prisma.order.deleteMany({ where: { userId: id } });
    }

    if (user.farmers.length > 0) {
      await prisma.farmer.deleteMany({ where: { userId: id } });
    }

    // Delete the user
    await prisma.user.delete({ where: { id } });

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

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ==================================
   GET SINGLE CUSTOMER
================================== */
export async function GET(req, { params }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { message: "Missing user ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        farmers: true,
        orders: true,
        accounts: true,   // for NextAuth safety
        sessions: true,   // for NextAuth safety
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
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch customer", error: error.message },
      { status: 500 }
    );
  }
}


/* ==================================
   DELETE CUSTOMER
================================== */
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { message: "Missing user ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // 🚫 Prevent deleting admin
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

    /* =============================
       DELETE ALL RELATED DATA FIRST
    ============================== */

    // If using NextAuth
    await prisma.session.deleteMany({
      where: { userId: id },
    });

    await prisma.account.deleteMany({
      where: { userId: id },
    });

    // Your relations
    await prisma.order.deleteMany({
      where: { userId: id },
    });

    await prisma.farmer.deleteMany({
      where: { userId: id },
    });

    // Finally delete user
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
      {
        message: "Failed to delete customer",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
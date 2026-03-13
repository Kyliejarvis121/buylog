import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ==================================
   GET SINGLE CUSTOMER
================================== */
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        farmers: true,
        orders: true,
        accounts: true,
        sessions: true,
        profile: true,
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
    return NextResponse.json(
      { message: "Failed to fetch customer", error: error.message },
      { status: 500 }
    );
  }
}

/* ==================================
   DELETE CUSTOMER (SAFE ORDER)
================================== */
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

    // ✅ SAFE ORDER (messages → chats → others → user)

    await prisma.$transaction([
      // 1. messages linked to chats
      prisma.message.deleteMany({
        where: {
          chat: {
            buyerId: id,
          },
        },
      }),

      // 2. chats
      prisma.chat.deleteMany({
        where: { buyerId: id },
      }),

      // 3. orders
      prisma.order.deleteMany({ where: { userId: id } }),

      // 4. farmer profile (if exists)
      prisma.farmer.deleteMany({ where: { userId: id } }),

      // 5. profile
      prisma.profile.deleteMany({ where: { userId: id } }),

      // 6. sessions & accounts
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.account.deleteMany({ where: { userId: id } }),

      // 7. finally user
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete customer",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
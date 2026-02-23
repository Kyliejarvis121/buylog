import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* GET SINGLE CUSTOMER */
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

/* DELETE CUSTOMER */
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

    // ❌ Prevent deleting admin
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

    // 🔥 CLEAN UP RELATED DATA (MongoDB safe)
    await prisma.session.deleteMany({ where: { userId: id } });
    await prisma.account.deleteMany({ where: { userId: id } });
    await prisma.profile.deleteMany({ where: { userId: id } });
    await prisma.order.deleteMany({ where: { userId: id } });
    await prisma.farmer.deleteMany({ where: { userId: id } });
    await prisma.chat.deleteMany({ where: { buyerId: id } });
    await prisma.message.deleteMany({ where: { senderUserId: id } });

    // Finally delete user
    await prisma.user.delete({ where: { id } });

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
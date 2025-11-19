import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    // If you want all orders for a user
    const orders = await prisma.orders.findMany({
      where: {
        userId: id,
      },
      include: {
        orderItems: true, // Make sure the relation exists
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch user orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
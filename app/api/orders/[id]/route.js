import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json(
        { data: null, message: "Order not found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch an Order",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { data: null, message: "Order Not Found" },
        { status: 404 }
      );
    }

    const deletedOrder = await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ data: deletedOrder });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      {
        message: "Failed to Delete an Order",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

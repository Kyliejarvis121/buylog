import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET a single order
export async function GET(request, { params: { id } }) {
  try {
    const order = await prisma.order.findUnique({ where: { id }, include: { orderItems: true, user: true } });
    if (!order) return NextResponse.json({ data: null, message: "Order not found" }, { status: 200 });
    return NextResponse.json({ data: order });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch order", error: error.message }, { status: 500 });
  }
}

// DELETE an order
export async function DELETE(request, { params: { id } }) {
  try {
    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) return NextResponse.json({ data: null, message: "Order not found" }, { status: 404 });

    const deletedOrder = await prisma.order.delete({ where: { id } });
    return NextResponse.json({ data: deletedOrder, message: "Order deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete order", error: error.message }, { status: 500 });
  }
}

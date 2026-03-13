import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const orders = await prisma.order.findMany({ where: { userId: id }, include: { orderItems: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: orders });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch user orders", error: error.message }, { status: 500 });
  }
}

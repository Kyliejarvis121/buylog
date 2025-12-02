// Route: /api/orders
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all orders with pagination
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, orderItems: true },
      skip,
      take: limit,
    });

    const total = await prisma.order.count();

    return NextResponse.json({
      success: true,
      data: orders,     // ALWAYS array
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],        // MUST be array
        message: "Failed to fetch orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: create an order
export async function POST(request) {
  try {
    const { checkoutFormData, orderItems } = await request.json();

    if (!checkoutFormData || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, data: [], message: "Invalid payload" },
        { status: 400 }
      );
    }

    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      city,
      district,
      country,
      shippingCost,
      paymentMethod,
    } = checkoutFormData;

    // Generate unique order number
    const orderNumber = Array.from({ length: 10 }, () =>
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]
    ).join("");

    const resultOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          firstName,
          lastName,
          email,
          phone,
          streetAddress,
          city,
          district,
          country,
          shippingCost: Number(shippingCost) || 0,
          paymentMethod,
          orderNumber,
          status: "pending",
        },
      });

      const itemsToCreate = orderItems.map((it) => ({
        orderId: newOrder.id,
        productId: it.id,
        vendorId: it.vendorId ?? it.vendor ?? null,
        quantity: Number(it.qty ?? it.quantity ?? 1),
        price: Number(it.salePrice ?? it.price ?? 0),
        title: it.title ?? it.name ?? "",
        imageUrl: it.imageUrl ?? it.image ?? null,
      }));

      if (itemsToCreate.length > 0) {
        await tx.orderItem.createMany({ data: itemsToCreate });
      }

      return newOrder;
    });

    const orderWithItems = await prisma.order.findUnique({
      where: { id: resultOrder.id },
      include: { orderItems: true, user: true },
    });

    return NextResponse.json({
      success: true,
      data: orderWithItems ? [orderWithItems] : [],   // ALWAYS array
      message: "Order created",
    });
  } catch (error) {
    console.error("POST /api/orders failed:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],         // MUST be array
        message: "Failed to create order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

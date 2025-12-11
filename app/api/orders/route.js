// Route: /api/orders
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ===============================
// GET ALL ORDERS
// ===============================
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const total = await prisma.order.count();

    return NextResponse.json({
      success: true,
      data: orders,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===============================
// CREATE AN ORDER
// ===============================
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

    // Generate random order number
    const orderNumber = Array.from({ length: 10 }, () =>
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]
    ).join("");

    const createdOrder = await prisma.$transaction(async (tx) => {
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
          totalAmount: 0,
        },
      });

      const itemsToCreate = orderItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.id,
        quantity: Number(item.qty ?? item.quantity ?? 1),
        price: Number(item.salePrice ?? item.price ?? 0),
      }));

      if (itemsToCreate.length > 0) {
        await tx.orderItem.createMany({ data: itemsToCreate });
      }

      return newOrder;
    });

    const orderWithItems = await prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: orderWithItems ? [orderWithItems] : [],
      message: "Order created",
    });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to create order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

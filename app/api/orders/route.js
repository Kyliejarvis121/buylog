// Route: /api/orders
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

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
      data: orders,
      total,
      page,
      limit,
      message: `Fetched ${orders.length} orders out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

// POST: create an order
export async function POST(request) {
  try {
    const { checkoutFormData, orderItems } = await request.json();

    if (!checkoutFormData || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json({ data: null, message: "Invalid payload" }, { status: 400 });
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

    // generate order number
    const orderNumber = Array.from({ length: 10 }, () =>
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]
    ).join("");

    const resultOrder = await prisma.$transaction(async (tx) => {
      // create main order
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

      // map order items
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

    // fetch order with items and user
    const orderWithItems = await prisma.order.findUnique({
      where: { id: resultOrder.id },
      include: { orderItems: true, user: true },
    });

    if (!orderWithItems) {
      return NextResponse.json(
        { data: null, message: "Order created but failed to retrieve details" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: orderWithItems, message: "Order created" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json({ data: null, message: "Failed to create order", error: error.message }, { status: 500 });
  }
}

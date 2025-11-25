import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/**
 * GET: Return all orders (admin)
 * POST: Create order + order items (and sales records when sales model exists)
 */

export async function GET() {
  try {
    // Fetch orders with related user and items
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        orderItems: true,
      },
    });

    // Sanitize/serialize (avoid Prisma runtime issues)
    const safe = JSON.parse(JSON.stringify(orders));

    return NextResponse.json({ data: safe, message: "Orders fetched successfully" });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch orders", error: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { checkoutFormData, orderItems } = await request.json();

    if (!checkoutFormData || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json(
        { data: null, message: "Invalid payload: checkoutFormData and orderItems are required" },
        { status: 400 }
      );
    }

    const {
      city,
      country,
      district,
      email,
      firstName,
      lastName,
      paymentMethod,
      phone,
      shippingCost,
      streetAddress,
      userId,
    } = checkoutFormData;

    // generate short random order number
    const generateOrderNumber = (length = 8) => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let res = "";
      for (let i = 0; i < length; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
      return res;
    };

    const orderNumber = generateOrderNumber(10);

    // Create order + items inside a transaction
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
          shippingCost: shippingCost != null ? Number(shippingCost) : 0,
          paymentMethod,
          orderNumber,
          status: "pending",
        },
      });

      // create orderItems (use createMany for speed)
      const itemsToCreate = orderItems.map((it) => ({
        orderId: newOrder.id,
        productId: it.id,
        vendorId: it.vendorId ?? it.vendor ?? null,
        quantity: Number(it.qty ?? it.quantity ?? 1),
        price: Number(it.salePrice ?? it.price ?? 0),
        title: it.title ?? it.name ?? "",
        imageUrl: it.imageUrl ?? it.image ?? null,
      }));

      // createMany doesn't set createdAt individually, but it's fine for simple items
      if (itemsToCreate.length > 0) {
        await tx.orderItem.createMany({
          data: itemsToCreate,
        });
      }

      return newOrder;
    });

    // Create sales records if sales model exists
    try {
      if (prisma.sales) {
        const salesPayload = orderItems.map((it) => ({
          orderId: resultOrder.id,
          productId: it.id,
          productTitle: it.title ?? it.name ?? "",
          productImage: it.imageUrl ?? it.image ?? "",
          productPrice: Number(it.salePrice ?? it.price ?? 0),
          productQty: Number(it.qty ?? it.quantity ?? 1),
          vendorId: it.vendorId ?? it.vendor ?? null,
          total: (Number(it.salePrice ?? it.price ?? 0) * Number(it.qty ?? it.quantity ?? 1)) || 0,
          createdAt: new Date(), // optional
        }));

        // Use createMany if available
        await prisma.sales.createMany({
          data: salesPayload,
        });
      }
    } catch (salesErr) {
      // non-fatal — log but don't fail the whole request (sales model might not exist)
      console.warn("Could not create sales records (non-fatal):", salesErr?.message ?? salesErr);
    }

    // Fetch the full order with items to return
    const orderWithItems = await prisma.order.findUnique({
      where: { id: resultOrder.id },
      include: { orderItems: true, user: true },
    });

    return NextResponse.json({ data: JSON.parse(JSON.stringify(orderWithItems)), message: "Order created" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create order", error: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

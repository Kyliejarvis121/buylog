import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { checkoutFormData, orderItems } = await request.json();
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

    // Generate order number
    function generateOrderNumber(length) {
      const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let orderNumber = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderNumber += characters.charAt(randomIndex);
      }
      return orderNumber;
    }

    // Create order
    const newOrder = await prisma.orders.create({
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        streetAddress,
        city,
        country,
        district,
        shippingCost: parseFloat(shippingCost),
        paymentMethod,
        orderNumber: generateOrderNumber(8),
      },
    });

    // Create order items
    const newOrderItems = await prisma.orderItems.createMany({
      data: orderItems.map((item) => ({
        productId: item.id,
        vendorId: item.vendorId,
        quantity: parseInt(item.qty),
        price: parseFloat(item.salePrice),
        orderId: newOrder.id,
        imageUrl: item.imageUrl,
        title: item.title,
      })),
    });

    console.log(newOrder, newOrderItems);
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { message: "Failed to create Order", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { date: "desc" },
      include: { orderItems: true }, // Make sure the relation exists in your schema
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch Orders", error: error.message },
      { status: 500 }
    );
  }
}

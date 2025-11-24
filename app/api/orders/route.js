import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET ALL ORDERS (ADMIN)
export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,        // user details
        orderItems: true,  // items inside each order
      },
    });

    return NextResponse.json({
      data: orders,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error.message);
    return NextResponse.json(
      {
        message: "Failed to fetch orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE ORDER
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
    const generateOrderNumber = (length) => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const orderNumber = generateOrderNumber(10);

    // Transaction
    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
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
          shippingCost,
          paymentMethod,
          orderNumber,
          status: "pending",
        },
      });

      await tx.orderItems.createMany({
        data: orderItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.id,
          vendorId: item.vendorId,
          quantity: item.qty,
          price: item.salePrice,
          title: item.title,
          imageUrl: item.imageUrl,
        })),
      });

      await Promise.all(
        orderItems.map((item) =>
          tx.sales.create({
            data: {
              orderId: newOrder.id,
              productId: item.id,
              productTitle: item.title,
              productImage: item.imageUrl,
              productPrice: item.salePrice,
              productQty: item.qty,
              vendorId: item.vendorId,
              total: item.salePrice * item.qty,
            },
          })
        )
      );

      return newOrder;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error.message);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}

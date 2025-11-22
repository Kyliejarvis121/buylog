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
    const generateOrderNumber = (length) => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const orderNumber = generateOrderNumber(10);

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create order
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

      // 2️⃣ Create order items
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

      // 3️⃣ Create sales records
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
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}

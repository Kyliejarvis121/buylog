// app/api/products/route.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE product
export async function POST(request) {
  try {
    const body = await request.json();

    const { title, description, price, quantity, location, farmerId } = body;

    if (!title || !price || !farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        quantity: Number(quantity),
        location,
        farmerId,
      },
    });

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

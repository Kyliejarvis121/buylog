import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const farmers = await prisma.farmers.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json({
      data: farmers,
      message: "Farmers fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const existingUser = await prisma.users.findUnique({
      where: { id: data.userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User not found" },
        { status: 404 }
      );
    }

    const farmer = await prisma.farmers.create({
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        physicalAddress: data.physicalAddress,
        isActive: data.isActive ?? true,
        products: data.products || [],
        landSize: parseFloat(data.landSize) || 0,
        mainCrop: data.mainCrop ?? "",
        userId: data.userId,
      },
    });

    return NextResponse.json({
      data: farmer,
      message: "Farmer created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, message: error.message },
      { status: 500 }
    );
  }
}

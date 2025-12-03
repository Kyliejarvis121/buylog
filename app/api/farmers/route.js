import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Auto-generate code if not provided
    const code = data.code || "FR" + Math.floor(Math.random() * 1000000);

    const farmer = await prisma.farmer.create({
      data: {
        code,
        name: data.name || user.name,
        email: data.email || user.email,
        phone: data.phone || "",
        physicalAddress: data.physicalAddress || "",
        isActive: data.isActive || false,
        status: "pending",
        products: data.products || [],
        landSize: Number(data.landSize) || 0,
        mainCrop: data.mainCrop || "",
        userId: data.userId,
      },
    });

    return NextResponse.json(
      { success: true, data: farmer, message: "Farmer registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/farmers failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to register farmer",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

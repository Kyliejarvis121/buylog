import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const farmers = await prisma.farmerProfile.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }, // include related user info
    });

    return NextResponse.json({ data: farmers, message: "Farmers fetched successfully" });
  } catch (error) {
    console.error("GET /api/farmers failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch farmers", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Check if the related user exists
    const existingUser = await prisma.users.findUnique({ where: { id: data.userId } });
    if (!existingUser) {
      return NextResponse.json({ data: null, message: "User not found" }, { status: 404 });
    }

    const newFarmer = await prisma.farmerProfile.create({
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        physicalAddress: data.physicalAddress,
        isActive: data.isActive ?? true,
        products: data.products || [],
        landSize: parseFloat(data.landSize) || 0,
        mainCrop: data.mainCrop || "",
        userId: data.userId,
      },
    });

    return NextResponse.json({ data: newFarmer, message: "Farmer created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/farmers failed:", error);
    return NextResponse.json({ data: null, message: "Failed to create farmer", error: error.message }, { status: 500 });
  }
}

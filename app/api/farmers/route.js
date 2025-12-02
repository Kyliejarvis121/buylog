// Route: app/api/farmers/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET all farmers (supports ?includeInactive=true)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const farmers = await prisma.farmer.findMany({
      where: includeInactive ? {} : { isActive: true }, // filter if needed
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    // Normalize output (flatten fields so tables never break)
    const cleanFarmers = farmers.map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      phone: f.phone,
      isActive: f.isActive,
      status: f.status,
      createdAt: f.createdAt,
      userId: f.userId,
    }));

    return NextResponse.json({
      success: true,
      data: cleanFarmers,
    });
  } catch (error) {
    console.error("GET /api/farmers failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch farmers",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create farmer
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate user
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const farmer = await prisma.farmer.create({
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        physicalAddress: data.physicalAddress,
        isActive: false,
        status: "pending",
        products: data.products ?? [],
        landSize: Number(data.landSize) || 0,
        mainCrop: data.mainCrop ?? "",
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

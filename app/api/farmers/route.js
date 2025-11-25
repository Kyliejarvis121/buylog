export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// ---------------------------
// GET all farmers
// ---------------------------
export async function GET() {
  try {
    const farmers = await prisma.farmers.findMany({
      orderBy: { createdAt: "desc" }, // change if your schema uses created_at
      include: { user: true }, // change if relation field is different
    });

    return NextResponse.json({ data: farmers, message: "Farmers fetched successfully" });
  } catch (error) {
    console.error("GET /api/farmers error:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch farmers", error: error.message },
      { status: 500 }
    );
  }
}

// ---------------------------
// POST create farmer
// ---------------------------
export async function POST(request) {
  try {
    const data = await request.json();

    const user = await prisma.users.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json({ data: null, message: "User not found" }, { status: 404 });
    }

    const farmer = await prisma.farmers.create({
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
      { data: farmer, message: "Farmer registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/farmers error:", error);
    return NextResponse.json(
      { data: null, message: "Failed to register farmer", error: error.message },
      { status: 500 }
    );
  }
}

// ---------------------------
// PUT update farmer
// ---------------------------
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const farmer = await prisma.farmers.findUnique({ where: { id } });

    if (!farmer) {
      return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });
    }

    const updated = await prisma.farmers.update({
      where: { id },
      data: {
        isActive: data.isActive ?? farmer.isActive,
        status: data.status ?? farmer.status,
      },
    });

    return NextResponse.json({ data: updated, message: "Farmer updated successfully" });
  } catch (error) {
    console.error("PUT /api/farmers error:", error);
    return NextResponse.json(
      { data: null, message: "Failed to update farmer", error: error.message },
      { status: 500 }
    );
  }
}

// ---------------------------
// DELETE farmer
// ---------------------------
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const farmer = await prisma.farmers.findUnique({ where: { id } });

    if (!farmer) {
      return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });
    }

    const deleted = await prisma.farmers.delete({ where: { id } });

    return NextResponse.json({
      data: deleted,
      message: "Farmer deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/farmers error:", error);
    return NextResponse.json(
      { data: null, message: "Failed to delete farmer", error: error.message },
      { status: 500 }
    );
  }
}

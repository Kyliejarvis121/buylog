import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// ---------------------------
// GET /api/farmers
// Fetch all farmers (admin)
// ---------------------------
export async function GET() {
  try {
    const farmers = await prisma.farmers.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }, // include related user info
    });

    return NextResponse.json({ data: farmers, message: "Farmers fetched successfully" });
  } catch (error) {
    console.error("GET /api/farmers failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch farmers", error: error.message }, { status: 500 });
  }
}

// ---------------------------
// POST /api/farmers
// Register a new farmer
// ---------------------------
export async function POST(request) {
  try {
    const data = await request.json();

    // Check if related user exists
    const existingUser = await prisma.users.findUnique({ where: { id: data.userId } });
    if (!existingUser) {
      return NextResponse.json({ data: null, message: "User not found" }, { status: 404 });
    }

    const newFarmer = await prisma.farmers.create({
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        physicalAddress: data.physicalAddress,
        isActive: false,         // pending by default
        status: "pending",
        products: data.products || [],
        landSize: parseFloat(data.landSize) || 0,
        mainCrop: data.mainCrop || "",
        userId: data.userId,
      },
    });

    return NextResponse.json({ data: newFarmer, message: "Farmer registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/farmers failed:", error);
    return NextResponse.json({ data: null, message: "Failed to register farmer", error: error.message }, { status: 500 });
  }
}

// ---------------------------
// PUT /api/farmers/:id
// Approve or reject a farmer (admin)
// ---------------------------
export async function PUT(request, { params: { id } }) {
  try {
    const data = await request.json(); // { isActive: true/false, status: "approved"/"rejected" }

    const existingFarmer = await prisma.farmers.findUnique({ where: { id } });
    if (!existingFarmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });

    const updatedFarmer = await prisma.farmers.update({
      where: { id },
      data: {
        isActive: data.isActive ?? existingFarmer.isActive,
        status: data.status ?? existingFarmer.status,
      },
    });

    return NextResponse.json({ data: updatedFarmer, message: "Farmer updated successfully" });
  } catch (error) {
    console.error("PUT /api/farmers/:id failed:", error);
    return NextResponse.json({ data: null, message: "Failed to update farmer", error: error.message }, { status: 500 });
  }
}

// ---------------------------
// DELETE /api/farmers/:id
// Remove a farmer
// ---------------------------
export async function DELETE(request, { params: { id } }) {
  try {
    const existingFarmer = await prisma.farmers.findUnique({ where: { id } });
    if (!existingFarmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });

    const deletedFarmer = await prisma.farmers.delete({ where: { id } });

    return NextResponse.json({ data: deletedFarmer, message: "Farmer deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/farmers/:id failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete farmer", error: error.message }, { status: 500 });
  }
}

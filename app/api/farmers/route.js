import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// ==========================
// GET all farmers
// ==========================
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" }
    });

    const mapped = farmers.map(f => ({
      id: f.id,
      name: f.name,
      phone: f.phone,
      address: f.address,
      status: f.status,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("FARMER GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching farmers" },
      { status: 500 }
    );
  }
}

// ==========================
// CREATE farmer
// ==========================
export async function POST(req) {
  try {
    const { name, phone, address, status } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const farmer = await prisma.farmer.create({
      data: {
        name,
        phone,
        address: address || "",
        status: status || "active",
      },
    });

    return NextResponse.json({
      success: true,
      data: farmer,
      message: "Farmer created successfully",
    });
  } catch (error) {
    console.error("FARMER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error creating farmer", error: error.message },
      { status: 500 }
    );
  }
}

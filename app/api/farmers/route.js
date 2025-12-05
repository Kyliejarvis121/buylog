import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET all farmers
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: farmers });
  } catch (error) {
    console.error("FETCH FARMERS ERROR:", error);
    return NextResponse.json({ success: false, message: "Error fetching farmers" }, { status: 500 });
  }
}

// CREATE farmer
export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, phone, physicalAddress, userId, isActive } = data;

    if (!name || !userId) return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });

    const farmer = await prisma.farmer.create({
      data: {
        name,
        email,
        phone,
        physicalAddress,
        userId,
        isActive: Boolean(isActive),
      }
    });

    return NextResponse.json({ success: true, data: farmer, message: "Farmer created successfully" });
  } catch (error) {
    console.error("FARMER CREATE ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error creating farmer", error: error.message }, { status: 500 });
  }
}

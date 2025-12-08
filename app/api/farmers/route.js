import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET all farmers
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        products: true, // optional: include products of each farmer
      },
    });
    return NextResponse.json({ success: true, data: farmers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST new farmer (optional)
export async function POST(req) {
  try {
    const { name, email, phone, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newFarmer = await prisma.farmer.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        userId,
      },
    });

    return NextResponse.json({ success: true, data: newFarmer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

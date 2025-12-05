import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET single farmer
export async function GET(req, context) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ message: "Farmer ID required" }, { status: 400 });

  try {
    const farmer = await prisma.farmer.findUnique({ where: { id } });
    if (!farmer) return NextResponse.json({ message: "Farmer not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: farmer });
  } catch (error) {
    console.error("GET FARMER ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error fetching farmer", error: error.message }, { status: 500 });
  }
}

// UPDATE farmer
export async function PUT(req, context) {
  const { id } = context.params;
  const data = await req.json();

  try {
    const farmer = await prisma.farmer.findUnique({ where: { id } });
    if (!farmer) return NextResponse.json({ message: "Farmer not found" }, { status: 404 });

    const updated = await prisma.farmer.update({
      where: { id },
      data: {
        ...data,
      }
    });

    return NextResponse.json({ success: true, data: updated, message: "Farmer updated" });

  } catch (error) {
    console.error("UPDATE FARMER ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error updating farmer", error: error.message }, { status: 500 });
  }
}

// DELETE farmer
export async function DELETE(req, context) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ message: "Farmer ID required" }, { status: 400 });

  try {
    await prisma.farmer.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Farmer deleted" });
  } catch (error) {
    console.error("DELETE FARMER ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error deleting farmer", error: error.message }, { status: 500 });
  }
}

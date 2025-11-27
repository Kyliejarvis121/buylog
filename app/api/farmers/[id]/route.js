// Route: app/api/farmers/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET farmer by id
export async function GET(request, { params: { id } }) {
  try {
    const farmer = await prisma.farmer.findUnique({ where: { id }, include: { user: true } });
    if (!farmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });
    return NextResponse.json({ data: farmer, message: "Farmer fetched successfully" });
  } catch (error) {
    return NextResponse.json({ data: null, message: error.message }, { status: 500 });
  }
}

// PUT farmer (approve/reject or update status)
export async function PUT(request, { params: { id } }) {
  try {
    const { action, isActive, status } = await request.json();
    const farmer = await prisma.farmer.findUnique({ where: { id } });
    if (!farmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });

    let data = {};
    if (action === "approve") data = { status: "approved", isActive: true };
    else if (action === "reject") data = { status: "rejected", isActive: false };
    else data = { isActive: isActive ?? farmer.isActive, status: status ?? farmer.status };

    const updatedFarmer = await prisma.farmer.update({ where: { id }, data });
    return NextResponse.json({ data: updatedFarmer, message: "Farmer updated successfully" });
  } catch (error) {
    return NextResponse.json({ data: null, message: error.message }, { status: 500 });
  }
}

// DELETE farmer
export async function DELETE(request, { params: { id } }) {
  try {
    const farmer = await prisma.farmer.findUnique({ where: { id } });
    if (!farmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });

    const deletedFarmer = await prisma.farmer.delete({ where: { id } });
    return NextResponse.json({ data: deletedFarmer, message: "Farmer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ data: null, message: error.message }, { status: 500 });
  }
}

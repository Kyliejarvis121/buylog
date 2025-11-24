import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Approve / reject / get / delete farmer by id
export async function GET(request, { params: { id } }) {
  try {
    const farmer = await prisma.farmers.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!farmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });
    return NextResponse.json({ data: farmer, message: "Farmer fetched successfully" });
  } catch (error) {
    return NextResponse.json({ data: null, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { action } = await request.json(); // action = "approve" | "reject"

    const farmer = await prisma.farmers.findUnique({ where: { id } });
    if (!farmer) return NextResponse.json({ data: null, message: "Farmer not found" }, { status: 404 });

    let updatedFarmer;
    if (action === "approve") {
      updatedFarmer = await prisma.farmers.update({
        where: { id },
        data: { status: "approved", isActive: true },
      });
    } else if (action === "reject") {
      updatedFarmer = await prisma.farmers.update({
        where: { id },
        data: { status: "rejected", isActive: false },
      });
    } else {
      return NextResponse.json({ data: null, message: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ data: updatedFarmer, message: `Farmer ${action}d successfully` });
  } catch (error) {
    return NextResponse.json({ data: null, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const farmer = await prisma.farmers.delete({ where: { id } });
    return NextResponse.json({ data: farmer, message: "Farmer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ data: null, message: error.message }, { status: 500 });
  }
}

// Route: app/api/banners/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET SINGLE BANNER
export async function GET(request, { params: { id } }) {
  try {
    const banner = await prisma.banner.findUnique({ where: { id } });

    if (!banner) return NextResponse.json({ data: null, message: "Banner not found" }, { status: 404 });

    return NextResponse.json({ data: banner });
  } catch (error) {
    console.error("GET /api/banners/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch banner", error: error.message }, { status: 500 });
  }
}

// UPDATE BANNER
export async function PUT(request, { params: { id } }) {
  try {
    const { title, link, imageUrl, isActive } = await request.json();

    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (!existingBanner) return NextResponse.json({ data: null, message: "Banner not found" }, { status: 404 });

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: { title, link, imageUrl, isActive },
    });

    return NextResponse.json({ data: updatedBanner, message: "Banner updated successfully" });
  } catch (error) {
    console.error("PUT /api/banners/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to update banner", error: error.message }, { status: 500 });
  }
}

// DELETE BANNER
export async function DELETE(request, { params: { id } }) {
  try {
    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (!existingBanner) return NextResponse.json({ data: null, message: "Banner not found" }, { status: 404 });

    const deletedBanner = await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ data: deletedBanner, message: "Banner deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/banners/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete banner", error: error.message }, { status: 500 });
  }
}

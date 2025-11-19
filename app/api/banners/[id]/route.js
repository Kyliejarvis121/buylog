import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const banner = await prisma.banner.findUnique({ where: { id } });
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Failed to fetch banner:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Banner", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (!existingBanner) {
      return NextResponse.json(
        { data: null, message: "Banner Not Found" },
        { status: 404 }
      );
    }

    const deletedBanner = await prisma.banner.delete({ where: { id } });
    return NextResponse.json(deletedBanner);
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return NextResponse.json(
      { message: "Failed to Delete Banner", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { title, link, imageUrl, isActive } = await request.json();

    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (!existingBanner) {
      return NextResponse.json(
        { data: null, message: "Banner Not Found" },
        { status: 404 }
      );
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: { title, link, imageUrl, isActive },
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Failed to update banner:", error);
    return NextResponse.json(
      { message: "Failed to Update Banner", error: error.message || error },
      { status: 500 }
    );
  }
}

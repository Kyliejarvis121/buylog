export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ===============================
   CREATE BANNER
================================ */
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, link, imageUrl, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { message: "Title and imageUrl are required" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        link: link?.trim() || null,
        imageUrl,
        isActive: isActive ?? true, // ✅ DEFAULT TRUE
      },
    });

    return NextResponse.json(
      { data: banner, message: "Banner created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/banners error:", error);
    return NextResponse.json(
      { message: "Failed to create banner" },
      { status: 500 }
    );
  }
}

/* ===============================
   GET BANNERS
   - Admin: /api/banners?all=true
   - Frontend: /api/banners
================================ */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;
    const search = searchParams.get("q")?.trim() || "";
    const showAll = searchParams.get("all") === "true";

    const where = {
      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
      ...(showAll ? {} : { isActive: true }), // ✅ KEY FIX
    };

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.banner.count({ where }),
    ]);

    return NextResponse.json({
      data: banners,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

/* ===============================
   DELETE BANNER
================================ */
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Banner ID is required" },
        { status: 400 }
      );
    }

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/banners error:", error);
    return NextResponse.json(
      { message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}

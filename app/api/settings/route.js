import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json({ data: settings, message: "Settings fetched successfully" });
  } catch (error) {
    console.error("GET /api/settings failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch settings", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const updatedSettings = await prisma.settings.update({
      where: { id: data.id },
      data: data,
    });
    return NextResponse.json({ data: updatedSettings, message: "Settings updated successfully" });
  } catch (error) {
    console.error("PUT /api/settings failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to update settings", error: error.message },
      { status: 500 }
    );
  }
}

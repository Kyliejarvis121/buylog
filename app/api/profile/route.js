import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { avatar, phone, address, country, bio } = await req.json();

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        avatar,
        phone,
        address,
        country,
        bio,
      },
      create: {
        userId: session.user.id,
        avatar,
        phone,
        address,
        country,
        bio,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}

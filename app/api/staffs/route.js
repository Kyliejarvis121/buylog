import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { hash } from "bcrypt";

export async function POST(request) {
  try {
    const {
      name,
      password,
      email,
      phone,
      physicalAddress,
      nin,
      dob,
      notes,
      code,
      isActive,
    } = await request.json();

    // Hash the password
    const hashedPassword = await hash(password, 10);

    const newStaff = await prisma.users.create({
      data: {
        name,
        password: hashedPassword,
        email,
        phone,
        physicalAddress,
        nin,
        dob: new Date(dob),
        notes,
        isActive,
        code,
        isAdmin: true,       // Assuming staff is admin
        isVerified: true,    // Optional
        images: [],          // Optional placeholder
      },
    });

    return NextResponse.json(newStaff);
  } catch (error) {
    console.error("Failed to create Staff:", error);
    return NextResponse.json(
      {
        message: "Failed to create Staff",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

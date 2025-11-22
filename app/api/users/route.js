import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// --------------------
// CREATE USER
// --------------------
export async function POST(request) {
  try {
    const { name, email, password, role, plan } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { data: null, message: `User with email (${email}) already exists` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const rawToken = uuidv4();
    const token = base64url.encode(rawToken);

    // Create user in DB
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        plan,
        verificationToken: token,
        emailVerified: false,
        verificationRequestCount: 0,
      },
    });

    console.log("New User Created:", newUser);

    // Optional: send verification email
    // await resend.emails.send({
    //   from: "you@yourdomain.com",
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify/${token}">here</a> to verify your email.</p>`,
    // });

    return NextResponse.json({ data: newUser, message: "User Created Successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users failed:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// --------------------
// GET ALL USERS
// --------------------
export async function GET() {
  try {
    const users = await prisma.users.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: users, message: "Users fetched successfully" });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch users", error: error.message }, { status: 500 });
  }
}

// --------------------
// UPDATE USER
// --------------------
export async function PUT(request) {
  try {
    const { id, name, email, role, plan, password, isActive } = await request.json();

    const dataToUpdate = { name, email, role, plan };
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { ...dataToUpdate },
    });

    return NextResponse.json({ data: updatedUser, message: "User updated successfully" });
  } catch (error) {
    console.error("PUT /api/users failed:", error);
    return NextResponse.json({ data: null, message: "Failed to update user", error: error.message }, { status: 500 });
  }
}

// --------------------
// DELETE USER
// --------------------
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.users.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete user", error: error.message }, { status: 500 });
  }
}

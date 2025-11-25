import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";

// --------------------
// REGISTER USER
// --------------------
export async function POST(request) {
  try {
    const { name, email, password, role = "user", plan = null } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const rawToken = uuidv4();
    const token = base64url.encode(rawToken);

    const newUser = await prisma.user.create({
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

    return NextResponse.json({ data: newUser, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users failed:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// --------------------
// LOGIN USER
// --------------------
export async function login(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // You can return user data, or generate a JWT/session here
    return NextResponse.json({ data: user, message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/users/login failed:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// --------------------
// GET ALL USERS
// --------------------
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: users, message: "Users fetched successfully" }, { status: 200 });
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
    const { id, name, email, role, plan, password } = await request.json();

    const dataToUpdate = { name, email, role, plan };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ data: updatedUser, message: "User updated successfully" }, { status: 200 });
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

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/users failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete user", error: error.message }, { status: 500 });
  }
}

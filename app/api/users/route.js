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

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ data: null, message: "Name, email, and password (min 6 chars) are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ data: null, message: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = base64url.encode(uuidv4());

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

    return NextResponse.json({ 
      data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      message: "User created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users failed:", error);
    return NextResponse.json({ data: null, message: "Server error", error: error.message }, { status: 500 });
  }
}

// --------------------
// LOGIN USER
// --------------------
export async function login(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ data: null, message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ data: null, message: "Invalid email or password" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ data: null, message: "Invalid email or password" }, { status: 401 });

    // Return safe user fields only
    return NextResponse.json({ 
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: "Login successful" 
    }, { status: 200 });
  } catch (error) {
    console.error("POST /api/users/login failed:", error);
    return NextResponse.json({ data: null, message: "Server error", error: error.message }, { status: 500 });
  }
}

// --------------------
// GET ALL USERS (with pagination)
// --------------------
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, plan: true, emailVerified: true },
    });

    const total = await prisma.user.count();

    return NextResponse.json({ data: users, total, page, limit, message: `Fetched ${users.length} users out of ${total}` });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return NextResponse.json({ data: [], message: "Failed to fetch users", error: error.message }, { status: 500 });
  }
}

// --------------------
// UPDATE USER
// --------------------
export async function PUT(request) {
  try {
    const { id, name, email, role, plan, password } = await request.json();
    if (!id) return NextResponse.json({ data: null, message: "User ID is required" }, { status: 400 });

    const dataToUpdate = { name, email, role, plan };
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true, plan: true, emailVerified: true },
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
    if (!id) return NextResponse.json({ data: null, message: "User ID is required" }, { status: 400 });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ data: null, message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete user", error: error.message }, { status: 500 });
  }
}

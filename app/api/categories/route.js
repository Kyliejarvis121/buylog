import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    const existingCategory = await db.categories.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          data: null,
          message: `Category (${title}) already exists`,
        },
        { status: 409 }
      );
    }

    const newCategory = await db.categories.create({
      data: { title, slug, imageUrl, description, isActive },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to create category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const categories = await db.categories.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to fetch categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

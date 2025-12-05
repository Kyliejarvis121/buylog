import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET: List all products (Admin sees all, Farmer sees only theirs)
// POST: Create a new product
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { role, id: userId } = session.user;

  try {
    let products = [];

    if (role === "ADMIN") {
      products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true, farmer: true },
      });
    } else {
      // Farmer: get their farmer ID(s)
      const farmers = await prisma.farmer.findMany({ where: { userId }, select: { id: true } });
      const farmerIds = farmers.map(f => f.id);

      products = await prisma.product.findMany({
        where: { farmerId: { in: farmerIds } },
        orderBy: { createdAt: "desc" },
        include: { category: true, farmer: true },
      });
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("FETCH PRODUCTS ERROR:", error);
    return NextResponse.json({ success: false, message: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { role, id: userId } = session.user;
  if (!["ADMIN", "FARMER"].includes(role)) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const {
      title, description, productPrice, categoryId, farmerId,
      imageUrl, productImages, tags, isActive, wholesalePrice, wholesaleQty
    } = data;

    if (!title || !productPrice) {
      return NextResponse.json({ success: false, message: "Title and Product Price are required" }, { status: 400 });
    }

    if (!productImages || productImages.length === 0) {
      return NextResponse.json({ success: false, message: "Upload at least one product image" }, { status: 400 });
    }

    // For Farmers, override farmerId with their own
    let finalFarmerId = farmerId;
    if (role === "FARMER") {
      const farmer = await prisma.farmer.findFirst({ where: { userId } });
      if (!farmer) return NextResponse.json({ success: false, message: "Farmer profile not found" }, { status: 400 });
      finalFarmerId = farmer.id;
    }

    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug: uniqueSlug,
        description: description || "",
        price: Number(productPrice),
        salePrice: wholesalePrice ? Number(wholesalePrice) : Number(productPrice),
        categoryId,
        farmerId: finalFarmerId,
        imageUrl: imageUrl || productImages[0],
        productImages,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, data: product, message: "Product created successfully" });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error creating product", error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/products — list products with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const fabricType = searchParams.get("fabricType");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const newArrivals = searchParams.get("newArrivals");
  const bestSellers = searchParams.get("bestSellers");
  const inStock = searchParams.get("inStock");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: any = {
    isArchived: false, // Never show archived products
  };

  if (category) where.category = category.toUpperCase();
  if (brand) where.brand = { contains: brand };
  if (fabricType) where.fabricType = fabricType;
  if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
  if (featured === "true") where.isFeatured = true;
  if (newArrivals === "true") where.isNewArrival = true;
  if (bestSellers === "true") where.isBestSeller = true;
  if (inStock === "true") where.isOutOfStock = false;
  if (search) {
    // SQLite LIKE is case-insensitive for ASCII by default, so `contains` works.
    // We also lowercase the search term for extra safety.
    const term = search.toLowerCase();
    where.OR = [
      { name: { contains: term } },
      { brand: { contains: term } },
      { description: { contains: term } },
      { fabricType: { contains: term } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const total = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// Required fields for product creation
const REQUIRED_PRODUCT_FIELDS = [
  "name", "slug", "brand", "category", "fabricType",
  "price", "description", "images", "sizes", "colors",
] as const;

// POST /api/products — create a product (admin/staff only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Validate required fields
  const missing = REQUIRED_PRODUCT_FIELDS.filter(
    (field) => !data[field] && data[field] !== 0
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate types
  if (typeof data.price !== "number" || data.price < 0) {
    return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 });
  }
  if (typeof data.name !== "string" || data.name.trim().length === 0) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }
  
  // Auto-set out of stock if quantity is 0
  if (data.stockQuantity === 0) {
    data.isOutOfStock = true;
  }
  // Parse discount expiry date
  if (data.discountExpiry) {
    data.discountExpiry = new Date(data.discountExpiry);
  }

  const product = await prisma.product.create({ data });
  return NextResponse.json(product, { status: 201 });
}

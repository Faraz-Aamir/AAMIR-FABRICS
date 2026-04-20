import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product || product.isArchived) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// Whitelist of fields allowed for product update
const PRODUCT_UPDATE_FIELDS = [
  "name", "slug", "brand", "category", "fabricType",
  "price", "originalPrice", "discountPrice", "discountPercent", "discountExpiry",
  "description", "images", "sizes", "colors",
  "stockQuantity", "isOutOfStock", "restockDate",
  "isFeatured", "isNewArrival", "isBestSeller", "isArchived",
  "tags",
] as const;

// PUT /api/products/[id] — update product (admin/staff only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json();

  // Only allow whitelisted fields
  const data: Record<string, unknown> = {};
  for (const key of PRODUCT_UPDATE_FIELDS) {
    if (key in raw) {
      data[key] = raw[key];
    }
  }
  
  // Auto-set out of stock if quantity is 0
  if (data.stockQuantity !== undefined && data.stockQuantity === 0) {
    data.isOutOfStock = true;
  }
  // Auto-clear out of stock if quantity > 0
  if (data.stockQuantity !== undefined && (data.stockQuantity as number) > 0) {
    data.isOutOfStock = false;
  }
  // Parse discount expiry date
  if (data.discountExpiry) {
    data.discountExpiry = new Date(data.discountExpiry as string);
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(product);
}

// DELETE /api/products/[id] — soft-delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Soft-delete: archive the product instead of destroying data
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.update({
    where: { id: params.id },
    data: { isArchived: true, isOutOfStock: true },
  });

  return NextResponse.json({ message: "Product archived" });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/orders — list orders (admin: all orders, customer: own orders)
export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;
  const userId = session.user.id;

  const where = ["ADMIN", "STAFF"].includes(role) ? {} : { userId };

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: { product: true },
      },
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST /api/orders — create an order (authenticated users)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Please login to place an order" }, { status: 401 });
  }

  const data = await request.json();
  const userId = session.user.id;

  // Validate required shipping fields
  if (!data.shippingName?.trim() || !data.shippingEmail?.trim() || !data.shippingPhone?.trim() ||
      !data.shippingAddress?.trim() || !data.shippingCity?.trim()) {
    return NextResponse.json({ error: "All shipping fields are required" }, { status: 400 });
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 });
  }

  // Validate stock and calculate server-side total
  let calculatedTotal = 0;
  const validatedItems: { productId: string; quantity: number; price: number; size?: string; color?: string }[] = [];

  for (const item of data.items) {
    if (!item.productId || !item.quantity || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
    }
    if (product.isOutOfStock || product.stockQuantity < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} is out of stock or insufficient quantity` },
        { status: 400 }
      );
    }

    // Use server-side price (discountPrice if available AND not expired)
    const isDiscountValid = product.discountPrice && product.discountPrice > 0
      && (!product.discountExpiry || new Date(product.discountExpiry) > new Date());
    const serverPrice = isDiscountValid
      ? product.discountPrice!
      : product.price;

    calculatedTotal += serverPrice * item.quantity;
    validatedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: serverPrice,
      size: item.size,
      color: item.color,
    });
  }

  // Apply shipping (free over PKR 5000, otherwise PKR 250)
  const shipping = calculatedTotal >= 5000 ? 0 : 250;
  calculatedTotal += shipping;

  // Atomic transaction: create order + reduce stock together
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total: calculatedTotal,
        shippingName: data.shippingName.trim(),
        shippingEmail: data.shippingEmail.trim(),
        shippingPhone: data.shippingPhone.trim(),
        shippingAddress: data.shippingAddress.trim(),
        shippingCity: data.shippingCity.trim(),
        paymentMethod: data.paymentMethod || "COD",
        paymentStatus: data.paymentMethod === "COD" ? "PENDING_PAYMENT" : "PENDING_PAYMENT",
        transactionId: data.transactionId?.trim() || null,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Reduce stock atomically
    for (const item of validatedItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: { decrement: item.quantity },
          isOutOfStock: false, // will fix below
        },
      });
      // Check if now out of stock
      const updated = await tx.product.findUnique({ where: { id: item.productId } });
      if (updated && updated.stockQuantity <= 0) {
        await tx.product.update({
          where: { id: item.productId },
          data: { isOutOfStock: true },
        });
      }
    }

    return newOrder;
  });

  return NextResponse.json(order, { status: 201 });
}

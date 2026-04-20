import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const VALID_PAYMENT_STATUSES = ["PENDING_PAYMENT", "PAID", "REJECTED"];

// GET /api/orders/[id] — get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;
  const userId = session.user.id;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Non-admin users can only view their own orders
  if (!["ADMIN", "STAFF"].includes(role) && order.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(order);
}

// PATCH /api/orders/[id] — update order status (admin/staff only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Validate status
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  // Check order exists
  const existing = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Build update data
  const updateData: any = {};
  if (data.status) updateData.status = data.status;
  if (data.paymentStatus) {
    if (!VALID_PAYMENT_STATUSES.includes(data.paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    updateData.paymentStatus = data.paymentStatus;
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: updateData,
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(order);
}

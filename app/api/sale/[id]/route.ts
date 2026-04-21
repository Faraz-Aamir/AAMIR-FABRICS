import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT /api/sale/[id] — admin: update a sale event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { name, description, startDate, endDate, isActive } = data;

  const sale = await prisma.saleEvent.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(sale);
}

// DELETE /api/sale/[id] — admin: delete a specific sale event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  void request;
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.saleEvent.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

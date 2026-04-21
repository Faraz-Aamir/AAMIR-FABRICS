import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/sale — public: get the latest active/upcoming sale event
export async function GET(request: NextRequest) {
  void request; // required by Next.js route handler signature
  const now = new Date();

  const sale = await prisma.saleEvent.findFirst({
    where: { isActive: true },
    orderBy: { startDate: "asc" },
  });

  if (!sale) return NextResponse.json({ sale: null });

  const hasStarted = now >= sale.startDate;
  const hasEnded = now >= sale.endDate;

  return NextResponse.json({
    sale: {
      ...sale,
      status: hasEnded ? "ended" : hasStarted ? "active" : "upcoming",
    },
  });
}

// POST /api/sale — admin: create a new sale event
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { name, description, startDate, endDate } = data;

  if (!name || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Name, startDate and endDate are required" },
      { status: 400 }
    );
  }

  if (new Date(startDate) >= new Date(endDate)) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 400 }
    );
  }

  const sale = await prisma.saleEvent.create({
    data: {
      name,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true,
    },
  });

  return NextResponse.json(sale, { status: 201 });
}

// DELETE /api/sale — admin: delete all sale events (reset)
export async function DELETE(request: NextRequest) {
  void request;
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN"].includes(session.user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.saleEvent.deleteMany({});
  return NextResponse.json({ success: true });
}

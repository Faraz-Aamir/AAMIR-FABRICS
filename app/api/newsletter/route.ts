import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterNotification } from "@/lib/email";

// POST /api/newsletter — subscribe to newsletter
export async function POST(request: NextRequest) {
  const data = await request.json();
  const email = data.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }

  // Check if already subscribed
  const existing = await prisma.newsletter.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
  }

  await prisma.newsletter.create({ data: { email } });

  // Notify admin about new subscriber
  try {
    await sendNewsletterNotification(email);
  } catch (error) {
    console.error("Newsletter notification error:", error);
  }

  return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createBuyerSchema } from "@/zod-schemas/schemas";
import { getCurrentUser } from "@/lib/auth";
import { BHK } from "@/generated/prisma";
import { Timeline } from "@/generated/prisma";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parse = createBuyerSchema.safeParse(body);
  if (!parse.success)
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const data = parse.data;

  const bhkEnum = data.bhk ? (data.bhk as BHK) : null;

  let timelineEnum: Timeline | null = null;
  if (data.timeline) {
    timelineEnum =
      data.timeline === "GT>6m"
        ? ("GT>6m" as Timeline)
        : (data.timeline as Timeline);
  }
  const buyer = await prisma.buyer.create({
    data: { ...data, bhk: bhkEnum, timeline: timelineEnum, ownerId: user.id },
  });
  await prisma.buyerHistory.create({
    data: { buyerId: buyer.id, changedBy: user.id, diff: { created: data } },
  });
  return NextResponse.json(buyer);
}

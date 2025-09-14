import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { createBuyerSchema } from "@/zod-schemas/schemas";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  // ✅ Validate with Zod
  const parsed = createBuyerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Fetch current record
  const existing = await prisma.buyer.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Concurrency check
  // Assume the client sends the last known updatedAt in a header or query param
  const clientUpdatedAt = req.headers.get("x-updated-at");
  if (clientUpdatedAt && new Date(clientUpdatedAt).getTime() !== existing.updatedAt.getTime()) {
    return NextResponse.json(
      { error: "Record changed, please refresh." },
      { status: 409 }
    );
  }

  // Find differences
  const diff: Record<string, { old: any; new: any }> = {};
  Object.entries(data).forEach(([field, newVal]) => {
    const oldVal = (existing as any)[field];
    if (oldVal !== newVal) {
      diff[field] = { old: oldVal, new: newVal };
    }
  });

  // Update buyer
  const updated = await prisma.buyer.update({
    where: { id: params.id },
    data:{...body}
  });

  // Insert BuyerHistory if there are diffs
  if (Object.keys(diff).length > 0) {
    await prisma.buyerHistory.create({
      data: {
        buyerId: params.id,
        changedBy: "system", // TODO: replace with logged-in user id/email
        diff,
      },
    });
  }

  return NextResponse.json(updated);
}

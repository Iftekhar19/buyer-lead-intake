import { getCurrentUser } from "@/lib/auth";
import { computeDiff } from "@/lib/computeDiff";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { createBuyerSchema } from "@/zod-schemas/schemas";
import { NextResponse } from "next/server";

// app/api/buyers/[id]/route.ts
export async function PATCH(req: Request, { params }: any) {
 
  const user = await getCurrentUser();
  try {
    if (!user) {
      return NextResponse.json(
        { message: "Unauthrize access" },
        { status: 401 }
      );
    }
    const ip = (await req.headers.get("x-forwarded-for"));
    const limit = checkRateLimit(ip || user.id);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Try again in ${Math.ceil(
            limit.retryAfter! / 1000
          )}s`,
        },
        { status: 429 }
      );
    }
     const body = await req.json();
    const parsedData = createBuyerSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { id } = await params;
    const originalUpdatedAt = new Date(body.updatedAt || Date.now());
    const oldData = await prisma.buyer.findUnique({
      where: {
        id: id,
      },
    });
    const res = await prisma.buyer.updateMany({
      where: { id },
      data: { ...body },
    });
    console.log(res);
    if (res.count === 0)
      return NextResponse.json({ error: "Record changed" }, { status: 409 });
    const buyer = await prisma.buyer.findUnique({ where: { id } });
    await prisma.buyerHistory.create({
      data: {
        buyerId: id,
        changedBy: user.id,
        diff: computeDiff(oldData, body),
      },
    });
    return NextResponse.json(buyer);
  } catch (error) {
    console.log(error);
  }
}

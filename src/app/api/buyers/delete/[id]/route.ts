
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
    const params2=await params
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const buyerId = params2.id;


    const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }


    await prisma.$transaction([
      prisma.buyerHistory.deleteMany({ where: { buyerId } }),
      prisma.buyer.delete({ where: { id: buyerId } }),
    ]);

    return NextResponse.json({ message: "Buyer and history deleted successfully" });
  } catch (err: any) {
    console.error("Delete buyer error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

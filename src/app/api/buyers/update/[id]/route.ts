import { getCurrentUser } from "@/lib/auth";
import { computeDiff } from "@/lib/computeDiff";
import { prisma } from "@/lib/db";
import { createBuyerSchema } from "@/zod-schemas/schemas";
import { NextResponse } from "next/server";

// app/api/buyers/[id]/route.ts
export async function PATCH(req: Request, { params }:any) {
  const body = await req.json();
  const user = await getCurrentUser();
try {
      if(!user)
      {
        return NextResponse.json({message:"Unauthrize access"},{status:401})
      }
      const parsedData=createBuyerSchema.safeParse(body)
      if(!parsedData.success)
      {
        return NextResponse.json({ error: parsedData.error.flatten() }, { status: 400 })
      }
     
      const { id } =await params;
      const originalUpdatedAt = new Date(body.updatedAt||Date.now());
      const oldData=await prisma.buyer.findUnique({where:{
        id:id
    }})
      const res = await prisma.buyer.updateMany({
        where: { id },
        data: {...body}
      });
      console.log(res)
      if (res.count === 0) return NextResponse.json({ error: "Record changed" }, { status: 409 });
      const buyer = await prisma.buyer.findUnique({ where: { id } });
      await prisma.buyerHistory.create({ data: { buyerId: id, changedBy: user.id, diff: computeDiff(oldData,body ) }});
      return NextResponse.json(buyer);
} catch (error) {
   console.log(error) 
}
}

// app/api/buyers/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const HEADER = [
  "fullName",
  "email",
  "phone",
  "city",
  "propertyType",
  "bhk",
  "purpose",
  "budgetMin",
  "budgetMax",
  "timeline",
  "source",
  "notes",
  "tags",
  "status",
];

function buildWhereFrom(query: URLSearchParams) {
  const where: any = {};
  const q = query.get("q");
  if (query.get("city")) where.city = query.get("city");
  if (query.get("propertyType")) where.propertyType = query.get("propertyType");
  if (query.get("status")) where.status = query.get("status");
  if (query.get("timeline")) where.timeline = query.get("timeline");
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = await url.searchParams;

    const where = buildWhereFrom(params);

    // get all matching rows (careful — consider a max export limit in production)
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    // convert to CSV rows
    const csvRows = buyers.map((b) =>
      HEADER.map((h) => {
        const v = (b as any)[h];
        if (Array.isArray(v)) return `"${v.join(",")}"`;
        if (v == null) return "";
        // escape quotes by doubling
        return typeof v === "string" ? `"${String(v).replace(/"/g, '""')}"` : String(v);
      }).join(",")
    );

    const csv = [HEADER.join(","), ...csvRows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="buyers_export.csv"`,
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

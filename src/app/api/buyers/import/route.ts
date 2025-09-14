
import { NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/db";
import { createBuyerSchema } from "@/zod-schemas/schemas";
import { getCurrentUser } from "@/lib/auth";

type CsvRow = Record<string, string | undefined>;

function normalizeRow(raw: CsvRow) {
  // Map CSV fields to expected types + simple normalization
  const r: any = {
    fullName: (raw.fullName || "").trim(),
    email: (raw.email || "").trim() || undefined,
    phone: (raw.phone || "").trim(),
    city: (raw.city || "").trim(),
    propertyType: (raw.propertyType || "").trim(),
    bhk: raw.bhk ? String(raw.bhk).trim() : undefined,
    purpose: (raw.purpose || "").trim(),
    budgetMin: raw.budgetMin ? Number(String(raw.budgetMin).trim()) : undefined,
    budgetMax: raw.budgetMax ? Number(String(raw.budgetMax).trim()) : undefined,
    timeline: (raw.timeline || "").trim(),
    source: (raw.source || "").trim(),
    notes: (raw.notes || "").trim() || undefined,
    tags:
      raw.tags && typeof raw.tags === "string"
        ? (raw.tags as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    status: raw.status ? String(raw.status).trim() : undefined,
  };
  return r;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    const parsed = Papa.parse<CsvRow>(text, { header: true, skipEmptyLines: true });
    const rows = parsed.data;
    if (rows.length === 0) {
      return NextResponse.json({ error: "CSV is empty" }, { status: 400 });
    }
    if (rows.length > 200) {
      return NextResponse.json({ error: "CSV exceeds max 200 rows" }, { status: 400 });
    }

    const errors: Array<{ row: number; message: string }> = [];
    const validRows: Array<Record<string, any>> = [];

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];
      const normalized = normalizeRow(raw);
      const parsedZ = createBuyerSchema.safeParse(normalized);

      if (!parsedZ.success) {
        const flat = parsedZ.error.flatten();
        const messages = Object.entries(flat.fieldErrors)
          .map(([k, v]) => `${k}: ${v?.join?.(", ") ?? v}`)
          .join("; ");
        errors.push({ row: i + 1, message: messages || JSON.stringify(parsedZ.error) });
      } else {
        validRows.push(parsedZ.data);
      }
    }

    // If there are any invalid rows, return them (but still allow inserting valid rows optionally).
    // Here we'll insert valid rows and return both counts and row-level errors.
    let inserted = 0;
    if (validRows.length > 0) {
      // Use interactive transaction so we can create buyerHistory per created buyer
      await prisma.$transaction(async (tx) => {
        for (const r of validRows) {
          const buyer = await tx.buyer.create({
            data: {
              fullName: r.fullName,
              phone: r.phone,
              city: r.city,
              propertyType: r.propertyType,
              bhk: r.bhk,
              purpose: r.purpose,
              budgetMin: r.budgetMin,
              budgetMax: r.budgetMax,
              timeline: r.timeline,
              source: r.source,
              notes: r.notes,
              tags: r.tags,
              status: r.status,
              email: r.email,
              ownerId: user.id,
              // ensure tags isn't null (prisma handles undefined)
            },
          });

          await tx.buyerHistory.create({
            data: {
              buyerId: buyer.id,
              changedBy: user.id,
              diff: { created: r },
            },
          });
          inserted++;
        }
      });
    }

    return NextResponse.json({ inserted, totalRows: rows.length, errors });
  } catch (err: any) {
    console.error("Import error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

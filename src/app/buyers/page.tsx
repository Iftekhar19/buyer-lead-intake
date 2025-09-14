
import Filters from "@/components/Filter";
import { prisma } from "@/lib/db";
import Link from "next/link";
import CsvImportExport from "@/components/ImportExport";
import { getCurrentUser } from "@/lib/auth";

interface BuyersPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const PAGE_SIZE = 10;

// allowed enums to prevent Prisma errors
const validStatuses = ["New", "Contacted", "Visited", "Negotiation", "Converted","Dropped"];
// New
//   Qualified
//   Contacted
//   Visited
//   Negotiation
//   Converted
//   Dropped
const validTimelines = ["M0_3m", "M3_6m", "GT_6m", "Exploring"];

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const user=await getCurrentUser()
    const searchParams2=await searchParams
  const params = Object.fromEntries(
    Object.entries( searchParams2).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const plainQuery: Record<string, string | undefined> = {};
for (const k of ["city","propertyType","status","timeline","q"]) {
  if (searchParams2[k]) plainQuery[k] = String(searchParams2[k]);
}

  const page = Math.max(1, parseInt(params.page || "1", 10));

  const where: any = {};
  if (params.city) where.city = params.city;
  if (params.propertyType) where.propertyType = params.propertyType;

  if (params.status && validStatuses.includes(params.status)) {
    where.status = params.status as any;
  }
  if (params.timeline && validTimelines.includes(params.timeline)) {
    where.timeline = params.timeline as any;
  }

  if (params.q) {
    where.OR = [
      { fullName: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 space-y-6">
      <Filters searchParams={params} />
      <CsvImportExport currentQuery={plainQuery} />

      <table className="border w-full">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">City</th>
            <th className="border px-2 py-1">Property Type</th>
            <th className="border px-2 py-1">Budget (min–max)</th>
            <th className="border px-2 py-1">Timeline</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Updated At</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyers.length==0 ?<tr  className="w-fill p-2 text-center">
            <td colSpan={8} className="text-center py-4">No records found</td>
          </tr>:buyers.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1 text-center">{b.fullName}</td>
              <td className="border px-2 py-1 text-center">{b.phone}</td>
              <td className="border px-2 py-1 text-center">{b.city}</td>
              <td className="border px-2 py-1 text-center">{b.propertyType}</td>
              <td className="border px-2 py-1 text-center">
                {b.budgetMin} – {b.budgetMax}
              </td>
              <td className="border px-2 py-1 text-center">{b.timeline}</td>
              <td className="border px-2 py-1 text-center">{b.status}</td>
              <td className="border px-2 py-1 text-center">
                {new Date(b.updatedAt).toLocaleDateString()}
              </td> 
              <td className="border px-2 py-1 text-center flex items-center gap-2 justify-center">
                {b.ownerId ==user?.id &&<Link href={`/buyers/edit/${b.id}`} className="border px-3 py-1 rounded-3xl">Edit</Link>}
                <Link href={`/buyers/details/${b.id}`} className="border px-3 py-1 rounded-3xl">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-4 mt-4 justify-center items-center">
        {/* Previous button (only show if not on first page) */}
        {page > 1 && (
          <a
            href={`/buyers?${new URLSearchParams({
              ...params,
              page: String(page - 1),
            }).toString()}`}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Previous
          </a>
        )}

        <span>
          Page {page} of {totalPages}
        </span>

        {/* Next button (only show if not on last page) */}
        {page < totalPages && (
          <a
            href={`/buyers?${new URLSearchParams({
              ...params,
              page: String(page + 1),
            }).toString()}`}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}

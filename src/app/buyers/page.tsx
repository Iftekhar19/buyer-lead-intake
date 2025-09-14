import Filters from "@/components/Filter";
import { prisma } from "@/lib/db";
import Link from "next/link";
import CsvImportExport from "@/components/ImportExport";
import { getCurrentUser } from "@/lib/auth";

interface BuyersPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const PAGE_SIZE = 10;

const validStatuses = ["New", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"];
const validTimelines = ["M0_3m", "M3_6m", "GT_6m", "Exploring"];

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const searchParams2=await searchParams
  const user = await getCurrentUser();
  const params = Object.fromEntries(
    Object.entries(searchParams2).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const plainQuery: Record<string, string | undefined> = {};
  for (const k of ["city", "propertyType", "status", "timeline", "q"]) {
    if (searchParams2[k]) plainQuery[k] = String(searchParams2[k]);
  }

  const page = Math.max(1, parseInt(params.page || "1", 10));

  const where: any = {};
  if (params.city) where.city = params.city;
  if (params.propertyType) where.propertyType = params.propertyType;
  if (params.status && validStatuses.includes(params.status)) where.status = params.status as any;
  if (params.timeline && validTimelines.includes(params.timeline)) where.timeline = params.timeline as any;
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
    <div className=" p-2 md:p-6 space-y-6">
      {/* Filters + Import/Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Filters searchParams={params} />
        <CsvImportExport currentQuery={plainQuery} />
      </div>

      {/* Table Container */}
      <div className="w-full flex justify-end px-4">
          <Link href={`/buyers/new`} className="p-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white transition">Add Buyers</Link>
        </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3 hidden md:table-cell">City</th>
                <th className="px-4 py-3 hidden md:table-cell">Property Type</th>
                <th className="px-4 py-3 hidden md:table-cell">Budget</th>
                <th className="px-4 py-3 hidden md:table-cell">Timeline</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                buyers.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{b.fullName}</td>
                    <td className="px-4 py-3">{b.phone}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{b.city}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{b.propertyType}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      ₹{b.budgetMin} – ₹{b.budgetMax}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{b.timeline}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          b.status === "Converted"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Dropped"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(b.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      {b.ownerId == user?.id && (
                        <Link
                          href={`/buyers/edit/${b.id}`}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Edit
                        </Link>
                      )}
                      <Link
                        href={`/buyers/details/${b.id}`}
                        className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-4 justify-center items-center">
        {page > 1 && (
          <a
            href={`/buyers?${new URLSearchParams({
              ...params,
              page: String(page - 1),
            }).toString()}`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Previous
          </a>
        )}

        <span className="text-sm text-gray-600">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        {page < totalPages && (
          <a
            href={`/buyers?${new URLSearchParams({
              ...params,
              page: String(page + 1),
            }).toString()}`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}

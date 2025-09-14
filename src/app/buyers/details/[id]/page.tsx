
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import DeleteBuyerButton from "@/components/DeleteBuyerButton";


interface BuyerPageProps {
  params: { id: string };
}

export default async function BuyerPage({ params }: BuyerPageProps) {
    const paramse2=await params
    const user=await getCurrentUser()
  const buyer = await prisma.buyer.findUnique({
    where: { id: paramse2.id },
  });

  if (!buyer) {
    notFound();
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Buyer Details</h1>
      {buyer.ownerId==user?.id && <div className="flex items-center gap-3"> <Link
          href={`/buyers/edit/${buyer.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
       Edit Buyer
        </Link>
        <DeleteBuyerButton buyerId={buyer.id}/>
        </div>
        }
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <Detail label="Name" value={buyer.fullName} />
          <Detail label="Phone" value={buyer.phone} />
          <Detail label="Email" value={buyer.email || "—"} />
          <Detail label="City" value={buyer.city} />
          <Detail label="Property Type" value={buyer.propertyType} />
          {buyer.bhk && <Detail label="BHK" value={buyer.bhk} />}
          <Detail label="Purpose" value={buyer.purpose} />
          <Detail
            label="Budget"
            value={
              buyer.budgetMin != null && buyer.budgetMax != null
                ? `₹${buyer.budgetMin.toLocaleString()} – ₹${buyer.budgetMax.toLocaleString()}`
                : "—"
            }
          />
          <Detail label="Timeline" value={buyer.timeline} />
          <Detail label="Source" value={buyer.source} />
          <Detail label="Status" value={buyer.status} />
          <Detail label="Tags" value={buyer.tags?.join(", ") || "—"} />
        </div>

        {/* Notes */}
        <div>
          <p className="text-sm font-semibold text-gray-600">Notes</p>
          <p className="mt-1 text-gray-800">{buyer.notes || "—"}</p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 border-t pt-3">
          Last updated: {buyer.updatedAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

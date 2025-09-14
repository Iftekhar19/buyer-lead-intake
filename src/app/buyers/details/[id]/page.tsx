import { prisma } from "@/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import DeleteBuyerButton from "@/components/DeleteBuyerButton";
import { User, Phone, Mail, Home, Tag, FileText, Calendar, Landmark, DollarSign, Target, Activity } from "lucide-react";

interface BuyerPageProps {
  params: { id: string };
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  const params2=await params
  const user = await getCurrentUser();
  const buyer = await prisma.buyer.findUnique({
    where: { id: params2.id },
  });

  if (!buyer) {
    return <div className="p-6 text-red-600">Buyer not found</div>;
  }

  return (
    <div className=" p-2 md:p-8 max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="h-7 w-7 text-blue-600" />
          Buyer Details
        </h1>
        {buyer.ownerId === user?.id && (
          <div className="flex items-center gap-3">
            <Link
              href={`/buyers/edit/${buyer.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Edit Buyer
            </Link>
            <DeleteBuyerButton buyerId={buyer.id} />
          </div>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        {/* Top Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold">{buyer.fullName}</h2>
          <p className="text-sm opacity-90">{buyer.email || "No email provided"}</p>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <Detail icon={<Phone />} label="Phone" value={buyer.phone} />
          <Detail icon={<Mail />} label="Email" value={buyer.email || "—"} />
          <Detail icon={<Home />} label="City" value={buyer.city} />
          <Detail icon={<Landmark />} label="Property Type" value={buyer.propertyType} />
          {buyer.bhk && <Detail icon={<Home />} label="BHK" value={buyer.bhk} />}
          <Detail icon={<Target />} label="Purpose" value={buyer.purpose} />
          <Detail
            icon={<DollarSign />}
            label="Budget"
            value={
              buyer.budgetMin != null && buyer.budgetMax != null
                ? `₹${buyer.budgetMin.toLocaleString()} – ₹${buyer.budgetMax.toLocaleString()}`
                : "—"
            }
          />
          <Detail icon={<Calendar />} label="Timeline" value={buyer.timeline} />
          <Detail icon={<Activity />} label="Status" value={buyer.status} />
          <Detail icon={<Tag />} label="Tags" value={buyer.tags?.join(", ") || "—"} />
          <Detail icon={<Target />} label="Source" value={buyer.source} />
        </div>

        {/* Notes */}
        <div className="px-6 pb-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <FileText className="h-4 w-4" /> Notes
          </p>
          <p className="mt-2 text-gray-800 bg-gray-50 rounded-lg p-3">
            {buyer.notes || "—"}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t">
          Last updated: {buyer.updatedAt.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-gray-800">{value}</p>
      </div>
    </div>
  );
}

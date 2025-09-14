import { prisma } from "@/lib/db";
import BuyerEdit from "@/components/BuyerEdit";

interface Props {
  params: { id: string };
}

export default async function BuyerDetailPage({ params }: Props) {
  const { id } = await params;
  const buyer = await prisma.buyer.findUnique({
    where: { id: id },
  });
  console.log(buyer?.tags)
  const history = await prisma.buyerHistory.findMany({
    where: { buyerId: buyer?.id },
  });
  console.log(history);

  if (!buyer) {
    return <div className="p-6 text-red-600">Buyer not found</div>;
  }

  return (
    <div className="p-6 space-y-8 mx-auto  flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Edit Buyer</h1>

      <BuyerEdit
        initialData={{
          ...buyer,
          email: buyer.email ?? "",
          bhk: buyer.bhk ?? undefined,
          notes: buyer.notes ?? "",
          budgetMin: buyer.budgetMin ?? undefined,
          budgetMax: buyer.budgetMax ?? undefined,
          timeline: buyer.timeline == "GT_6m" ? "GT>6m" : buyer.timeline,
          tags: buyer.tags,
          // updatedAt: buyer.updatedAt.toISOString(),
        }}
      />

      <div>
        <h2 className="font-semibold mb-2">Last 5 Changes</h2>
        <ul className="space-y-1 text-sm">
          {history.slice(0, 5).map((h) => {
            const diff = h.diff as Record<
              string,
              {
                oldValue: string | number | null;
                newValue: string | number | null;
              }
            >;

            return Object.entries(diff).map(([field, change]) => (
              <li key={`${h.id}-${field}`} className="border-b pb-1">
                <span className="font-medium">{field}</span>:{" "}
                <span className="text-gray-600">{change?.oldValue ?? "—"}</span>{" "}
                →{" "}
                <span className="text-gray-900">{change?.newValue ?? "—"}</span>{" "}
                <span className="text-xs text-gray-500">
                  ({new Date(h.changedAt).toLocaleString()} by {h.changedBy})
                </span>
              </li>
            ));
          })}
        </ul>
      </div>
    </div>
  );
}

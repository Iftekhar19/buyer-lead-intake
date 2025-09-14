"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBuyerSchema, BuyerInput } from "@/zod-schemas/schemas";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface BuyerFormProps {
  initialData?: Partial<BuyerInput>;
}

export default function BuyerForm({ initialData }: BuyerFormProps) {
  const params = useParams();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BuyerInput>({
    resolver: zodResolver(createBuyerSchema),
    defaultValues: {
      ...initialData,
    } as any,
  });

  const submitHandler = async (data: BuyerInput) => {
    try {
      await fetch(`/api/buyers/update/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {initialData ? "Edit Buyer Lead" : "New Buyer Lead"}
      </h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            {...register("fullName")}
            placeholder="Enter full name"
            className="mt-1 border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">This will be the buyer’s legal/full name.</p>
          {errors.fullName && <p className="text-red-600">{errors.fullName.message}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              {...register("email")}
              placeholder="example@email.com"
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500">Optional but useful for follow-ups.</p>
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              {...register("phone")}
              placeholder="9876543210"
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500">Required: 10–15 digits.</p>
            {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
          </div>
        </div>

        {/* City + Property Type + BHK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">City</label>
            <select
              {...register("city")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Mohali">Mohali</option>
              <option value="Zirakpur">Zirakpur</option>
              <option value="Panchkula">Panchkula</option>
              <option value="Other">Other</option>
            </select>
            {errors.city && <p className="text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Property Type</label>
            <select
              {...register("propertyType")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
            </select>
            {errors.propertyType && <p className="text-red-600">{errors.propertyType.message}</p>}
          </div>

          <div>
            <label className="block font-medium">BHK</label>
            <select
              {...register("bhk")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="BHK1">1 BHK</option>
              <option value="BHK2">2 BHK</option>
              <option value="BHK3">3 BHK</option>
              <option value="BHK4">4 BHK</option>
              <option value="Studio">Studio</option>
            </select>
            {errors.bhk && <p className="text-red-600">{errors.bhk.message}</p>}
          </div>
        </div>

        {/* Purpose + Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Purpose</label>
            <select
              {...register("purpose")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
            {errors.purpose && <p className="text-red-600">{errors.purpose.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Timeline</label>
            <select
              {...register("timeline")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="M0_3m">0–3 months</option>
              <option value="M3_6m">3–6 months</option>
              <option value="GT_6m">&gt;6 months</option>
              <option value="Exploring">Exploring</option>
            </select>
            {errors.timeline && <p className="text-red-600">{errors.timeline.message}</p>}
          </div>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Budget Min</label>
            <input
              type="number"
              {...register("budgetMin", { valueAsNumber: true })}
              placeholder="0"
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            {errors.budgetMin && <p className="text-red-600">{errors.budgetMin.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Budget Max</label>
            <input
              type="number"
              {...register("budgetMax", { valueAsNumber: true })}
              placeholder="1000000"
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            {errors.budgetMax && <p className="text-red-600">{errors.budgetMax.message}</p>}
          </div>
        </div>

        {/* Source + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Source</label>
            <select
              {...register("source")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Walk_in">Walk-in</option>
              <option value="Call">Call</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && <p className="text-red-600">{errors.source.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <select
              {...register("status")}
              className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Contacted">Contacted</option>
              <option value="Visited">Visited</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Dropped">Dropped</option>
            </select>
            {errors.status && <p className="text-red-600">{errors.status.message}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            {...register("notes")}
            placeholder="Additional info..."
            rows={3}
            className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
          {errors.notes && <p className="text-red-600">{errors.notes.message}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input
            {...register("tags")}
            placeholder="e.g. investor, urgent"
            className="mt-1 border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">Separate multiple tags with commas.</p>
          {errors.tags && <p className="text-red-600">{errors.tags.message}</p>}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

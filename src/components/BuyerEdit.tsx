"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBuyerSchema, BuyerInput } from "@/zod-schemas/schemas";
import { useParams } from "next/navigation";

interface BuyerFormProps {
  initialData?: Partial<BuyerInput>  ; // allow nulls, normalize tags
//   onSubmit: (values: BuyerInput) => Promise<void>;
}

export default function BuyerForm({ initialData }: BuyerFormProps) {
    const params= useParams()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BuyerInput>({
    resolver: zodResolver(createBuyerSchema),
    defaultValues: {
      ...initialData,
      // tags: [...initialData?.tags],
    } as any,
  });

  const [error, setError] = useState<string | null>(null);

  const submitHandler = async (data: BuyerInput) => {
    console.log(data)
    try {
      await fetch(`/api/buyers/update/${params.id}`,{
        method:"PATCH",
        body:JSON.stringify(data),
       headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 important
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 max-w-2xl">
      {error && <p className="text-red-600">{error}</p>}

      {/* Full Name */}
      <div>
        <label className="block font-medium">Full Name</label>
        <input {...register("fullName")} className="border px-2 py-1 w-full rounded" />
        {errors.fullName && <p className="text-red-600">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium">Email</label>
        <input {...register("email")} className="border px-2 py-1 w-full rounded" />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium">Phone</label>
        <input {...register("phone")} className="border px-2 py-1 w-full rounded" />
        {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block font-medium">City</label>
        <select {...register("city")} className="border px-2 py-1 w-full rounded">
          <option value="">Select</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        {errors.city && <p className="text-red-600">{errors.city.message}</p>}
      </div>

      {/* Property Type */}
      <div>
        <label className="block font-medium">Property Type</label>
        <select {...register("propertyType")} className="border px-2 py-1 w-full rounded">
          <option value="">Select</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        {errors.propertyType && <p className="text-red-600">{errors.propertyType.message}</p>}
      </div>

      {/* BHK */}
      <div>
        <label className="block font-medium">BHK</label>
        <select {...register("bhk")} className="border px-2 py-1 w-full rounded">
          <option value="">Select</option>
          <option value="BHK1">1 BHK</option>
          <option value="BHK2">2 BHK</option>
          <option value="BHK3">3 BHK</option>
          <option value="BHK4">4 BHK</option>
          <option value="Studio">Studio</option>
        </select>
        {errors.bhk && <p className="text-red-600">{errors.bhk.message}</p>}
      </div>

      {/* Purpose */}
      <div>
        <label className="block font-medium">Purpose</label>
        <select {...register("purpose")} className="border px-2 py-1 w-full rounded">
          <option value="">Select</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        {errors.purpose && <p className="text-red-600">{errors.purpose.message}</p>}
      </div>

      {/* Budget */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-medium">Budget Min</label>
          <input type="number" {...register("budgetMin")} className="border px-2 py-1 w-full rounded" />
          {errors.budgetMin && <p className="text-red-600">{errors.budgetMin.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Budget Max</label>
          <input type="number" {...register("budgetMax")} className="border px-2 py-1 w-full rounded" />
          {errors.budgetMax && <p className="text-red-600">{errors.budgetMax.message}</p>}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block font-medium">Timeline</label>
        <select {...register("timeline")} className="border px-2 py-1 w-full rounded">
          <option value="M0_3m">0–3 months</option>
          <option value="M3_6m">3–6 months</option>
          <option value="GT_6m">&gt;6 months</option>
          <option value="Exploring">Exploring</option>
        </select>
        {errors.timeline && <p className="text-red-600">{errors.timeline.message}</p>}
      </div>

      {/* Source */}
      <div>
        <label className="block font-medium">Source</label>
        <select {...register("source")} className="border px-2 py-1 w-full rounded">
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Walk_in">Walk-in</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
        {errors.source && <p className="text-red-600">{errors.source.message}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block font-medium">Status</label>
        <select {...register("status")} className="border px-2 py-1 w-full rounded">
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

      {/* Notes */}
      <div>
        <label className="block font-medium">Notes</label>
        <textarea {...register("notes")} className="border px-2 py-1 w-full rounded" rows={3} />
        {errors.notes && <p className="text-red-600">{errors.notes.message}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block font-medium">Tags (comma separated)</label>
        <input {...register("tags")} className="border px-2 py-1 w-full rounded" />
        {errors.tags && <p className="text-red-600">{errors.tags.message}</p>}
      </div>

      {/* Hidden updatedAt for concurrency */}
      {/* <input type="hidden" {...register("updatedAt")} /> */}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

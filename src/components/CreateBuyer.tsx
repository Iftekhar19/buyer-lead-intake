"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBuyerSchema } from "@/zod-schemas/schemas";

type SchemaType = z.infer<typeof createBuyerSchema>;

type FormValues = Omit<SchemaType, "tags"> & { tags?: string | string[] };

export default function BuyerForm({ onSubmit }: { onSubmit: (payload: SchemaType) => Promise<void> | void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createBuyerSchema as any), 
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "Chandigarh",
      propertyType: "Apartment",
      purpose: "Buy",
      timeline: "M0_3m",
      source: "Website",
      notes: "",
      tags: "", 
      status: "New",
    },
  });

  const propertyType = watch("propertyType");


  const parseTags = (v?: string | string[]) => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
    if (typeof v === "string") {
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return undefined;
  };

  const internalSubmit = async (values: FormValues) => {
    const tags = parseTags(values.tags);
    const payload: SchemaType = {
  
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      city: values.city as SchemaType["city"],
      propertyType: values.propertyType as SchemaType["propertyType"],
      bhk: (values as any).bhk, // could be undefined
      purpose: values.purpose as SchemaType["purpose"],
      budgetMin: values.budgetMin ?? undefined,
      budgetMax: values.budgetMax ?? undefined,
      timeline: values.timeline as SchemaType["timeline"],
      source: values.source as SchemaType["source"],
      notes: values.notes ?? undefined,
      tags: tags ?? undefined,
      status: (values.status ?? "New") as SchemaType["status"],
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4 my-4 max-w-lg mx-auto p-4 border rounded-lg shadow">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block font-medium">Full Name</label>
        <input id="fullName" {...register("fullName")} className="w-full border rounded p-2" />
        {errors.fullName && <p role="alert" className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium">Email</label>
        <input id="email" type="email" {...register("email")} className="w-full border rounded p-2" />
        {errors.email && <p role="alert" className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-medium">Phone</label>
        <input id="phone" {...register("phone")} className="w-full border rounded p-2" />
        {errors.phone && <p role="alert" className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block font-medium">City</label>
        <select id="city" {...register("city")} className="w-full border rounded p-2">
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label htmlFor="propertyType" className="block font-medium">Property Type</label>
        <select id="propertyType" {...register("propertyType")} className="w-full border rounded p-2">
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
      </div>

      {/* BHK (conditional) */}
      {(propertyType === "Apartment" || propertyType === "Villa") && (
        <div>
          <label htmlFor="bhk" className="block font-medium">BHK</label>
          <select id="bhk" {...register("bhk" as any)} className="w-full border rounded p-2">
            <option value="">Select</option>
            <option value="BHK1">1 BHK</option>
            <option value="BHK2">2 BHK</option>
            <option value="BHK3">3 BHK</option>
            <option value="BHK4">4 BHK</option>
            <option value="Studio">Studio</option>
          </select>
          {errors.bhk && <p role="alert" className="text-red-500 text-sm">{(errors as any).bhk?.message}</p>}
        </div>
      )}

      {/* Purpose */}
      <div>
        <label htmlFor="purpose" className="block font-medium">Purpose</label>
        <select id="purpose" {...register("purpose")} className="w-full border rounded p-2">
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
      </div>

      {/* Budget Min / Max */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="budgetMin" className="block font-medium">Budget Min (₹)</label>
          <input id="budgetMin" type="number" {...register("budgetMin", { valueAsNumber: true })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label htmlFor="budgetMax" className="block font-medium">Budget Max (₹)</label>
          <input id="budgetMax" type="number" {...register("budgetMax", { valueAsNumber: true })} className="w-full border rounded p-2" />
          {errors.budgetMax && <p role="alert" className="text-red-500 text-sm">{(errors as any).budgetMax?.message}</p>}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor="timeline" className="block font-medium">Timeline</label>
        <select id="timeline" {...register("timeline")} className="w-full border rounded p-2">
          <option value="M0_3m">0-3m</option>
          <option value="M3_6m">3-6m</option>
          <option value="GT>6m">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block font-medium">Source</label>
        <select id="source" {...register("source")} className="w-full border rounded p-2">
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Walk-in">Walk-in</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block font-medium">Notes</label>
        <textarea id="notes" {...register("notes")} rows={3} className="w-full border rounded p-2" />
        {errors.notes && <p role="alert" className="text-red-500 text-sm">{(errors as any).notes?.message}</p>}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block font-medium">Tags (comma separated)</label>
        <input
          id="tags"
          {...register("tags" as any, {
            // robust setValueAs: handles string | string[] | undefined
            setValueAs: (v: unknown) => {
              if (!v) return undefined;
              if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
              if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
              return undefined;
            },
          })}
          className="w-full border rounded p-2"
        />
        {errors.tags && <p role="alert" className="text-red-500 text-sm">{(errors as any).tags?.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={isSubmitting} className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700">
        {isSubmitting ? "Saving..." : "Save Buyer"}
      </button>
    </form>
  );
}

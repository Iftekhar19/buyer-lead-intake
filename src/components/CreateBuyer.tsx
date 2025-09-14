"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBuyerSchema } from "@/zod-schemas/schemas";

type SchemaType = z.infer<typeof createBuyerSchema>;
type FormValues = Omit<SchemaType, "tags"> & { tags?: string | string[] };

export default function BuyerForm({
  onSubmit,
}: {
  onSubmit: (payload: SchemaType) => Promise<void> | void;
}) {
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

  const internalSubmit = async (values: FormValues) => {
    const tags =
      typeof values.tags === "string"
        ? values.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(values.tags)
        ? values.tags
        : undefined;

    const payload: SchemaType = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      city: values.city as SchemaType["city"],
      propertyType: values.propertyType as SchemaType["propertyType"],
      bhk: (values as any).bhk,
      purpose: values.purpose as SchemaType["purpose"],
      budgetMin: values.budgetMin ?? undefined,
      budgetMax: values.budgetMax ?? undefined,
      timeline: values.timeline as SchemaType["timeline"],
      source: values.source as SchemaType["source"],
      notes: values.notes ?? undefined,
      tags,
      status: (values.status ?? "New") as SchemaType["status"],
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(internalSubmit)}
      className="space-y-4 my-4 max-w-2xl mx-auto p-6 border rounded-lg shadow bg-white"
    >
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block font-medium">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          {...register("fullName")}
          className="w-full border rounded p-2"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full border rounded p-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-medium">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          {...register("phone")}
          className="w-full border rounded p-2"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block font-medium">
          City <span className="text-red-500">*</span>
        </label>
        <select
          id="city"
          {...register("city")}
          className="w-full border rounded p-2"
        >
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>

      {/* Property Type */}
      <div>
        <label htmlFor="propertyType" className="block font-medium">
          Property Type <span className="text-red-500">*</span>
        </label>
        <select
          id="propertyType"
          {...register("propertyType")}
          className="w-full border rounded p-2"
        >
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        {errors.propertyType && (
          <p className="text-red-500 text-sm">{errors.propertyType.message}</p>
        )}
      </div>

      {/* BHK (conditional) */}
      {(propertyType === "Apartment" || propertyType === "Villa") && (
        <div>
          <label htmlFor="bhk" className="block font-medium">
            BHK <span className="text-red-500">*</span>
          </label>
          <select
            id="bhk"
            {...register("bhk" as any)}
            className="w-full border rounded p-2"
          >
            <option value="">Select</option>
            <option value="BHK1">1 BHK</option>
            <option value="BHK2">2 BHK</option>
            <option value="BHK3">3 BHK</option>
            <option value="BHK4">4 BHK</option>
            <option value="Studio">Studio</option>
          </select>
          {errors.bhk && (
            <p className="text-red-500 text-sm">{(errors as any).bhk.message}</p>
          )}
        </div>
      )}

      {/* Purpose */}
      <div>
        <label htmlFor="purpose" className="block font-medium">
          Purpose <span className="text-red-500">*</span>
        </label>
        <select
          id="purpose"
          {...register("purpose")}
          className="w-full border rounded p-2"
        >
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        {errors.purpose && (
          <p className="text-red-500 text-sm">{errors.purpose.message}</p>
        )}
      </div>

      {/* Budget Min / Max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budgetMin" className="block font-medium">
            Budget Min (₹)
          </label>
          <input
            id="budgetMin"
            type="number"
            {...register("budgetMin", { valueAsNumber: true })}
            className="w-full border rounded p-2"
          />
          {errors.budgetMin && (
            <p className="text-red-500 text-sm">{errors.budgetMin.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="budgetMax" className="block font-medium">
            Budget Max (₹)
          </label>
          <input
            id="budgetMax"
            type="number"
            {...register("budgetMax", { valueAsNumber: true })}
            className="w-full border rounded p-2"
          />
          {errors.budgetMax && (
            <p className="text-red-500 text-sm">{errors.budgetMax.message}</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor="timeline" className="block font-medium">
          Timeline <span className="text-red-500">*</span>
        </label>
        <select
          id="timeline"
          {...register("timeline")}
          className="w-full border rounded p-2"
        >
          <option value="M0_3m">0-3m</option>
          <option value="M3_6m">3-6m</option>
          <option value="GT>6m">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>
        {errors.timeline && (
          <p className="text-red-500 text-sm">{errors.timeline.message}</p>
        )}
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block font-medium">
          Source <span className="text-red-500">*</span>
        </label>
        <select
          id="source"
          {...register("source")}
          className="w-full border rounded p-2"
        >
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Walk-in">Walk-in</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
        {errors.source && (
          <p className="text-red-500 text-sm">{errors.source.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="w-full border rounded p-2"
        />
        {errors.notes && (
          <p className="text-red-500 text-sm">{errors.notes.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block font-medium">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          {...register("tags" as any)}
          className="w-full border rounded p-2"
        />
        {errors.tags && (
          <p className="text-red-500 text-sm">{(errors as any).tags.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Buyer"}
      </button>
    </form>
  );
}

"use client";

import BuyerForm from "@/components/CreateBuyer";
import { createBuyerSchema } from "@/zod-schemas/schemas";
import { useRouter } from "next/navigation";

import z from "zod";

type SchemaType = z.infer<typeof createBuyerSchema>;

export default function NewBuyerPage() {
  const navigate=useRouter()
  const handleSubmit = async (payload: SchemaType) => {
    try {
      console.log(payload);

      const res = await fetch("/api/buyers/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to save buyer:", error);
        alert(`Error: ${error.message || "Something went wrong"}`);
        return;
      }

      const data = await res.json();
      console.log("Buyer saved:", data);
      alert("Buyer saved successfully!");
      navigate.replace(`/buyers?page=1`)
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong while saving buyer");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 sm:p-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Create New Buyer
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Fill out the form below to add a new buyer lead.
          </p>
        </div>

        {/* Form */}
        <BuyerForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}

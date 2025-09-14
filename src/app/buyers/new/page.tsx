"use client"
import BuyerForm from "@/components/CreateBuyer";
import { createBuyerSchema } from "@/zod-schemas/schemas"; // adjust path
import z from "zod";

type SchemaType = z.infer<typeof createBuyerSchema>;

export default function NewBuyerPage() {
  const handleSubmit = async (payload: SchemaType) => {
    try {
        console.log(payload)
      // Call your backend API route
      const res = await fetch("http://localhost:3000/api/buyers/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials:"include"
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to save buyer:", error);
        alert(`Error: ${error.message || "Something went wrong"}`);
        return;
      }

      // ✅ Success
      const data = await res.json();
      console.log("Buyer saved:", data);
      alert("Buyer saved successfully!");

    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong while saving buyer");
    }
  };

  return <BuyerForm onSubmit={handleSubmit} />;
}

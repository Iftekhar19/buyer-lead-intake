"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeleteBuyerButton = ({ buyerId }: { buyerId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this buyer and all history?"))
      return;
    try {
      setLoading(true);

      const res = await fetch(`/api/buyers/delete/${buyerId}`, {
        method: "DELETE",
      });

      alert("Buyer deleted");
      router.back();
    } catch (error) {
      alert("Failed to delete buyer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-white bg-red-400 px-4 py-2 rounded-xl"
      >
        {loading ? "Deleting..." : "Delete Buyer"}
      </button>
    </div>
  );
};

export default DeleteBuyerButton;

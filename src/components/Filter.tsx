"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  searchParams: Record<string, string | undefined>;
}

function sanitizeParams(params: Record<string, string | undefined>) {
  const allowed: Record<string, string> = {};
  for (const key of ["city", "propertyType", "status", "timeline", "q", "page"]) {
    if (params[key]) allowed[key] = String(params[key]);
  }
  return allowed;
}

export default function Filters({ searchParams }: Props) {
  const router = useRouter();

  // local states
  const [query, setQuery] = useState(searchParams.q || "");
  const [city, setCity] = useState(searchParams.city || "");
  const [propertyType, setPropertyType] = useState(searchParams.propertyType || "");
  const [status, setStatus] = useState(searchParams.status || "");
  const [timeline, setTimeline] = useState(searchParams.timeline || "");

  // sync local state with props
  useEffect(() => {
    setQuery(searchParams.q || "");
    setCity(searchParams.city || "");
    setPropertyType(searchParams.propertyType || "");
    setStatus(searchParams.status || "");
    setTimeline(searchParams.timeline || "");
  }, [searchParams]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      updateParams({ q: query, page: "1" });
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const updateParams = (updates: Record<string, string>) => {
    const clean = sanitizeParams({
      ...searchParams,
      q: query,
      city,
      propertyType,
      status,
      timeline,
      ...updates,
    });

    const params = new URLSearchParams();
    Object.entries(clean).forEach(([key, val]) => {
      if (val) params.set(key, String(val));
    });

    router.push(`/buyers?${params.toString()}`);
  };

  const handleDropdown = (
    key: "city" | "propertyType" | "status" | "timeline",
    value: string
  ) => {
    if (key === "city") setCity(value);
    if (key === "propertyType") setPropertyType(value);
    if (key === "status") setStatus(value);
    if (key === "timeline") setTimeline(value);
     console.log(key,value)
    updateParams({ [key]: value, page: "1" });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <input
        type="text"
        placeholder="Search buyers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-1 rounded"
      />

      {/* City */}
      <select
        value={city}
        onChange={(e) => handleDropdown("city", e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Cities</option>
        <option value="Chandigarh">Chandigarh</option>
        <option value="Mohali">Mohali</option>
        <option value="Zirakpur">Zirakpur</option>
        <option value="Panchkula">Panchkula</option>
      </select>

      {/* Property Type */}
      <select
        value={propertyType}
        onChange={(e) => handleDropdown("propertyType", e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Property Types</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Plot">Plot</option>
        <option value="Office">Office</option>
        <option value="Retail">Retail</option>
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => handleDropdown("status", e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Status</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Visited">Visited</option>
        <option value="Negotiation">Negotiation</option>
        <option value="Converted">Converted</option>
        <option value="Dropped">Dropped</option>
      </select>

      {/* Timeline */}
      <select
        value={timeline}
        onChange={(e) => handleDropdown("timeline", e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Timelines</option>
        <option value="M0_3m">0–3 months</option>
        <option value="M3_6m">3–6 months</option>
        <option value="GT_6m">&gt;6 months</option>
        <option value="Exploring">Exploring</option>
      </select>
    </div>
  );
}


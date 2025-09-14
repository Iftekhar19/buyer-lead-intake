"use client";

import React, { useRef, useState } from "react";

export default function CsvImportExport({ currentQuery }: { currentQuery?: Record<string, string | undefined> }) {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Array<{ row: number; message: string }>>([]);
  const [result, setResult] = useState<{ inserted: number; totalRows: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef=useRef<HTMLInputElement|null>(null)

  const onFile = (f?: File) => setFile(f ?? null);

  const handleUpload = async () => {
    if (!file) {
      alert("Choose a CSV file first");
      return;
    }
    setLoading(true);
    setErrors([]);
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/buyers/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Import failed");
        setLoading(false);
        return;
      }
      setErrors(data.errors || []);
      setResult({ inserted: data.inserted || 0, totalRows: data.totalRows || 0 });
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    // Build query string from currentQuery
    const params = new URLSearchParams();
    if (currentQuery) {
      Object.entries(currentQuery).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    const url = `/api/buyers/export?${params.toString()}`;
    // download
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Export failed");
      return;
    }
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "buyers_export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 boder">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => onFile(e.target.files?.[0])}
            className=" border w-[200px] px-4 py-1 placeholder:hidden hidden" 
            ref={fileRef}
           
          />
          <button onClick={() => fileRef.current && fileRef.current.click()} className="border px-4 py-1">Choose File</button>
          {file && file.name}
        </label>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Importing..." : "Import CSV"}
        </button>

        <button
          className="px-4 py-2 bg-gray-800 text-white rounded"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>

      {result && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          Inserted {result.inserted} of {result.totalRows} rows.
        </div>
      )}

      {errors.length > 0 && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-red-50">
              <tr>
                <th className="px-3 py-2 text-left">Row</th>
                <th className="px-3 py-2 text-left">Error</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((e) => (
                <tr key={e.row} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2">{e.row}</td>
                  <td className="px-3 py-2">{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

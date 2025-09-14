"use client";

import React, { useRef, useState } from "react";
import { Upload, Download, File as FileIcon } from "lucide-react"; // optional icons

export default function CsvImportExport({
  currentQuery,
}: {
  currentQuery?: Record<string, string | undefined>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Array<{ row: number; message: string }>>(
    []
  );
  const [result, setResult] = useState<{ inserted: number; totalRows: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onFile = (f?: File) => setFile(f ?? null);

  const handleUpload = async () => {
    if (!file) return alert("Choose a CSV file first");
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
    const params = new URLSearchParams();
    if (currentQuery) {
      Object.entries(currentQuery).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    const url = `/api/buyers/export?${params.toString()}`;

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
    <div className="bg-white shadow-sm rounded-xl p-4  space-y-4">
      {/* Action buttons */}
      <div className="flex fflex-row items-center gap-3">
        {/* File input */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => onFile(e.target.files?.[0])}
          ref={fileRef}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 whitespace-nowrap px-2 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition"
        >
          <FileIcon className="w-4 h-4 text-gray-500" />
          {file ? file.name : "Choose CSV"}
        </button>

        {/* Import */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="flex items-center gap-2 whitespace-nowrap px-2 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 transition"
        >
          <Upload className="w-4 h-4" />
          {loading ? "Importing..." : "Import CSV"}
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center whitespace-nowrap px-2 py-2 gap-2  rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Success message */}
      {result && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✅ Inserted {result.inserted} of {result.totalRows} rows.
        </div>
      )}

      {/* Error table */}
      {errors.length > 0 && (
        <div className="overflow-auto border rounded-lg max-h-56">
          <table className="min-w-full text-sm">
            <thead className="bg-red-50 text-red-700">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Row</th>
                <th className="px-3 py-2 text-left font-medium">Error</th>
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

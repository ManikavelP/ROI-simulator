"use client";

import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (email: string) => void;
  isGenerating: boolean;
}

export default function ReportModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: ReportModalProps) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">
          Generate Your PDF Report
        </h2>
        <p className="text-gray-400 mb-6">
          Enter your email address to download the full ROI report.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@company.com"
            required
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm p-2 mb-4"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isGenerating ? "Generating..." : "Download Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

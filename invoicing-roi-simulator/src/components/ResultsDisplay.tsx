"use client";

interface ResultsDisplayProps {
  results: {
    monthly_savings: number;
    payback_months: number | string;
    roi_percentage: number | string;
  } | null;
}

// 1. Define a specific interface for the StatCard props
interface StatCardProps {
  label: string;
  // 2. Replace 'any' with the correct types
  value: string | number;
  unit?: string;
}

// 3. Use the new interface for the component's props
const StatCard = ({ label, value, unit }: StatCardProps) => (
  <div className="bg-gray-800 rounded-lg p-4 text-center">
    <dt className="text-sm font-medium text-gray-400 truncate">{label}</dt>
    <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
      {value}
      {unit && (
        <span className="text-xl font-medium text-gray-300"> {unit}</span>
      )}
    </dd>
  </div>
);

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        Simulation Results
      </h2>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Estimated Monthly Savings"
          value={`$${results.monthly_savings.toLocaleString()}`}
        />
        <StatCard
          label="Payback Period"
          value={results.payback_months}
          unit="months"
        />
        <StatCard
          label="Return on Investment (ROI)"
          value={results.roi_percentage}
          unit="%"
        />
      </dl>
    </div>
  );
}

"use client";

// 1. Define a specific interface for your form data
interface FormData {
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost?: number; // This field is optional
}

// The 'use client' directive is necessary for components with hooks and event handlers
interface InputFormProps {
  // 2. Use the new FormData interface here instead of 'any'
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function InputForm({
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
}: InputFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... rest of your JSX remains the same ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="monthly_invoice_volume"
            className="block text-sm font-medium text-gray-300"
          >
            Monthly Invoices
          </label>
          <input
            type="number"
            name="monthly_invoice_volume"
            id="monthly_invoice_volume"
            value={formData.monthly_invoice_volume}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="num_ap_staff"
            className="block text-sm font-medium text-gray-300"
          >
            AP Staff Size
          </label>
          <input
            type="number"
            name="num_ap_staff"
            id="num_ap_staff"
            value={formData.num_ap_staff}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="avg_hours_per_invoice"
            className="block text-sm font-medium text-gray-300"
          >
            Avg Hours per Invoice (e.g., 0.17 for 10 mins)
          </label>
          <input
            type="number"
            name="avg_hours_per_invoice"
            id="avg_hours_per_invoice"
            step="0.01"
            value={formData.avg_hours_per_invoice}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="hourly_wage"
            className="block text-sm font-medium text-gray-300"
          >
            Avg Hourly Wage ($)
          </label>
          <input
            type="number"
            name="hourly_wage"
            id="hourly_wage"
            value={formData.hourly_wage}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="error_rate_manual"
            className="block text-sm font-medium text-gray-300"
          >
            Manual Error Rate (%)
          </label>
          <input
            type="number"
            name="error_rate_manual"
            id="error_rate_manual"
            step="0.1"
            value={formData.error_rate_manual}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="error_cost"
            className="block text-sm font-medium text-gray-300"
          >
            Avg Cost per Error ($)
          </label>
          <input
            type="number"
            name="error_cost"
            id="error_cost"
            value={formData.error_cost}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="time_horizon_months"
            className="block text-sm font-medium text-gray-300"
          >
            Time Horizon (Months)
          </label>
          <input
            type="number"
            name="time_horizon_months"
            id="time_horizon_months"
            value={formData.time_horizon_months}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="one_time_implementation_cost"
            className="block text-sm font-medium text-gray-300"
          >
            Implementation Cost ($) (Optional)
          </label>
          <input
            type="number"
            name="one_time_implementation_cost"
            id="one_time_implementation_cost"
            value={formData.one_time_implementation_cost}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {isLoading ? "Calculating..." : "Simulate ROI"}
      </button>
    </form>
  );
}

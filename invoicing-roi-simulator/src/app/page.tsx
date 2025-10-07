// HomePage.tsx (Corrected)
"use client";

import { useState, useEffect } from "react";
// Import AxiosError and the isAxiosError type guard
import axios, { AxiosError } from "axios";
import InputForm from "@/components/InputForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import ScenarioList from "@/components/ScenarioList";
import ReportModal from "@/components/ReportModal";

// --- TYPE DEFINITIONS (No changes needed here) ---
type Results = {
  monthly_savings: number;
  payback_months: number | string;
  roi_percentage: number | string;
};

type Scenario = {
  _id: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost: number;
  scenario_name: string;
  monthly_savings: number;
  payback_months: number | string;
  roi_percentage: number | string;
};

export default function HomePage() {
  // --- STATE VARIABLES (No changes needed here) ---
  const [formData, setFormData] = useState({
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000,
  });
  const [results, setResults] = useState<Results | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- API & DATA HANDLING FUNCTIONS ---
  const fetchScenarios = async () => {
    try {
      const response = await axios.get("/api/scenarios");
      setScenarios(response.data);
    } catch (err) {
      // It's good practice to also type check here.
      if (axios.isAxiosError(err)) {
        console.error("Failed to fetch scenarios", err.message);
        setError("Could not load saved scenarios.");
      } else {
        console.error("An unexpected error occurred", err);
        setError("An unexpected error occurred while fetching scenarios.");
      }
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await axios.post("/api/simulate", formData);
      setResults(response.data);
    } catch (err) {
      // --- FIXED ---
      if (axios.isAxiosError<{ error: string }>(err)) {
        setError(
          err.response?.data?.error || "An error occurred during simulation."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveScenario = async () => {
    if (!results || !scenarioName) {
      setError(
        "Please run a simulation and provide a scenario name before saving."
      );
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = { ...formData, ...results, scenario_name: scenarioName };
      await axios.post("/api/scenarios", payload);
      setScenarioName("");
      await fetchScenarios();
    } catch (err) {
      // --- FIXED ---
      if (axios.isAxiosError<{ error: string }>(err)) {
        setError(err.response?.data?.error || "Failed to save the scenario.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    try {
      await axios.delete(`/api/scenarios/${id}`);
      setScenarios(scenarios.filter((s) => s._id !== id));
    } catch (err) {
      // --- FIXED ---
      if (axios.isAxiosError<{ error: string }>(err)) {
        setError(err.response?.data?.error || "Failed to delete the scenario.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleLoadScenario = async (id: string) => {
    try {
      const response = await axios.get(`/api/scenarios/${id}`);
      const scenarioToLoad: Scenario = response.data;
      setFormData({
        monthly_invoice_volume: scenarioToLoad.monthly_invoice_volume,
        num_ap_staff: scenarioToLoad.num_ap_staff,
        avg_hours_per_invoice: scenarioToLoad.avg_hours_per_invoice,
        hourly_wage: scenarioToLoad.hourly_wage,
        error_rate_manual: scenarioToLoad.error_rate_manual,
        error_cost: scenarioToLoad.error_cost,
        time_horizon_months: scenarioToLoad.time_horizon_months,
        one_time_implementation_cost:
          scenarioToLoad.one_time_implementation_cost,
      });
      setResults({
        monthly_savings: scenarioToLoad.monthly_savings,
        payback_months: scenarioToLoad.payback_months,
        roi_percentage: scenarioToLoad.roi_percentage,
      });
      setError(null);
      window.scrollTo(0, 0);
    } catch (err) {
      // --- FIXED ---
      if (axios.isAxiosError<{ error: string }>(err)) {
        setError(err.response?.data?.error || "Failed to load the scenario.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleGenerateReport = async (email: string) => {
    if (!results) {
      setError("Please run a simulation first.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const response = await axios.post(
        "/api/report/generate",
        {
          email,
          results,
          inputs: formData,
          scenario_name: scenarioName || "Untitled Scenario",
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ROI_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsModalOpen(false);
    } catch (err) {
      // --- FIXED ---
      if (axios.isAxiosError(err)) {
        // Blob errors are handled differently, so a generic message is fine
        setError("Failed to generate PDF report.");
      } else {
        setError("An unexpected error occurred during report generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // --- JSX RENDER (No changes needed here) ---
  return (
    <main className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      {/* ... rest of your JSX ... */}
      <div className="max-w-4xl mx-auto pb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Invoicing ROI Simulator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Discover the cost savings of switching to automated invoicing.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <InputForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="mt-4 text-center bg-red-800 text-red-200 p-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results && (
          <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <ResultsDisplay results={results} />

            <div className="mt-6 border-t border-gray-700 pt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Generate PDF Report
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="Enter scenario name to save"
                className="flex-grow rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
              <button
                onClick={handleSaveScenario}
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              >
                {isSaving ? "Saving..." : "Save Scenario"}
              </button>
            </div>
          </div>
        )}

        <ScenarioList
          scenarios={scenarios}
          onLoad={handleLoadScenario}
          onDelete={handleDeleteScenario}
        />
      </div>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerateReport}
        isGenerating={isGenerating}
      />
    </main>
  );
}

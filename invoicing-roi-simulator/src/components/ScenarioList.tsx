"use client";

// 1. Define an interface for a single scenario object
interface Scenario {
  _id: string;
  scenario_name: string;
  monthly_savings: number;
}

// 2. Use the new Scenario interface for the array
interface ScenarioListProps {
  scenarios: Scenario[];
  onLoad: (id: string) => void; // Function to handle loading
  onDelete: (id: string) => void; // Function to handle deleting
}

export default function ScenarioList({
  scenarios,
  onLoad,
  onDelete,
}: ScenarioListProps) {
  if (scenarios.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p>No saved scenarios yet. Run a simulation and save it!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        Saved Scenarios
      </h2>
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <ul role="list" className="divide-y divide-gray-700">
          {scenarios.map((scenario) => (
            <li
              key={scenario._id}
              className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              {/* Scenario Info */}
              <div className="flex-grow">
                <p className="text-md font-medium text-white">
                  {scenario.scenario_name}
                </p>
                <p className="text-sm text-green-400">
                  ${scenario.monthly_savings.toLocaleString()} / mo
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => onLoad(scenario._id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(scenario._id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

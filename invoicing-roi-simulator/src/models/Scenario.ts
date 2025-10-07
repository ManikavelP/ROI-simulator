import mongoose from "mongoose";

const ScenarioSchema = new mongoose.Schema(
  {
    // --- Inputs ---
    scenario_name: { type: String, required: true, trim: true },
    monthly_invoice_volume: { type: Number, required: true },
    num_ap_staff: { type: Number, required: true },
    avg_hours_per_invoice: { type: Number, required: true },
    hourly_wage: { type: Number, required: true },
    error_rate_manual: { type: Number, required: true },
    error_cost: { type: Number, required: true },
    time_horizon_months: { type: Number, required: true },
    one_time_implementation_cost: { type: Number, required: true },

    // --- Results ---
    monthly_savings: { type: Number, required: true },
    payback_months: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be number or string "N/A"
    roi_percentage: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be number or string "Infinite"
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.models.Scenario ||
  mongoose.model("Scenario", ScenarioSchema);

import { NextResponse } from "next/server";

// This function handles POST requests to /api/simulate
export async function POST(request: Request) {
  try {
    // 1. Parse the incoming request body as JSON
    const body = await request.json();
    const {
      monthly_invoice_volume,
      num_ap_staff,
      avg_hours_per_invoice,
      hourly_wage,
      error_rate_manual,
      error_cost,
      time_horizon_months,
      one_time_implementation_cost = 0, // Default to 0 if not provided
    } = body;

    // 2. Basic input validation
    const requiredFields = [
      "monthly_invoice_volume",
      "num_ap_staff",
      "avg_hours_per_invoice",
      "hourly_wage",
      "error_rate_manual",
      "error_cost",
      "time_horizon_months",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || isNaN(parseFloat(body[field]))) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 3. Define Internal Server-Side Constants (as per PRD)
    const automated_cost_per_invoice = 0.2;
    const error_rate_auto = 0.001; // 0.1%
    // const time_saved_per_invoice = 8; // Not directly used in cost formulas, but good to have
    const min_roi_boost_factor = 1.1;

    // 4. Perform the Calculation Logic (as per PRD)
    // Convert manual error rate from percentage to decimal
    const manual_error_rate_decimal = error_rate_manual / 100;

    const labor_cost_manual =
      num_ap_staff *
      hourly_wage *
      avg_hours_per_invoice *
      monthly_invoice_volume;

    const auto_cost = monthly_invoice_volume * automated_cost_per_invoice;

    const error_savings =
      (manual_error_rate_decimal - error_rate_auto) *
      monthly_invoice_volume *
      error_cost;

    let monthly_savings = labor_cost_manual + error_savings - auto_cost;

    // Apply the bias factor
    monthly_savings = monthly_savings * min_roi_boost_factor;

    const cumulative_savings = monthly_savings * time_horizon_months;
    const net_savings = cumulative_savings - one_time_implementation_cost;

    // Handle division by zero for payback
    const payback_months =
      monthly_savings > 0
        ? one_time_implementation_cost / monthly_savings
        : Infinity;

    // Handle division by zero for ROI
    const roi_percentage =
      one_time_implementation_cost > 0
        ? (net_savings / one_time_implementation_cost) * 100
        : Infinity;

    // 5. Structure the response
    const results = {
      monthly_savings: parseFloat(monthly_savings.toFixed(2)),
      cumulative_savings: parseFloat(cumulative_savings.toFixed(2)),
      net_savings: parseFloat(net_savings.toFixed(2)),
      payback_months:
        payback_months === Infinity
          ? "N/A"
          : parseFloat(payback_months.toFixed(1)),
      roi_percentage:
        roi_percentage === Infinity
          ? "Infinite"
          : parseFloat(roi_percentage.toFixed(2)),
    };

    // 6. Return the results as JSON
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

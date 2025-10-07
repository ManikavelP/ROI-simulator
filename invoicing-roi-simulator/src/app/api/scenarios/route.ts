import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Scenario from "@/models/Scenario";

// Handler for POST requests to save a scenario
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation to ensure a name is provided
    if (!body.scenario_name) {
      return NextResponse.json(
        { error: "Scenario name is required." },
        { status: 400 }
      );
    }

    const newScenario = await Scenario.create(body);
    return NextResponse.json(newScenario, { status: 201 }); // 201 Created
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save scenario." },
      { status: 500 }
    );
  }
}

// Handler for GET requests to fetch all scenarios
export async function GET() {
  try {
    await dbConnect();
    const scenarios = await Scenario.find({}).sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json(scenarios);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch scenarios." },
      { status: 500 }
    );
  }
}

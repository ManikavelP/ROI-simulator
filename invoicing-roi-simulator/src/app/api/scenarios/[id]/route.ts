import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Scenario from "@/models/Scenario";

// Handler for GET /api/scenarios/:id (Get a single scenario)
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id; // Get id from context
    await dbConnect();
    const scenario = await Scenario.findById(id);

    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(scenario);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch scenario" },
      { status: 500 }
    );
  }
}

// Handler for DELETE /api/scenarios/:id (Delete a single scenario)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id; // Get id from context
    await dbConnect();
    const deletedScenario = await Scenario.findByIdAndDelete(id);

    if (!deletedScenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Scenario deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete scenario" },
      { status: 500 }
    );
  }
}

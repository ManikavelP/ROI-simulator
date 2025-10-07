import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer"; // Use the main import
import { ReportDocument } from "@/components/ReportDocument";

// Force this route to run on the Node.js runtime
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, results, inputs, scenario_name } = body;

    console.log(`Lead Captured: Generating report for ${email}`);

    if (!results || !inputs) {
      return NextResponse.json(
        { error: "Missing results or inputs data" },
        { status: 400 }
      );
    }

    // Use renderToBuffer to directly create the PDF buffer in one step
    const pdfBuffer = await renderToBuffer(
      <ReportDocument data={{ results, inputs, scenario_name }} />
    );

    // Convert Node.js Buffer to Uint8Array for the Response constructor
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    // Return the buffer directly in the response
    return new Response(pdfUint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ROI_Report.pdf"',
      },
    });
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report." },
      { status: 500 }
    );
  }
}

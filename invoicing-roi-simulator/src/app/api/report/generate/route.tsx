import { NextResponse } from "next/server";
import React from "react";
// 1. Change the import to use 'renderToBuffer' from the '/node' entrypoint
import { renderToBuffer } from "@react-pdf/renderer/node";
import { ReportDocument } from "@/components/ReportDocument";

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

    // 2. Render the React component to a Buffer
    const pdfBuffer = await renderToBuffer(
      <ReportDocument data={{ results, inputs, scenario_name }} />
    );

    // 3. Return the buffer in the Response (no 'as any' needed)
    return new Response(pdfBuffer, {
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

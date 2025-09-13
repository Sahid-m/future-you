import { dbStore } from "@/lib/memory-store";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, inputs, results, aiStory } = await request.json();

    if (!name || !inputs || !results) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const scenarioId = await dbStore.saveScenario({
      name,
      inputs,
      results,
      aiStory,
    });

    return NextResponse.json({ scenarioId, success: true });
  } catch (error) {
    console.error("Error saving scenario:", error);
    return NextResponse.json(
      { error: "Failed to save scenario" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const scenarios = await dbStore.getAllScenarios();
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    return NextResponse.json(
      { error: "Failed to fetch scenarios" },
      { status: 500 }
    );
  }
}

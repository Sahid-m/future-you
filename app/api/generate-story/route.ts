import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { projections, formData } = await request.json();

    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is required" },
        { status: 500 }
      );
    }

    // Health
    const lifeExpectancy = projections?.health?.lifeExpectancy ?? 0;
    const healthStr =
      lifeExpectancy > 0
        ? `+${lifeExpectancy.toFixed(1)} years life expectancy`
        : `${lifeExpectancy.toFixed(1)} years life expectancy impact`;

    // Climate
    const co2Annual = projections?.climate?.co2Annual ?? 0;
    const treesEquivalent = projections?.climate?.treesEquivalent ?? 0;
    const climateStr = `${co2Annual.toFixed(
      1
    )} tons CO₂ annually, equivalent to ${Math.abs(treesEquivalent)} trees ${
      treesEquivalent > 0 ? "needed to offset" : "saved"
    }`;

    // Financial
    const totalSavings = projections?.financial?.totalSavings ?? 0;
    const financialStr = `$${totalSavings.toLocaleString()} total savings`;

    // Create a detailed prompt for Gemini
    const prompt = `You are a creative storyteller. Based on the following life projection data, write a compelling, personalized story about this person's future self in 25 years. Make it engaging, realistic, and inspiring while incorporating the specific data points.

Current Lifestyle:
- Sleep: ${formData?.sleep ?? "N/A"} hours per night
- Diet: ${formData?.diet ?? "N/A"}
- Exercise: ${formData?.exercise ?? 0} minutes per day
- Commute: ${formData?.commute ?? "N/A"}
- Screen time: ${formData?.screenTime ?? 0} hours per day
- Monthly savings: $${formData?.savings ?? 0}

Projections for 25 years from now:
- Health: ${healthStr}
- Climate: ${climateStr}
- Financial: ${financialStr}

Write a 200-300 word story in second person ("You are...") that paints a vivid picture of their life in 2049. Include specific details about their health, environmental impact, and financial situation. Make it personal and inspiring, showing how their current choices shaped their future. End with a reflection on the journey.`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const story = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!story) {
      throw new Error("No story generated from Gemini API");
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}

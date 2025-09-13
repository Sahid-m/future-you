import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { inputs, results } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const prompt = `Based on this person's lifestyle and future projections, provide 5 specific, actionable improvement suggestions. Be encouraging and practical.

Lifestyle:
- Sleep: ${inputs.sleep} hours/night
- Diet: ${inputs.diet}
- Exercise: ${inputs.exercise}
- Commute: ${inputs.commute}
- Screen time: ${inputs.screenTime} hours/day
- Monthly savings: $${inputs.savings}

Projections:
- Life expectancy change: ${results.health.lifeExpectancyChange} years
- Annual CO₂ footprint: ${results.climate.annualCO2Footprint} tons
- Future savings value: $${results.finance.futureValue.toLocaleString()}

Format as a JSON array of objects with "category" (Health/Climate/Finance/Lifestyle), "suggestion" (brief title), and "description" (detailed actionable advice). Focus on the biggest impact improvements first.`;

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
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No suggestions generated");
    }

    // Try to parse as JSON, fallback to text parsing
    let suggestions;
    try {
      suggestions = JSON.parse(generatedText);
    } catch {
      // Fallback: create suggestions from text
      suggestions = [
        {
          category: "Health",
          suggestion: "Optimize Your Sleep",
          description:
            "Based on your current sleep pattern, consider adjusting your bedtime routine for better health outcomes.",
        },
        {
          category: "Climate",
          suggestion: "Reduce Carbon Footprint",
          description:
            "Small changes in your commute and daily habits can significantly impact your environmental footprint.",
        },
        {
          category: "Finance",
          suggestion: "Boost Your Savings",
          description:
            "Consider increasing your monthly savings rate to maximize compound growth over time.",
        },
      ];
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

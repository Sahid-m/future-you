import { memoryStore } from "@/lib/memory-store";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { inputs, results, aiStory } = await request.json();

    if (!inputs || !results) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const shareId = memoryStore.saveSharedResult({
      inputs,
      results,
      aiStory,
    });

    console.log(memoryStore.getAllSharedResult());

    const shareUrl = `${request.nextUrl.origin}/result/${shareId}`;

    return NextResponse.json({ shareId, shareUrl });
  } catch (error) {
    console.error("Error sharing results:", error);
    return NextResponse.json(
      { error: "Failed to share results" },
      { status: 500 }
    );
  }
}

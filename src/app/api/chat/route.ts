// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { askQwen } from "@/lib/qwenService";

export async function POST(req: Request) {
  try {

    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    console.log("Processing message:", message);
    const reply = await askQwen(message);
    console.log("Received reply:", reply);

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
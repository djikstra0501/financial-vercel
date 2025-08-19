import { NextResponse } from "next/server";
import { askQwen } from "@/lib/qwenService";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const reply = await askQwen(message);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Qwen API error:", error);
    return NextResponse.json({ error: "Failed to fetch from Qwen" }, { status: 500 });
  }
}

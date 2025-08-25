import { NextResponse } from "next/server";
import { sendChatMessage } from "@/lib/gptService";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const reply = await sendChatMessage(message);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Error in /api/gpt-chat:", err);
    return NextResponse.json({ error: "Failed to connect to Gradio" }, { status: 500 });
  }
}

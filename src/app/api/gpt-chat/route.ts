import type { NextApiRequest, NextApiResponse } from "next";
import { sendChatMessage } from "@/lib/gptService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const reply = await sendChatMessage(message);
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to connect to Gradio" });
  }
}

import { Client } from "@gradio/client";

let client: Client | null = null;
let chatCounter = 0;
let chatbotHistory: [string, string | null][] = [];

interface GradioResponse {
  0: [string, string | null][];
  1: number;               
  2: string;               
  3: string;               
}

export async function initClient() {
  if (!client) {
    console.log("[gptService] Connecting to Gradio client...");
    client = await Client.connect("yuntian-deng/ChatGPT");
    console.log("[gptService] Client connected successfully.");
  }
}

export async function sendChatMessage(message: string) {
  await initClient();
  console.log("[gptService] Sending message:", message);
  console.log("[gptService] Current chatCounter:", chatCounter);
  console.log("[gptService] Current chatbotHistory:", chatbotHistory);

  try {
    const result = await client!.predict("/predict", {
      inputs: message,
      top_p: 1,
      temperature: 1,
      chat_counter: chatCounter,
      chatbot: chatbotHistory,
    });

    console.log("[gptService] Raw API response:", result);

    const data = result.data as GradioResponse;

    console.log("[gptService] Parsed response data:", data);

    const chatbot = data[0];
    const newCounter = data[1];

    chatCounter = newCounter;
    chatbotHistory = chatbot;

    const lastBotMessage = chatbot.at(-1)?.[1] ?? "(No response)";
    console.log("[gptService] Last bot message:", lastBotMessage);

    return lastBotMessage;
  } catch (error) {
    console.error("[gptService] Error during API call:", error);
    throw error;
  }
}

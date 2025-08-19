// src/lib/qwenService.ts
import { Client } from "@gradio/client";
import { readFileSync } from "fs";
import path from "path";

interface QwenResponse {
  data: [string];
}

type QwenClient = Awaited<ReturnType<typeof Client.connect>>;

let client: QwenClient | null = null;

const sysPromptPath = path.join(process.cwd(), 'qwenBaseModel.txt');
const sysPrompt = readFileSync(sysPromptPath, "utf-8");

async function initQwen(): Promise<QwenClient> {
  if (!client) {
    client = await Client.connect("Qwen/Qwen3-Demo");
  }
  return client;
}

export async function askQwen(message: string): Promise<string> {
  const c = await initQwen();

  const result = (await c.predict("/add_message", {
    input_value: message,
    settings_form_value: {
      model: "qwen3-235b-a22b",
      sys_prompt: sysPrompt,
      thinking_budget: 38,
    },
  })) as unknown as QwenResponse;

  return result.data[0];
}
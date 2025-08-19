import { Client } from "@gradio/client";
import { readFileSync } from "fs";

let client: any;

const sysPrompt = readFileSync("qwenBaseModel.txt", "utf-8")

async function initQwen() {
  if (!client) {
    client = await Client.connect("Qwen/Qwen3-Demo");
  }
  return client;
}

export async function askQwen(message: string) {
  const c = await initQwen();

  const result = await c.predict("/add_message", {
    input_value: message,
    settings_form_value: {
      model: "qwen3-235b-a22b",
      sys_prompt: sysPrompt,
      thinking_budget: 38,
    },
  });

  return result.data[0] as string;
}

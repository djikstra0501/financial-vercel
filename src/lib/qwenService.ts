// src/lib/qwenService.ts
import { Client } from "@gradio/client";
import { readFileSync } from "fs";
import path from "path";

type QwenClient = Awaited<ReturnType<typeof Client.connect>>;

let client: QwenClient | null = null;

const sysPromptPath = path.join(process.cwd(), 'qwenBaseModel.txt');
const sysPrompt = readFileSync(sysPromptPath, "utf-8");

interface ConversationContext {
  history: Array<{
    role: string;
    content: string | Array<{ type: string; content: string }>;
    key: string;
    header?: string;
    loading?: boolean;
    status?: string;
    footer?: string;
  }>;
  settings: {
    model: string;
    sys_prompt: string;
    thinking_budget: number;
  };
  enable_thinking: boolean;
}

async function initQwen(): Promise<QwenClient> {
  if (!client) {
    client = await Client.connect("Qwen/Qwen3-Demo");
  }
  return client;
}

export async function askQwen(message: string): Promise<string> {
  try {
    const c = await initQwen();
    
    const browserState = await c.predict("/add_message", {
      input_value: message,
      settings_form_value: {
        model: "qwen3-235b-a22b",
        sys_prompt: sysPrompt,
        thinking_budget: 38,
      },
    });

    const responseData = browserState as any;
    
    if (responseData?.data?.[0]?.value?.conversation_contexts) {
      const contexts = responseData.data[0].value.conversation_contexts;
      const conversationId = Object.keys(contexts)[0];
      
      if (conversationId) {
        const context = contexts[conversationId] as ConversationContext;
        const assistantMessage = context.history?.[1];
        
        if (assistantMessage?.content) {
          if (typeof assistantMessage.content === 'string') {
            return assistantMessage.content;
          } else if (Array.isArray(assistantMessage.content)) {
            return assistantMessage.content
              .filter((item: any) => item.type === 'text')
              .map((item: any) => item.content)
              .join('\n');
          }
        }
      }
    }
    
    return "I received your message but the response format was unexpected.";
    
  } catch (error) {
    console.error("Qwen service error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again.";
  }
}
// src/lib/qwenService.ts
import { Client } from "@gradio/client";
import { readFileSync } from "fs";
import path from "path";

type QwenClient = Awaited<ReturnType<typeof Client.connect>>;

let client: QwenClient | null = null;

const sysPromptPath = path.join(process.cwd(), 'qwenBaseModel.txt');
const sysPrompt = readFileSync(sysPromptPath, "utf-8");

interface TextContentItem {
  type: string;
  content: string;
}

interface ChatMessage {
  role: string;
  content: string | TextContentItem[];
  key: string;
  header?: string;
  loading?: boolean;
  status?: string;
  footer?: string;
}

interface ConversationSettings {
  model: string;
  sys_prompt: string;
  thinking_budget: number;
}

interface ConversationContext {
  history: ChatMessage[];
  settings: ConversationSettings;
  enable_thinking: boolean;
}

interface ConversationContexts {
  [key: string]: ConversationContext;
}

interface ConversationData {
  conversations: Array<{ label: string; key: string }>;
  conversation_contexts: ConversationContexts;
}

interface ResponseDataItem {
  value?: ConversationData;
  __type__?: string;
}

interface PredictResponse {
  data?: ResponseDataItem[];
  type?: string;
  time?: Date;
  endpoint?: string;
  fn_index?: number;
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
    
    console.log("Sending message to Qwen...");
    const browserState = await c.predict("/add_message", {
      input_value: message,
      settings_form_value: {
        model: "qwen3-235b-a22b",
        sys_prompt: sysPrompt,
        thinking_budget: 38,
      },
    });

    console.log("Raw response:", JSON.stringify(browserState, null, 2));
    
    const responseData = browserState as PredictResponse;
    
    if (responseData?.data && responseData.data.length > 0) {
      const firstDataItem = responseData.data[0];
      
      if (firstDataItem?.value?.conversation_contexts) {
        const contexts = firstDataItem.value.conversation_contexts;
        const conversationIds = Object.keys(contexts);
        
        if (conversationIds.length > 0) {
          const firstConversationId = conversationIds[0];
          const context = contexts[firstConversationId];
          
          if (context.history && context.history.length > 1) {
            const assistantMessage = context.history[1];
            
            if (assistantMessage.content) {
              if (typeof assistantMessage.content === 'string') {
                return assistantMessage.content;
              } else if (Array.isArray(assistantMessage.content)) {
                const textContents = assistantMessage.content
                  .filter(item => item.type === 'text')
                  .map(item => item.content)
                  .join('\n');
                
                return textContents || "Received empty response";
              }
            }
          }
        }
      }
    }
    
    console.warn("Unexpected response structure:", JSON.stringify(responseData, null, 2));
    return "I received your message but the response format was unexpected.";
    
  } catch (error) {
    console.error("Qwen service error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again.";
  }
}
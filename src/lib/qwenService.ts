// src/lib/qwenService.ts
import { Client } from "@gradio/client";
import { readFileSync } from "fs";
import path from "path";

type QwenClient = Awaited<ReturnType<typeof Client.connect>>;

let client: QwenClient | null = null;

const sysPromptPath = path.join(process.cwd(), 'qwenBaseModel.txt');
const sysPrompt = readFileSync(sysPromptPath, "utf-8");

interface MessageContentItem {
  type: string;
  copyable: boolean;
  editable: boolean;
  content: string;
  options?: {
    title?: string;
    status?: string;
  } | null;
}

interface ChatMessage {
  role: string;
  content: string | MessageContentItem[];
  key: string;
  header?: string;
  footer?: string;
  loading?: boolean;
  status?: string;
}

interface DataItem {
  value?: ChatMessage[];
  __type__?: string;
  [key: string]: unknown;
}

interface PredictResponse {
  data?: DataItem[];
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
    
    const browserState = await c.predict("/add_message", {
      input_value: message,
      settings_form_value: {
        model: "qwen3-235b-a22b",
        sys_prompt: sysPrompt,
        thinking_budget: 38,
      },
    });

    const responseData = browserState as PredictResponse;
    
    if (responseData?.data && responseData.data.length > 5) {
      const messageData = responseData.data[5];
      
      if (messageData?.value && Array.isArray(messageData.value)) {
        const assistantMessage = messageData.value.find(msg => msg.role === 'assistant');
        
        if (assistantMessage?.content) {
          if (typeof assistantMessage.content === 'string') {
            return assistantMessage.content;
          } else if (Array.isArray(assistantMessage.content)) {
            const textContent = assistantMessage.content
              .filter(item => item.type === 'text')
              .map(item => item.content)
              .join('\n');
            
            return textContent || "Received empty response";
          }
        }
      }
    }
    
    if (responseData?.data) {
      for (const dataItem of responseData.data) {
        if (dataItem?.value && Array.isArray(dataItem.value)) {
          const assistantMessage = dataItem.value.find(msg => 
            msg.role === 'assistant' && msg.content
          );
          
          if (assistantMessage) {
            if (typeof assistantMessage.content === 'string') {
              return assistantMessage.content;
            } else if (Array.isArray(assistantMessage.content)) {
              const textContent = assistantMessage.content
                .filter(item => item.type === 'text')
                .map(item => item.content)
                .join('\n');
              
              if (textContent) return textContent;
            }
          }
        }
      }
    }
    
    return "I received your message but couldn't extract the response.";
    
  } catch (error) {
    console.error("Qwen service error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again.";
  }
}
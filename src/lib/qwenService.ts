// src/lib/qwenService.ts
import { Client } from "@gradio/client";
import { readFileSync } from "fs";
import path from "path";

type QwenClient = Awaited<ReturnType<typeof Client.connect>>;

let client: QwenClient | null = null;

const sysPromptPath = path.join(process.cwd(), 'qwenBaseModel.txt');
const sysPrompt = readFileSync(sysPromptPath, "utf-8");

interface BrowserState {
  messages?: ChatMessage[];
  output?: unknown;
  response?: unknown;
  text?: unknown;
  content?: unknown;
  data?: unknown;
  message?: unknown;
  [key: string]: unknown;
}

interface ChatMessage {
  role?: string;
  content?: string;
  [key: string]: unknown;
}

async function initQwen(): Promise<QwenClient> {
  if (!client) {
    client = await Client.connect("Qwen/Qwen3-Demo");
    await client.predict("/new_chat", {} );
  }
  return client;
}

// export async function askQwen(message: string): Promise<string> {
//   try {
//     const c = await initQwen();
    
//     console.log("Initializing Qwen conversation...");
    
//     // 1. Disable long thinking
//     await c.predict("/toggle_thinking", {});
    
//     // 2. Apply the state change
//     await c.predict("/apply_state_change", {});
    
//     // 3. Send the message with configuration
//     const messageResult = await c.predict("/add_message", {
//       input_value: message,
//       settings_form_value: {
//         model: "qwen3-235b-a22b",
//         sys_prompt: sysPrompt,
//         thinking_budget: 38,
//       },
//     });
    
//     console.log("Message sent, waiting for response...");
    
//     // 4. Update browser state multiple times to get the complete response
//     // We need to call this multiple times until we get the full response
//     let fullResponse = "";
//     let attempts = 0;
//     const maxAttempts = 10; // Prevent infinite loop
    
//     while (attempts < maxAttempts) {
//       attempts++;
      
//       const browserState = await c.predict("/update_browser_state", {});
//       console.log(`Browser state update ${attempts}:`, browserState);
      
//       // The response structure might contain the message in different formats
//       // Let's explore what we get and extract the text
//       if (browserState && typeof browserState === 'object') {
//         // Try different possible response formats
//         if (browserState.messages && Array.isArray(browserState.messages)) {
//           const lastMessage = browserState.messages[browserState.messages.length - 1];
//           if (lastMessage && lastMessage.content) {
//             fullResponse = lastMessage.content;
//             break;
//           }
//         } else if (browserState.output) {
//           fullResponse = browserState.output;
//           break;
//         } else if (browserState.data && Array.isArray(browserState.data) && browserState.data[0]) {
//           fullResponse = browserState.data[0];
//           break;
//         } else if (browserState.response) {
//           fullResponse = browserState.response;
//           break;
//         }
//       }
      
//       // Wait a bit before next attempt
//       await new Promise(resolve => setTimeout(resolve, 500));
//     }
    
//     if (!fullResponse) {
//       throw new Error("Failed to get complete response from Qwen after multiple attempts");
//     }
    
//     console.log("Final response:", fullResponse);
//     return fullResponse;
    
//   } catch (error) {
//     console.error("Qwen service error:", error);
//     throw new Error(`Failed to get response from Qwen: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

// Alternative: Debug version to understand the response structure
export async function askQwen(message: string): Promise<string> {
  try {
    const c = await initQwen();
    
    console.log("=== QWEN API DEBUG ===");
    
    // 1. Disable thinking
    const toggleResult = await c.predict("/toggle_thinking", {});
    console.log("Toggle thinking result:", toggleResult);
    
    // 2. Apply state change
    const applyResult = await c.predict("/apply_state_change", {});
    console.log("Apply state change result:", applyResult);
    
    // 3. Send message
    const messageResult = await c.predict("/add_message", {
      input_value: message,
      settings_form_value: {
        model: "qwen3-235b-a22b",
        sys_prompt: sysPrompt,
        thinking_budget: 38,
      },
    });
    console.log("Message result:", messageResult);
    
    // 4. Get response through multiple browser state updates
    let fullResponse = "";
    
    for (let i = 0; i < 5; i++) {
      console.log(`=== Browser State Update ${i + 1} ===`);
      const browserState = await c.predict("/update_browser_state", {});
      console.log("Browser state:", JSON.stringify(browserState, null, 2));
      
      // Try to extract response from different possible structures
      if (browserState && typeof browserState === 'object') {
        const state = browserState as BrowserState;

        // Check for messages array
        if (state.messages && Array.isArray(state.messages)) {
          const assistantMessages = state.messages.filter((msg: ChatMessage) => 
            msg.role === 'assistant' || msg.role === 'bot'
          );
          if (assistantMessages.length > 0) {
            fullResponse = assistantMessages[assistantMessages.length - 1].content || '';
            break;
          }
        }
        
        // Check for direct response fields
        const possibleResponseFields = ['output', 'response', 'text', 'content', 'data', 'message'];
        for (const field of possibleResponseFields) {
          if (state[field]) {
            if (typeof state[field] === 'string') {
              fullResponse = state[field];
              break;
            } else if (Array.isArray(state[field]) && state[field][0]) {
              fullResponse = state[field][0];
              break;
            }
          }
        }
        
        if (fullResponse) break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    if (!fullResponse) {
      console.warn("Could not extract response from browser state, returning fallback");
      return "I received your message but couldn't process the response properly. Please check the console for details.";
    }
    
    return fullResponse;
    
  } catch (error) {
    console.error("Qwen service error:", error);
    throw new Error(`Failed to get response from Qwen: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
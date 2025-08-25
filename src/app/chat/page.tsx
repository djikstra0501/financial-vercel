"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { isLoaded, userId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<"gpt" | "qwen">("gpt"); // Default GPT

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (!userId) {
      setError("Please sign in to chat");
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now() + "-user",
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = model === "gpt" ? "/api/gpt-chat" : "/api/chat";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (!data.reply) throw new Error("Invalid response format");

      const botMsg: ChatMessage = {
        id: Date.now() + "-bot",
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full p-4">
      {/* MODEL SELECTOR */}
      <div className="mb-4 flex gap-2 items-center">
        <label htmlFor="model" className="font-medium">Model:</label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value as "gpt" | "qwen")}
          className="border p-2 rounded-lg"
          disabled={isLoading}
        >
          <option value="gpt">GPT (Gradio)</option>
          <option value="qwen">Qwen</option>
        </select>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4 border rounded-lg bg-gray-50">
        {error && (
          <div className="p-2 rounded bg-red-100 text-red-600">{error}</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-xl max-w-[70%] ${
              m.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-black"
            }`}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="p-2 rounded-xl bg-gray-300 text-black max-w-[70%]">
            Thinking...
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
          disabled={isLoading || !userId}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
          disabled={isLoading || !userId}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ChatPage() {
  const { isLoaded, userId } = useAuth();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (!userId) {
      setError("Please sign in to chat");
      return;
    }

    setError(null);
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      if (!data.reply) {
        throw new Error("Invalid response format");
      }

      const botMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border rounded-lg bg-gray-50">
        {error && (
          <div className="p-2 rounded-xl bg-red-100 text-red-700">
            {error}
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl ${
              m.role === "user"
                ? "bg-blue-500 text-white self-end max-w-[70%] ml-auto"
                : "bg-gray-300 text-black self-start max-w-[70%]"
            }`}
          >
            {m.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="p-2 rounded-xl bg-gray-300 text-black self-start max-w-[70%]">
            Thinking...
          </div>
        )}
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Say something..."
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
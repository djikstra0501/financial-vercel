"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
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
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = { role: "assistant", content: "Sorry, I encountered an error." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border rounded-lg bg-gray-50">
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

      {/* Input */}
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Say something..."
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
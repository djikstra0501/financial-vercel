"use client";

import { useState } from "react";
import { askQwen } from "../../lib/qwenService";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // add user msg
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    // clear input
    setInput("");

    // ask Qwen
    const reply = await askQwen(input);
    const botMsg = { role: "assistant", content: reply };
    setMessages((prev) => [...prev, botMsg]);
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
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

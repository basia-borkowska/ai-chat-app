"use client";

import { useChatStore } from "@/store/chat";
import { Message } from "@/types/chat";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const { messages, addMessage, updateMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    addMessage(userMessage);
    addMessage(assistantMessage);
    setInput("");
    setIsSending(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok || !res.body) {
      updateMessage(assistantMessage.id, {
        content: "Error: Unable to get response.",
      });
      setIsSending(false);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulator = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulator += decoder.decode(value, { stream: true });
      updateMessage(assistantMessage.id, { content: accumulator });
    }
    setIsSending(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    send();
  };

  return (
    <div>
      <div className="grid h-[calc(100dvh-8rem)] grid-rows-[1fr_auto] gap-3">
        <div className="overflow-auto rounded-xl border p-4">
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={[
                    "inline-block max-w-[75%] rounded-2xl px-3 py-2 align-top",
                    m.role === "user" ? "bg-black text-white" : "bg-gray-100",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-2">
          <div className="flex gap-2">
            <textarea
              className="min-h-12 flex-1 rounded-md border px-3 py-2 outline-none focus:ring"
              placeholder="Ask something…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
            />
            <button
              type="submit"
              disabled={isSending || input.trim().length === 0}
              className="h-12 rounded-md bg-black px-4 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

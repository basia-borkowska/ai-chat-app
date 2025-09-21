"use client";

import type { Message } from "@/types/chat";
import { useEffect, useRef } from "react";

type Props = { messages: Message[] };

export default function Messages({ messages }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="overflow-auto m-6 border p-4">
      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={[
                "inline-block max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 align-top",
                m.role === "user" ? "bg-dark text-light" : "bg-light text-dark",
              ].join(" ")}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

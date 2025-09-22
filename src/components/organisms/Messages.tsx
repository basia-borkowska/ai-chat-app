"use client";

import type { Message } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/molecules/MessageBubble";
import { useProfileStore } from "@/store/profile";

type Props = { messages: Message[] };

export default function Messages({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const { profile } = useProfileStore();

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50; // 50px tolerance
    setAutoScroll(atBottom);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto bg-dark px-4 py-2 space-y-4"
    >
      {messages.map(({ id, content, role }) => (
        <MessageBubble
          key={id}
          message={content}
          role={role}
          avatarUrl={profile.avatarUrl}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

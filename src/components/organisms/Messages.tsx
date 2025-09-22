"use client";

import type { Message } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/molecules/MessageBubble";
import { useProfileStore } from "@/store/profile";
import Image from "next/image";
import { Subtitle } from "../atoms/typography/Subtitle";

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
      {messages.length === 0 && (
        <div className="text-center lg:mt-52 md:mt-28 gap-10 flex-col flex items-center justify-center text-sm text-dark-muted">
          <Image
            src="/ai-avatar.png"
            alt="Chat Placeholder"
            width={380}
            height={380}
            className="mx-auto mb-4 rounded-full"
          />
          <Subtitle>
            Hi! I am Velora, your AI assistant. How can I help you today?
          </Subtitle>
        </div>
      )}
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

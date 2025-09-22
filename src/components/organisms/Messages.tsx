"use client";

import type { Message } from "@/types/chat";
import { useEffect, useMemo, useRef, useState } from "react";
import MessageBubble from "@/components/molecules/MessageBubble";
import { useProfileStore } from "@/store/profile";
import Image from "next/image";
import { Subtitle } from "@/components/atoms/typography/Subtitle";
import { cn } from "@/lib/utils";

type Props = { messages: Message[]; isStreaming?: boolean };

export default function Messages({ messages, isStreaming }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfileStore();
  const [isInitialRender, setIsInitialRender] = useState(true);

  const lastUserMessageId = useMemo(
    () => messages.reverse().find((msg) => msg.role === "user")?.id,
    [messages]
  );

  const lastAssistantMessageId = useMemo(
    () => messages.reverse().find((msg) => msg.role === "assistant")?.id,
    [messages]
  );

  useEffect(() => {
    if (isStreaming && lastUserMessageId) {
      requestAnimationFrame(() => {
        document
          .getElementById(lastUserMessageId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      setIsInitialRender(false);
    } else if (isInitialRender && lastAssistantMessageId) {
      requestAnimationFrame(() => {
        document
          .getElementById(lastAssistantMessageId)
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [isStreaming, lastAssistantMessageId, lastUserMessageId, isInitialRender]);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-y-auto bg-dark px-4 py-2 space-y-4"
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
          id={id}
          message={content}
          role={role}
          avatarUrl={profile.avatarUrl}
        />
      ))}

      <div
        ref={bottomRef}
        className={cn({
          "h-11/12": !isInitialRender,
          "h-0": isInitialRender,
        })}
      />
    </div>
  );
}

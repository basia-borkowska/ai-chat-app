"use client";

import type { Message } from "@/types/chat";
import { useEffect, useRef } from "react";
import MessageBubble from "@/components/ui/molecules/MessageBubble";
import { useProfileStore } from "@/store/profile";

type Props = { messages: Message[] };

export default function Messages({ messages }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const { profile } = useProfileStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="overflow-auto m-6  p-4">
      <div className="space-y-4">
        {messages.map(({ id, role, content }) => (
          <MessageBubble
            key={id}
            role={role}
            message={content}
            avatarUrl={profile.avatarUrl}
          />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

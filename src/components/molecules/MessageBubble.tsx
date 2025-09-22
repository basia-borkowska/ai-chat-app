import * as React from "react";
import { cn } from "@/lib/utils";
import { MessageRole } from "@/types/chat";
import { Avatar } from "../atoms/Avatar";
import ReactMarkdown from "react-markdown";

export interface MessageBubbleProps {
  role: MessageRole;
  message: string;
  avatarUrl?: string | null;
  className?: string;
}

export default function MessageBubble({
  role,
  message,
  avatarUrl,
  className,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2 items-end",
        { "justify-end": isUser, "justify-start": !isUser },
        className
      )}
    >
      {!isUser && avatarUrl && (
        <Avatar src="/ai-avatar.png" alt="AI Assistant" />
      )}
      {message.length === 0 ? (
        <div className="h-4 w-4 rounded-full bg-light-muted animate-pulse" />
      ) : (
        <div
          className={cn(
            "max-w-[80%] rounded-lg px-3 py-2 text-md leading-relaxed",
            {
              "bg-accent-secondary text-dark rounded-br-none": isUser,
              "bg-dark-secondary text-light rounded-bl-none": !isUser,
            },
            className
          )}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      )}

      {isUser && avatarUrl && <Avatar src={avatarUrl} alt="User Avatar" />}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";
import { MessageRole } from "@/types/chat";
import { Avatar } from "../atoms/Avatar";

export interface MessageBubbleProps {
  role: MessageRole;
  message: React.ReactNode;
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
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          {
            "bg-accent text-light rounded-br-none": isUser,
            "bg-light-muted text-dark rounded-bl-none": !isUser,
          },
          className
        )}
      >
        {message}
      </div>

      {isUser && avatarUrl && <Avatar src={avatarUrl} alt="User Avatar" />}
    </div>
  );
}

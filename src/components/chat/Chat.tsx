"use client";

import { useChatStore } from "@/store/chat";
import { Message, SelectedFile } from "@/types/chat";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import FilesPreview from "./FilesPreview";
import Composer from "./Composer";

export default function Chat() {
  const { messages, addMessage, updateMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [files, setFiles] = useState<SelectedFile[]>([]);

  useEffect(() => {
    return () => files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
  }, [files]);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((file) => file.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((file) => file.id !== id);
    });
  };

  const send = async () => {
    const prompt = input.trim();
    if (!prompt && files.length === 0) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt || "(attachment)",
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

    const formData = new FormData();
    formData.append("prompt", prompt);
    files.forEach(({ file }) => formData.append("files", file));
    setFiles([]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: formData,
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

  return (
    <div className="grid h-[calc(100dvh-8rem)] grid-rows-[1fr_auto] gap-3">
      <Messages messages={messages} />
      {files.length > 0 && <FilesPreview files={files} onRemove={removeFile} />}
      <Composer
        value={input}
        setValue={setInput}
        isSending={isSending}
        onSubmit={send}
        files={files}
        setFiles={setFiles}
      />
    </div>
  );
}

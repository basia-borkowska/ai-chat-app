"use client";

import { useChatStore } from "@/store/chat";
import { Message, SelectedFile } from "@/types/chat";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPPORTED_MIME = [
  // images
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  // simple docs (optional for now)
  "text/plain",
];

export default function Chat() {
  const { messages, addMessage, updateMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [files, setFiles] = useState<SelectedFile[]>([]);

  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    return () => files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
  }, [files]);

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const accepted: SelectedFile[] = [];
    const skipped: string[] = [];

    for (const file of selected) {
      if (!SUPPORTED_MIME.includes(file.type)) {
        skipped.push(file.name);
        continue;
      }
      const isImage = file.type.startsWith("image/");
      accepted.push({
        id: crypto.randomUUID(),
        file,
        url: isImage ? URL.createObjectURL(file) : undefined,
      });
    }
    if (skipped.length) {
      alert(`Unsupported, skipped files: ${skipped.join(", ")}`);
    }
    setFiles((prev) => [...prev, ...accepted]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f) => (
                <div key={f.id} className="relative rounded-md border p-2">
                  {f.url ? (
                    <Image
                      src={f.url}
                      alt={f.file.name}
                      width={80}
                      height={80}
                      className="max-h-20 rounded-md object-contain"
                    />
                  ) : (
                    <span className="text-xs">{f.file.name}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(f.id)}
                    className="absolute right-1 top-1 rounded bg-black/70 px-1 text-xs text-white"
                    aria-label={`Remove ${f.file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              multiple
              onChange={onSelectFiles}
              className="hidden"
              accept={SUPPORTED_MIME.join(",")}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 rounded-md border px-3"
            >
              Attach
            </button>
            <textarea
              className="min-h-12 flex-1 rounded-md border px-3 py-2 outline-none focus:ring"
              placeholder="Ask something…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
            />
            <button
              type="submit"
              disabled={
                isSending || (input.trim().length === 0 && files.length === 0)
              }
              className="h-12 rounded-md bg-black px-4 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Supported: PNG, JPEG, WebP, GIF, SVG, TXT (more soon).
          </p>
        </form>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type MicButtonProps = {
  srLabel?: string;
  lang?: string;
  onTranscript: (text: string, kind: "final" | "interim") => void;
  disabled?: boolean;
};

export function MicButton({
  srLabel = "Dictate message",
  lang = "en-US",
  onTranscript,
  disabled,
}: MicButtonProps) {
  const { supported, listening, start, stop } = useSpeechRecognition({
    lang,
    interim: true,
    continuous: false,
    onFinalResult: (t) => onTranscript(t, "final"),
    onInterimResult: (t) => onTranscript(t, "interim"),
  });

  if (!supported) {
    return (
      <IconButton
        srLabel="Speech not supported"
        title="Speech not supported"
        variant="ghost"
        className="size-8"
        disabled
      >
        <Mic />
      </IconButton>
    );
  }

  return listening ? (
    <IconButton
      srLabel={srLabel}
      title="Stop dictation"
      variant="ghost"
      className="size-8"
      onClick={(e) => {
        e.preventDefault();
        stop();
      }}
      disabled={disabled}
    >
      <Square />
    </IconButton>
  ) : (
    <IconButton
      srLabel={srLabel}
      title="Start dictation"
      variant="ghost"
      className="size-8"
      onClick={(e) => {
        e.preventDefault();
        start();
      }}
      disabled={disabled}
    >
      <Mic />
    </IconButton>
  );
}

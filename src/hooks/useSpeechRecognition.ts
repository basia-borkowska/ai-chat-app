"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort?: () => void;

  onaudiostart?: ((ev: Event) => void) | null;
  onsoundstart?: ((ev: Event) => void) | null;
  onspeechstart?: ((ev: Event) => void) | null;
  onspeechend?: ((ev: Event) => void) | null;
  onsoundend?: ((ev: Event) => void) | null;
  onaudioend?: ((ev: Event) => void) | null;

  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): ISpeechRecognition };
    webkitSpeechRecognition?: { new (): ISpeechRecognition };
  }
}

export type UseSpeechRecognitionOptions = {
  lang?: string;
  interim?: boolean;
  continuous?: boolean;
  onFinalResult?: (text: string) => void;
  onInterimResult?: (text: string) => void;
};

export function useSpeechRecognition({
  lang = "en-US",
  interim = true,
  continuous = false,
  onFinalResult,
  onInterimResult,
}: UseSpeechRecognitionOptions) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }

    setSupported(true);
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = interim;
    rec.continuous = continuous;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interimBuf = "";
      let finalBuf = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const alt = res[0];
        const transcript = alt?.transcript ?? "";
        if (res.isFinal) finalBuf += transcript;
        else interimBuf += transcript;
      }

      if (interim && interimBuf) {
        setInterimText(interimBuf);
        onInterimResult?.(interimBuf);
      }

      if (finalBuf) {
        setInterimText("");
        onFinalResult?.(finalBuf);
      }
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    recognitionRef.current = rec;

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, [lang, interim, continuous, onFinalResult, onInterimResult]);

  const start = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    setListening(true);
    try {
      rec.start();
    } catch {}
  }, []);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } finally {
      setListening(false);
      setInterimText("");
    }
  }, []);

  return {
    supported,
    listening,
    interimText,
    start,
    stop,
  };
}

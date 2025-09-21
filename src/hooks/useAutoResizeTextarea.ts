"use client";

import * as React from "react";

export function useAutoResizeTextarea<T extends HTMLTextAreaElement>() {
  const ref = React.useRef<T | null>(null);

  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    resize();
  }, [resize]);

  return { ref, resize };
}

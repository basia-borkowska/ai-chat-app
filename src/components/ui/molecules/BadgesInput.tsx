"use client";

import * as React from "react";
import { Input } from "@/components/ui/atoms/Field";
import { Badge } from "@/components/ui/atoms/Badge";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  /** Current badges */
  value: string[];
  /** Update badges (still works outside RHF) */
  onChange: (next: string[]) => void;

  /** Label for the input */
  label: string;
  placeholder?: string;

  /** RHF wiring (optional): pass both to integrate with register() */
  name?: string;
  register?: UseFormRegisterReturn;

  /** Behavior */
  normalizeCase?: boolean;
  maxBadges?: number;

  className?: string;
  /** Serialize function for the hidden field (defaults to JSON) */
  serialize?: (items: string[]) => string;
};

export function BadgesInput({
  value,
  onChange,
  label,
  placeholder = "Add a tag and press Enter",
  name,
  register,
  normalizeCase = true,
  maxBadges,
  className,
  serialize = (items) => JSON.stringify(items),
}: Props) {
  const [draft, setDraft] = React.useState("");

  const hiddenRef = React.useRef<HTMLInputElement | null>(null);

  // Helper: set hidden input value and dispatch a native input event
  const syncHidden = React.useCallback(
    (next: string[]) => {
      if (!hiddenRef.current) return;
      const el = hiddenRef.current;
      const serialized = serialize(next);

      // Set native value so React + RHF pick it up
      const descriptor = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      );
      descriptor?.set?.call(el, serialized);
      // Bubble so RHF's listener runs
      el.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [serialize]
  );

  const norm = (s: string) =>
    normalizeCase ? s.trim().toLowerCase() : s.trim();
  const exists = (s: string) => value.map(norm).includes(norm(s));

  const addMany = (items: string[]) => {
    const cleaned = items
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !exists(t));

    if (!cleaned.length) return;
    const next = maxBadges
      ? [...value, ...cleaned].slice(0, maxBadges)
      : [...value, ...cleaned];

    onChange(next);
    syncHidden(next);
  };

  const addOne = (t: string) => addMany([t]);

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    syncHidden(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if ((key === "Enter" || key === "," || key === "Tab") && draft.trim()) {
      e.preventDefault();
      addOne(draft);
      setDraft("");
      return;
    }

    if (key === "Backspace" && draft.length === 0 && value.length > 0) {
      e.preventDefault();
      removeAt(value.length - 1);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    const parts = text
      .split(/[\n,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      e.preventDefault();
      addMany(parts);
    }
  };

  const reachedMax = !!maxBadges && value.length >= maxBadges;

  // Keep hidden field in sync if parent changes value externally
  React.useEffect(() => {
    syncHidden(value);
  }, [value, syncHidden]);

  return (
    <div className={className}>
      {/* Hidden field for RHF (optional) */}
      {name && (
        <input
          type="hidden"
          name={name}
          // controlled via native setter + input event (see syncHidden)
          defaultValue={serialize(value)}
          ref={(el) => {
            hiddenRef.current = el;
            // chain RHF ref if provided
            if (register?.ref) {
              if (typeof register.ref === "function") {
                register.ref(el);
              } else {
                // if RHF ever returns an object ref (rare), assign safely
                (
                  register.ref as unknown as React.MutableRefObject<HTMLInputElement | null>
                ).current = el;
              }
            }
          }}
          onBlur={register?.onBlur}
          // we don't use register.onChange directly; we drive changes via native events
          readOnly
          aria-hidden="true"
          tabIndex={-1}
          style={{ display: "none" }}
        />
      )}

      <Input
        label={label}
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        disabled={reachedMax}
      />

      {value.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xs">
          {value.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-1 rounded-xs bg-accent-secondary px-2.5 py-0.5 text-dark"
            >
              <Badge>{t}</Badge>
              <IconButton
                srLabel={`Remove ${t}`}
                variant="ghost"
                onClick={() => removeAt(i)}
                className="h-5 w-5 p-0 text-dark"
                title="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </IconButton>
            </span>
          ))}
        </div>
      )}

      {reachedMax && (
        <p className="mt-1 text-xs text-light-muted">
          Maximum of {maxBadges} {maxBadges === 1 ? "tag" : "tags"}.
        </p>
      )}
    </div>
  );
}

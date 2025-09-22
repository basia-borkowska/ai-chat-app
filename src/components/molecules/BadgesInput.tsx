"use client";

import * as React from "react";
import { Input } from "@/components/atoms/Field";
import { Badge } from "@/components/atoms/Badge";
import { IconButton } from "@/components/atoms/IconButton";
import { X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
  placeholder?: string;
  name?: string;
  register?: UseFormRegisterReturn;
  normalizeCase?: boolean;
  maxBadges?: number;
  className?: string;
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

  const syncHidden = React.useCallback(
    (next: string[]) => {
      if (!hiddenRef.current) return;
      const el = hiddenRef.current;
      const serialized = serialize(next);

      const descriptor = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      );
      descriptor?.set?.call(el, serialized);
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

  React.useEffect(() => {
    syncHidden(value);
  }, [value, syncHidden]);

  return (
    <div className={className}>
      {name && (
        <input
          type="hidden"
          name={name}
          defaultValue={serialize(value)}
          ref={(el) => {
            hiddenRef.current = el;
            if (register?.ref) {
              if (typeof register.ref === "function") {
                register.ref(el);
              } else {
                (
                  register.ref as unknown as React.MutableRefObject<HTMLInputElement | null>
                ).current = el;
              }
            }
          }}
          onBlur={register?.onBlur}
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
            <Badge key={`${t}-${i}`} className="flex items-center gap-1">
              {t}
              <IconButton
                srLabel={`Remove ${t}`}
                variant="ghost"
                onClick={() => removeAt(i)}
                className="h-5 w-5 p-0 text-dark"
                title="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </IconButton>
            </Badge>
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

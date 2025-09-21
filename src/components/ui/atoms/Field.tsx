"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./typography/Label";

type ElementTag = "input" | "textarea";

type PropsByTag = {
  input: React.InputHTMLAttributes<HTMLInputElement>;
  textarea: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

type RefByTag = {
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
};

type BaseProps = {
  label: string;
  error?: string;
  className?: string;
  id?: string;
};

type PolymorphicProps<T extends ElementTag> = BaseProps &
  Omit<PropsByTag[T], "id"> & {
    as?: T;
  };

type PolymorphicRef<T extends ElementTag> = React.Ref<RefByTag[T]>;

function InnerField<T extends ElementTag = "input">(
  {
    as,
    label,
    error,
    className,
    id,
    placeholder,
    ...rest
  }: PolymorphicProps<T>,
  ref: PolymorphicRef<T>
) {
  const tag = (as ?? "input") as ElementTag;

  const autoId = React.useId();
  const fieldId = id || `field-${autoId}`;

  return (
    <div className="w-full">
      <div className="relative">
        {React.createElement(tag, {
          ...(rest as PropsByTag[typeof tag]),
          ref: ref as never,
          id: fieldId,
          placeholder,
          "aria-invalid": !!error,
          "aria-describedby": error ? `${fieldId}-error` : undefined,
          className: cn(
            "peer block w-full rounded-xs pt-3 pb-2 border bg-transparent px-3 text-sm text-light",
            "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            { "border-accent-highlight": error },
            {
              "border-light-muted/40 focus:border-accent focus:ring-accent":
                !error,
            },
            className
          ),
        })}

        <Label
          htmlFor={fieldId}
          className={cn(
            "absolute -top-[6px] left-2 bg-dark-secondary px-1 transition-colors",
            { "text-accent-highlight": error },
            { "text-light-muted peer-focus:text-accent": !error }
          )}
        >
          {label}
        </Label>
      </div>
      {error && (
        <p
          id={`${fieldId}-error`}
          className="mt-1 text-xs text-accent-highlight"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
type PolymorphicField = <T extends ElementTag = "input">(
  props: PolymorphicProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null;

export const Field = Object.assign(
  React.forwardRef(InnerField) as PolymorphicField,
  { displayName: "Field" }
);

export const Input = React.forwardRef<
  HTMLInputElement,
  Omit<PolymorphicProps<"input">, "as">
>((props, ref) => <Field {...props} as="input" ref={ref} />);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<PolymorphicProps<"textarea">, "as">
>((props, ref) => <Field {...props} as="textarea" ref={ref} />);
Textarea.displayName = "Textarea";

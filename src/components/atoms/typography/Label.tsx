import { cn } from "@/lib/utils";

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-xs text-light-muted uppercase", className)}
    >
      {children}
    </label>
  );
}

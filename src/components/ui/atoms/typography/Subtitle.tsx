import { cn } from "@/lib/utils";

export function Subtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-semibold text-light-muted", className)}>
      {children}
    </h2>
  );
}

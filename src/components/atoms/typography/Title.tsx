import { cn } from "@/lib/utils";

export function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1 className={cn("text-2xl font-bold text-light", className)}>
      {children}
    </h1>
  );
}

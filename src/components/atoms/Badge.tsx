import { cn } from "@/lib/utils";
import { Label } from "./typography/Label";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Label
      className={cn(
        "inline-flex w-fit text-sm items-center px-2.5 py-0.5 rounded-xs bg-accent-secondary text-dark",
        className
      )}
    >
      {children}
    </Label>
  );
}

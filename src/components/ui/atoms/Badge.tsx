import { Label } from "./typography/Label";

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <Label className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-xs bg-accent-secondary text-dark">
      {children}
    </Label>
  );
}

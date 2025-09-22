import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/utils";

export default function ChatSkeleton() {
  return (
    <div className="grid h-[calc(100dvh-8rem)] grid-rows-[1fr_auto] gap-3">
      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-2 rounded-lg p-3",
              i % 2 === 0
                ? "self-start bg-dark-secondary"
                : "self-end bg-accent-secondary/20"
            )}
          >
            <Skeleton className="h-3 w-52" />
            <Skeleton className="h-3 w-80" />
            {i % 2 === 0 && <Skeleton className="h-3 w-64" />}
          </div>
        ))}
      </div>

      <div className="flex items-end gap-2 p-4">
        <Skeleton className="h-28 flex-1 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
      </div>
    </div>
  );
}

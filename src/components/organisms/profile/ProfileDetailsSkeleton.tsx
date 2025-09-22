import { Skeleton } from "@/components/atoms/Skeleton";

export default function ProfileDetailsSkeleton() {
  return (
    <div className="mx-auto relative grid w-full max-w-7xl lg:min-w-xl min-w-0 gap-6">
      <Skeleton className="h-8 w-48" />

      <div className="flex flex-col gap-4">
        <Skeleton className="size-60 rounded-full" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-80" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <div className="flex flex-wrap gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-xs" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-52 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

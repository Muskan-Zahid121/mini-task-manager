import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="space-y-3">
      <div className="hidden rounded-lg border p-4 md:block">
        <div className="mb-4 grid grid-cols-5 gap-4">
          {["Task", "Status", "Created", "Updated", "Actions"].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-12 w-full" />
        ))}
      </div>
      <div className="md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-28 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

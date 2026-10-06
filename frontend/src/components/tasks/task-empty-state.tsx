import { ClipboardList, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TaskEmptyStateProps {
  onCreate: () => void;
}

export function TaskEmptyState({ onCreate }: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/30 px-6 py-16 text-center backdrop-blur">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-base font-semibold">No tasks yet.</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first task to get started.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus />
        Create Task
      </Button>
    </div>
  );
}

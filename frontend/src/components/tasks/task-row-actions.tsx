import { History, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";

interface TaskRowActionsProps {
  task: Task;
  onChangeStatus: (task: Task) => void;
  onViewAudit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskRowActions({
  task,
  onChangeStatus,
  onViewAudit,
  onDelete
}: TaskRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        title={
          task.status === "done"
            ? "No further status transitions available"
            : "Change status"
        }
        aria-label="Change status"
        disabled={task.status === "done"}
        onClick={() => onChangeStatus(task)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Audit history"
        aria-label="Audit history"
        onClick={() => onViewAudit(task)}
      >
        <History className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Delete task"
        aria-label="Delete task"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(task)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

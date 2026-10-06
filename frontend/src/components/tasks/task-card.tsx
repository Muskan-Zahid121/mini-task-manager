import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types/task";
import { TaskRowActions } from "./task-row-actions";
import { TaskStatusBadge } from "./task-status-badge";

interface TaskCardProps {
  tasks: Task[];
  onChangeStatus: (task: Task) => void;
  onViewAudit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ tasks, onChangeStatus, onViewAudit, onDelete }: TaskCardProps) {
  return (
    <div className="space-y-3 md:hidden">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="break-words font-medium leading-snug">{task.title}</p>
              <TaskStatusBadge status={task.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Created {formatDate(task.createdAt)}</span>
              <span>Updated {formatDate(task.updatedAt)}</span>
            </div>
            <Separator className="my-3" />
            <TaskRowActions
              task={task}
              onChangeStatus={onChangeStatus}
              onViewAudit={onViewAudit}
              onDelete={onDelete}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

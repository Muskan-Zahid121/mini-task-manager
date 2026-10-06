import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types/task";
import { TaskRowActions } from "./task-row-actions";
import { TaskStatusBadge } from "./task-status-badge";

interface TaskTableProps {
  tasks: Task[];
  onChangeStatus: (task: Task) => void;
  onViewAudit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskTable({ tasks, onChangeStatus, onViewAudit, onDelete }: TaskTableProps) {
  return (
    <div className="animate-fade-in-up hidden overflow-hidden rounded-xl border border-white/10 bg-card/50 shadow-xl shadow-black/20 backdrop-blur-xl md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="pr-4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="max-w-xs truncate py-3 pl-4 font-medium">
                {task.title}
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(task.createdAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(task.updatedAt)}
              </TableCell>
              <TableCell className="pr-3">
                <TaskRowActions
                  task={task}
                  onChangeStatus={onChangeStatus}
                  onViewAudit={onViewAudit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

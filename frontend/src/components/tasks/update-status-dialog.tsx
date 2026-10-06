import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ACTORS, type Actor } from "@/constants/actors";
import { STATUS_LABELS, getNextStatuses } from "@/constants/statuses";
import type { UpdateStatusResult } from "@/services/api";
import { getApiErrorMessage } from "@/services/api";
import type { Task, TaskStatus } from "@/types/task";
import { TaskStatusBadge } from "./task-status-badge";

interface UpdateStatusDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: TaskStatus, actor: Actor) => Promise<UpdateStatusResult>;
}

export function UpdateStatusDialog({
  task,
  open,
  onOpenChange,
  onUpdateStatus
}: UpdateStatusDialogProps) {
  const [actor, setActor] = useState<Actor>("john.doe");
  const [nextStatus, setNextStatus] = useState<TaskStatus | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStatuses = task ? getNextStatuses(task.status) : [];

  useEffect(() => {
    if (open && task) {
      setActor("john.doe");
      setNextStatus(getNextStatuses(task.status)[0] ?? "");
    }
  }, [open, task]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!task || !nextStatus) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onUpdateStatus(task.id, nextStatus, actor);
      if (result.auditLog) {
        toast.success(`Status updated to ${STATUS_LABELS[nextStatus]}`);
      } else {
        toast.info("Task is already in this status");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {task?.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
              <span className="text-sm text-muted-foreground">Current status</span>
              {task && <TaskStatusBadge status={task.status} />}
            </div>

            {nextStatuses.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="actor">Actor</Label>
                  <Select value={actor} onValueChange={(value) => setActor(value as Actor)}>
                    <SelectTrigger id="actor">
                      <SelectValue placeholder="Select actor" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTORS.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="next-status">New status</Label>
                  <Select
                    value={nextStatus}
                    onValueChange={(value) => setNextStatus(value as TaskStatus)}
                  >
                    <SelectTrigger id="next-status">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {nextStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Only valid transitions are offered. Invalid ones are rejected by the API.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                This task is completed. No further status transitions are available.
              </p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !nextStatus}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

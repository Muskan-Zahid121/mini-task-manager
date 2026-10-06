import { useEffect, useState } from "react";
import { ArrowRight, History } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_LABELS } from "@/constants/statuses";
import { formatDateTime } from "@/lib/utils";
import { getApiErrorMessage, getTaskAuditLogs } from "@/services/api";
import type { AuditLog } from "@/types/audit-log";
import type { Task } from "@/types/task";

interface TaskAuditDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskAuditDialog({ task, open, onOpenChange }: TaskAuditDialogProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getTaskAuditLogs(task.id)
      .then((logs) => {
        if (!cancelled) {
          setAuditLogs(logs);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, task]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit History
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {task?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : auditLogs.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No status changes recorded yet.
            </p>
          ) : (
            <ol className="relative space-y-5 border-l pl-5">
              {auditLogs.map((log) => (
                <li key={log.id} className="relative">
                  <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{log.actor}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{STATUS_LABELS[log.fromStatus]}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      {STATUS_LABELS[log.toStatus]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

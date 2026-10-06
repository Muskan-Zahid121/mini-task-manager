import type { TaskStatus } from "@/types/task";

export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  to_do: ["pending"],
  pending: ["in_progress"],
  in_progress: ["done"],
  done: []
};

export function getNextStatuses(status: TaskStatus): TaskStatus[] {
  return STATUS_TRANSITIONS[status];
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done"
};

export const STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
  to_do: "border-slate-400/30 bg-slate-400/10 text-slate-300",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  done: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
};

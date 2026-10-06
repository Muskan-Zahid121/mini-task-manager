import { TaskStatus } from "../constants/statuses";

export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  to_do: ["pending"],
  pending: ["in_progress"],
  in_progress: ["done"],
  done: []
};

export function getNextStatuses(currentStatus: TaskStatus): TaskStatus[] {
  return STATUS_TRANSITIONS[currentStatus];
}

export function isValidStatusTransition(
  currentStatus: TaskStatus,
  nextStatus: TaskStatus
): boolean {
  return STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}

import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "@/constants/statuses";
import type { TaskStatus } from "@/types/task";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={STATUS_BADGE_CLASSES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

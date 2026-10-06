import { Card, CardContent } from "@/components/ui/card";
import { STATUS_LABELS } from "@/constants/statuses";
import type { Task, TaskStatus } from "@/types/task";

const STATUS_DOTS: Record<TaskStatus, string> = {
  to_do: "bg-slate-400",
  pending: "bg-amber-400",
  in_progress: "bg-blue-400",
  done: "bg-emerald-400"
};

export function TaskStats({ tasks }: { tasks: Task[] }) {
  const counts: Record<TaskStatus, number> = {
    to_do: 0,
    pending: 0,
    in_progress: 0,
    done: 0
  };
  for (const task of tasks) {
    counts[task.status] += 1;
  }

  const stats: { label: string; value: number; dot?: string }[] = [
    { label: "Total Tasks", value: tasks.length },
    { label: STATUS_LABELS.to_do, value: counts.to_do, dot: STATUS_DOTS.to_do },
    { label: STATUS_LABELS.pending, value: counts.pending, dot: STATUS_DOTS.pending },
    { label: STATUS_LABELS.in_progress, value: counts.in_progress, dot: STATUS_DOTS.in_progress },
    { label: STATUS_LABELS.done, value: counts.done, dot: STATUS_DOTS.done }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {stat.dot && <span className={`h-2 w-2 rounded-full ${stat.dot}`} />}
              {stat.label}
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useState } from "react";
import { LogOut, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { logout } from "@/lib/auth";
import { TaskStats } from "@/components/dashboard/task-stats";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskAuditDialog } from "@/components/tasks/task-audit-dialog";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskEmptyState } from "@/components/tasks/task-empty-state";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { TaskTable } from "@/components/tasks/task-table";
import { UpdateStatusDialog } from "@/components/tasks/update-status-dialog";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/types/task";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    isLoading,
    error,
    refresh,
    createTask,
    updateTaskStatus,
    deleteTask
  } = useTasks();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusTask, setStatusTask] = useState<Task | null>(null);
  const [auditTask, setAuditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const openCreateDialog = () => setIsCreateOpen(true);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mini Task Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Simple task tracking with transparent status history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreateDialog} className="shrink-0">
            <Plus />
            Create Task
          </Button>
          <Button variant="outline" onClick={handleLogout} className="shrink-0">
            <LogOut />
            Logout
          </Button>
        </div>
      </div>

      <TaskStats tasks={tasks} />

      <div className="mt-8">
        {isLoading ? (
          <TaskSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-card/30 px-6 py-16 text-center backdrop-blur">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => void refresh()}>
              <RefreshCw />
              Retry
            </Button>
          </div>
        ) : tasks.length === 0 ? (
          <TaskEmptyState onCreate={openCreateDialog} />
        ) : (
          <>
            <TaskTable
              tasks={tasks}
              onChangeStatus={setStatusTask}
              onViewAudit={setAuditTask}
              onDelete={setDeleteTarget}
            />
            <TaskCard
              tasks={tasks}
              onChangeStatus={setStatusTask}
              onViewAudit={setAuditTask}
              onDelete={setDeleteTarget}
            />
          </>
        )}
      </div>

      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={createTask}
      />
      <UpdateStatusDialog
        task={statusTask}
        open={statusTask !== null}
        onOpenChange={(open) => {
          if (!open) {
            setStatusTask(null);
          }
        }}
        onUpdateStatus={updateTaskStatus}
      />
      <TaskAuditDialog
        task={auditTask}
        open={auditTask !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAuditTask(null);
          }
        }}
      />
      <DeleteTaskDialog
        task={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onDelete={deleteTask}
      />
    </DashboardLayout>
  );
}

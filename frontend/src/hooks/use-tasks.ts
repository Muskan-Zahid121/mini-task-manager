import { useCallback, useEffect, useState } from "react";
import type { Actor } from "@/constants/actors";
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  getApiErrorMessage,
  getTasks,
  updateTaskStatus as updateTaskStatusApi
} from "@/services/api";
import type { Task, TaskStatus } from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(
    async (title: string) => {
      await createTaskApi(title);
      await refresh();
    },
    [refresh]
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus, actor: Actor) => {
      const result = await updateTaskStatusApi(id, status, actor);
      await refresh();
      return result;
    },
    [refresh]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskApi(id);
      await refresh();
    },
    [refresh]
  );

  return { tasks, isLoading, error, refresh, createTask, updateTaskStatus, deleteTask };
}

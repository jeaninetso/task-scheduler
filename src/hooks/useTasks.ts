import { useCallback, useEffect, useState } from 'react';
import type { Task } from '../types';

const STORAGE_KEY = 'task-scheduler:tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((input: Omit<Task, 'id'>) => {
    setTasks((prev) => [...prev, { ...input, id: crypto.randomUUID() }]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev
        .filter((task) => task.id !== id)
        .map((task) => ({
          ...task,
          dependencies: task.dependencies.filter((depId) => depId !== id),
        })),
    );
  }, []);

  return { tasks, addTask, removeTask };
}

import type { Task, TopoSortResult, CycleError } from '../types';

export interface Graph {
  adjacency: Map<string, string[]>;
  inDegree: Map<string, number>;
}

/**
 * Build the adjacency list with key edges: for a dependency edge dep ->
 * task (dep must finish before task starts), so adjacency.get(dep) contains
 * task.id and inDegree[task] counts how many deps it's waiting on.
 */
export function buildGraph(tasks: Task[]): Graph {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const task of tasks) {
    if (!adjacency.has(task.id)) adjacency.set(task.id, []); // add task if it DNE
    if (!inDegree.has(task.id)) inDegree.set(task.id, 0); // set deps for task
  }

  for (const task of tasks) {
    for (const depId of task.dependencies) {
      if (!adjacency.has(depId)) adjacency.set(depId, []);
      if (!inDegree.has(depId)) inDegree.set(depId, 0);
      adjacency.get(depId)!.push(task.id);
      inDegree.set(task.id, (inDegree.get(task.id) ?? 0) + 1);
    }
  }

  return { adjacency, inDegree };
}

/**
 * Kahn's algorithm. Runs in O(V + E) using an index-based queue (no
 * array.shift(), which would make this O(V^2)). Any node still unprocessed
 * when the queue drains is part of, or blocked by, a cycle.
 */
export function topologicalSort(tasks: Task[]): TopoSortResult {
  const { adjacency, inDegree } = buildGraph(tasks);
  const remaining = new Map(inDegree);

  const queue: string[] = []; // tasks with deg = 0
  for (const [id, degree] of remaining) {
    if (degree === 0) queue.push(id);
  }

  const order: string[] = [];
  let pointer = 0;
  while (pointer < queue.length) {
    const id = queue[pointer++];
    order.push(id);
    for (const neighbor of adjacency.get(id) ?? []) {
      const next = (remaining.get(neighbor) ?? 0) - 1;
      remaining.set(neighbor, next);
      if (next === 0) queue.push(neighbor);
    }
  }

  const allIds = [...remaining.keys()];
  if (order.length < allIds.length) {
    const resolved = new Set(order);
    const cycleNodeIds = allIds.filter((id) => !resolved.has(id));
    return { order, cycle: { hasCycle: true, cycleNodeIds } };
  }

  return { order };
}

export function detectCycle(tasks: Task[]): CycleError | null {
  return topologicalSort(tasks).cycle ?? null;
}

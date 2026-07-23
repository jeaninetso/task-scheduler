export interface Task {
  id: string;
  name: string;
  durationMinutes: number;
  dependencies: string[]; // ids of tasks that must complete before this one can start
  priority: number; // 1 (highest) to 5 (lowest)
  deadline?: string; // ISO date string, optional
}

export type TieBreakMode = 'fifo' | 'priority' | 'deadline';

export interface ScheduledItem {
  taskId: string;
  startMinuteOffset: number;
}

export interface DaySchedule {
  dayIndex: number;
  items: ScheduledItem[];
  totalMinutesUsed: number;
}

export interface CycleError {
  hasCycle: true;
  cycleNodeIds: string[]; // ids of tasks that are part of (or blocked by) a cycle
}

export interface TopoSortResult {
  order: string[];
  cycle?: CycleError;
}

export interface Task {
  id: string
  name: string
  durationMinutes: number
  /** ids of tasks that must complete before this one can start */
  dependencies: string[]
  /** 1 (highest) to 5 (lowest) */
  priority: number
  /** ISO date string, optional */
  deadline?: string
}

export type TieBreakMode = 'fifo' | 'priority' | 'deadline'

export interface ScheduledItem {
  taskId: string
  startMinuteOffset: number
}

export interface DaySchedule {
  dayIndex: number
  items: ScheduledItem[]
  totalMinutesUsed: number
}

export interface CycleError {
  hasCycle: true
  /** ids of tasks that are part of (or blocked by) a cycle */
  cycleNodeIds: string[]
}

export interface TopoSortResult {
  order: string[]
  cycle?: CycleError
}

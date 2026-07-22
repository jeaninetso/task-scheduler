import type { Task } from '../types'

interface TaskListProps {
  tasks: Task[]
  onRemove: (id: string) => void
}

export function TaskList({ tasks, onRemove }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-slate-500">No tasks yet.</p>
  }

  const nameById = new Map(tasks.map((task) => [task.id, task.name]))

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between border rounded px-3 py-2"
        >
          <div>
            <p className="font-medium">{task.name}</p>
            <p className="text-xs text-slate-500">
              {task.durationMinutes}min · priority {task.priority}
              {task.dependencies.length > 0 &&
                ` · depends on ${task.dependencies
                  .map((id) => nameById.get(id) ?? id)
                  .join(', ')}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(task.id)}
            className="text-sm text-red-600"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}

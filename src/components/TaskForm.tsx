import { useState, type FormEvent } from 'react'
import type { Task } from '../types'

interface TaskFormProps {
  existingTasks: Task[]
  onAdd: (input: Omit<Task, 'id'>) => void
}

export function TaskForm({ existingTasks, onAdd }: TaskFormProps) {
  const [name, setName] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [priority, setPriority] = useState(3)
  const [dependencies, setDependencies] = useState<string[]>([])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), durationMinutes, priority, dependencies })
    setName('')
    setDurationMinutes(30)
    setPriority(3)
    setDependencies([])
  }

  function toggleDependency(id: string) {
    setDependencies((prev) =>
      prev.includes(id) ? prev.filter((depId) => depId !== id) : [...prev, id],
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Task name</span>
        <input
          className="border rounded px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Write report"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Duration (minutes)</span>
        <input
          type="number"
          min={1}
          className="border rounded px-2 py-1"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Priority (1 highest - 5 lowest)</span>
        <input
          type="number"
          min={1}
          max={5}
          className="border rounded px-2 py-1"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
      </label>

      {existingTasks.length > 0 && (
        <fieldset className="flex flex-col gap-1">
          <legend className="text-sm font-medium">Depends on</legend>
          {existingTasks.map((task) => (
            <label key={task.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={dependencies.includes(task.id)}
                onChange={() => toggleDependency(task.id)}
              />
              {task.name}
            </label>
          ))}
        </fieldset>
      )}

      <button
        type="submit"
        className="bg-slate-900 text-white rounded px-3 py-1.5 self-start"
      >
        Add task
      </button>
    </form>
  )
}

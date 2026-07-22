import { useMemo } from 'react'
import { topologicalSort } from './algorithms/graph'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'

function App() {
  const { tasks, addTask, removeTask } = useTasks()
  const sortResult = useMemo(() => topologicalSort(tasks), [tasks])
  const nameById = useMemo(
    () => new Map(tasks.map((task) => [task.id, task.name])),
    [tasks],
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 flex flex-col gap-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold">Task Scheduler</h1>

      <TaskForm existingTasks={tasks} onAdd={addTask} />
      <TaskList tasks={tasks} onRemove={removeTask} />

      <section>
        <h2 className="text-lg font-medium mb-2">Topological order (debug)</h2>
        {sortResult.cycle ? (
          <pre className="bg-red-50 text-red-700 text-sm p-3 rounded overflow-x-auto">
            Cycle detected among:{' '}
            {sortResult.cycle.cycleNodeIds
              .map((id) => nameById.get(id) ?? id)
              .join(', ')}
          </pre>
        ) : (
          <pre className="bg-white border text-sm p-3 rounded overflow-x-auto">
            {sortResult.order.length > 0
              ? sortResult.order.map((id) => nameById.get(id) ?? id).join(' -> ')
              : '(no tasks yet)'}
          </pre>
        )}
      </section>
    </div>
  )
}

export default App

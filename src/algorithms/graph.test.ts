import { describe, it, expect } from 'vitest'
import type { Task } from '../types'
import { buildGraph, detectCycle, topologicalSort } from './graph'

function makeTask(id: string, dependencies: string[] = []): Task {
  return { id, name: id, durationMinutes: 30, dependencies, priority: 3 }
}

/** every dependency of every task in `order` must appear before it */
function respectsDependencyOrder(tasks: Task[], order: string[]): boolean {
  const position = new Map(order.map((id, i) => [id, i]))
  return tasks.every((task) =>
    task.dependencies.every((depId) => {
      if (!position.has(depId) || !position.has(task.id)) return true
      return position.get(depId)! < position.get(task.id)!
    }),
  )
}

describe('buildGraph', () => {
  it('gives every task zero in-degree when there are no dependencies', () => {
    const tasks = [makeTask('a'), makeTask('b')]
    const { inDegree } = buildGraph(tasks)
    expect(inDegree.get('a')).toBe(0)
    expect(inDegree.get('b')).toBe(0)
  })

  it('counts in-degree per dependency edge', () => {
    const tasks = [makeTask('a'), makeTask('b'), makeTask('c', ['a', 'b'])]
    const { inDegree, adjacency } = buildGraph(tasks)
    expect(inDegree.get('c')).toBe(2)
    expect(adjacency.get('a')).toContain('c')
    expect(adjacency.get('b')).toContain('c')
  })
})

describe('topologicalSort', () => {
  it('returns an empty order for an empty task list', () => {
    expect(topologicalSort([])).toEqual({ order: [] })
  })

  it('orders a linear chain correctly', () => {
    const tasks = [makeTask('a'), makeTask('b', ['a']), makeTask('c', ['b'])]
    const result = topologicalSort(tasks)
    expect(result.cycle).toBeUndefined()
    expect(result.order).toEqual(['a', 'b', 'c'])
  })

  it('orders a diamond dependency graph correctly', () => {
    const tasks = [
      makeTask('a'),
      makeTask('b', ['a']),
      makeTask('c', ['a']),
      makeTask('d', ['b', 'c']),
    ]
    const result = topologicalSort(tasks)
    expect(result.cycle).toBeUndefined()
    expect(result.order).toHaveLength(4)
    expect(respectsDependencyOrder(tasks, result.order)).toBe(true)
  })

  it('handles disconnected chains independently', () => {
    const tasks = [
      makeTask('a'),
      makeTask('b', ['a']),
      makeTask('x'),
      makeTask('y', ['x']),
    ]
    const result = topologicalSort(tasks)
    expect(result.cycle).toBeUndefined()
    expect(result.order).toHaveLength(4)
    expect(respectsDependencyOrder(tasks, result.order)).toBe(true)
  })

  it('detects a two-node cycle', () => {
    const tasks = [makeTask('a', ['b']), makeTask('b', ['a'])]
    const result = topologicalSort(tasks)
    expect(result.cycle?.hasCycle).toBe(true)
    expect(result.cycle?.cycleNodeIds.sort()).toEqual(['a', 'b'])
  })

  it('detects a self-loop as a cycle', () => {
    const tasks = [makeTask('a', ['a']), makeTask('b')]
    const result = topologicalSort(tasks)
    expect(result.cycle?.cycleNodeIds).toEqual(['a'])
    expect(result.order).toContain('b')
  })

  it('only flags the nodes actually stuck in a cycle, not the whole graph', () => {
    const tasks = [
      makeTask('a'),
      makeTask('b', ['a']),
      makeTask('x', ['y']),
      makeTask('y', ['x']),
    ]
    const result = topologicalSort(tasks)
    expect(result.cycle?.cycleNodeIds.sort()).toEqual(['x', 'y'])
    expect(result.order.sort()).toEqual(['a', 'b'])
  })
})

describe('detectCycle', () => {
  it('returns null for an acyclic graph', () => {
    expect(detectCycle([makeTask('a'), makeTask('b', ['a'])])).toBeNull()
  })

  it('returns the cycle for a cyclic graph', () => {
    const cycle = detectCycle([makeTask('a', ['b']), makeTask('b', ['a'])])
    expect(cycle?.hasCycle).toBe(true)
  })
})

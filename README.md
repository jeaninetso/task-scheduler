# Task Scheduler

A dependency-aware task scheduler: add tasks with durations and dependencies, and it topologically sorts them, detects circular dependencies, and (coming in later days) greedily schedules them into daily time blocks.

Built as a React + TypeScript learning project, focused on implementing real data structures and algorithms rather than leaning on library defaults.

## Algorithms implemented so far

- **Topological sort (Kahn's algorithm)** — `src/algorithms/graph.ts`, O(V + E) using an index-based queue instead of `Array.shift()`.
- **Cycle detection** — a free byproduct of Kahn's algorithm: any node left unprocessed when the queue drains is part of, or blocked by, a cycle.
- **Binary min-heap** — `src/algorithms/minHeap.ts`, generic over a comparator, O(log n) push/pop. Will back priority-based scheduling.

## Stack

Vite, React, TypeScript, Tailwind CSS v4, Vitest + React Testing Library. No backend — state is persisted to `localStorage`.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm test         # run the algorithm test suite
npx tsc -b       # type-check
```

## Status

Day 1 of a multi-day build: core graph algorithms, cycle detection, and the min-heap are implemented and unit-tested. Task creation/removal with dependency selection works end-to-end. Next up: the greedy scheduling engine and a calendar view.

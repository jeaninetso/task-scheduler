import { describe, it, expect } from 'vitest';
import { MinHeap } from './minHeap';

describe('MinHeap', () => {
  it('pops undefined and peeks undefined when empty', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    expect(heap.pop()).toBeUndefined();
    expect(heap.peek()).toBeUndefined();
    expect(heap.size).toBe(0);
  });

  it('pops items in ascending order', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    const input = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0];
    input.forEach((n) => heap.push(n));

    const output: number[] = [];
    while (heap.size > 0) output.push(heap.pop() as number);

    expect(output).toEqual([...input].sort((a, b) => a - b));
  });

  it('peek returns the min without removing it', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    heap.push(5);
    heap.push(1);
    heap.push(3);
    expect(heap.peek()).toBe(1);
    expect(heap.size).toBe(3);
  });

  it('handles duplicate priorities without losing elements', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    [3, 3, 3, 1, 1, 2].forEach((n) => heap.push(n));
    const output: number[] = [];
    while (heap.size > 0) output.push(heap.pop() as number);
    expect(output).toEqual([1, 1, 2, 3, 3, 3]);
  });

  it('supports a custom comparator over objects', () => {
    type Item = { id: string; priority: number };
    const heap = new MinHeap<Item>((a, b) => a.priority - b.priority);
    heap.push({ id: 'low-priority', priority: 5 });
    heap.push({ id: 'high-priority', priority: 1 });
    heap.push({ id: 'mid-priority', priority: 3 });

    expect(heap.pop()?.id).toBe('high-priority');
    expect(heap.pop()?.id).toBe('mid-priority');
    expect(heap.pop()?.id).toBe('low-priority');
  });

  it('maintains heap order under interleaved pushes and pops', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    heap.push(10);
    heap.push(4);
    expect(heap.pop()).toBe(4);
    heap.push(1);
    heap.push(20);
    expect(heap.pop()).toBe(1);
    heap.push(5);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(10);
    expect(heap.pop()).toBe(20);
    expect(heap.pop()).toBeUndefined();
  });
});

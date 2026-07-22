/** Generic binary min-heap. push/pop/peek are all O(log n) except peek which is O(1). */
export class MinHeap<T> {
  private items: T[] = []
  private compare: (a: T, b: T) => number

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare
  }

  get size(): number {
    return this.items.length
  }

  peek(): T | undefined {
    return this.items[0]
  }

  push(item: T): void {
    this.items.push(item)
    this.bubbleUp(this.items.length - 1)
  }

  pop(): T | undefined {
    if (this.items.length === 0) return undefined
    const top = this.items[0]
    const last = this.items.pop() as T
    if (this.items.length > 0) {
      this.items[0] = last
      this.bubbleDown(0)
    }
    return top
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = (index - 1) >> 1
      if (this.compare(this.items[index], this.items[parent]) >= 0) break
      this.swap(index, parent)
      index = parent
    }
  }

  private bubbleDown(index: number): void {
    const n = this.items.length
    while (true) {
      const left = index * 2 + 1
      const right = index * 2 + 2
      let smallest = index
      if (left < n && this.compare(this.items[left], this.items[smallest]) < 0) {
        smallest = left
      }
      if (right < n && this.compare(this.items[right], this.items[smallest]) < 0) {
        smallest = right
      }
      if (smallest === index) break
      this.swap(index, smallest)
      index = smallest
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.items[i]
    this.items[i] = this.items[j]
    this.items[j] = tmp
  }
}

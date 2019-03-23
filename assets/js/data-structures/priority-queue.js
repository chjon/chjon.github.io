export class PriorityQueue {
  constructor(priorityRule) {
    this.queue = [];
    this.priorityRule = priorityRule;
  }

  forEach(callback) {
    this.queue.forEach(callback);
  }

  length() {
    return this.queue.length;
  }

  peek() {
    return this.queue[0];
  }

  pop() {
    return this.queue.shift();
  }

  push(newElement) {
    let insertionIndex = 0;

    while (
      insertionIndex < this.queue.length &&
      this.priorityRule(newElement, this.queue[insertionIndex]) >= 0
    ) {
      insertionIndex++;
    }

    this.queue.splice(insertionIndex, 0, newElement);
  }
}
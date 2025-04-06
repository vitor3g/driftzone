
type TickCallback = (delta: number) => void;

export class TickManager {
  private subscribers = new Set<TickCallback>();

  constructor() {}

  public add(fn: TickCallback) {
    if (!fn) return;

    this.subscribers.add(fn);
  }

  public remove(fn: TickCallback) {
    this.subscribers.delete(fn);
  }

  public update(delta: number) {
    for (const fn of this.subscribers) {
      fn(delta);
    }
  }
}
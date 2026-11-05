import type { JobEvent } from '../domain/models.js';

type EventListener = (event: JobEvent) => void;

export class EventBroker {
  private subscribers = new Map<string, Set<EventListener>>();

  subscribe(jobId: string, listener: EventListener): () => void {
    let set = this.subscribers.get(jobId);
    if (!set) {
      set = new Set();
      this.subscribers.set(jobId, set);
    }
    set.add(listener);

    return () => {
      const current = this.subscribers.get(jobId);
      if (!current) return;
      current.delete(listener);
      if (current.size === 0) {
        this.subscribers.delete(jobId);
      }
    };
  }

  publish(jobId: string, event: Omit<JobEvent, 'timestamp'> & { timestamp?: string }): void {
    const set = this.subscribers.get(jobId);
    if (!set) return;
    const fullEvent: JobEvent = {
      ...event,
      timestamp: event.timestamp ?? new Date().toISOString(),
    };
    for (const listener of [...set]) {
      try {
        listener(fullEvent);
      } catch {
        // Ignore subscriber error
      }
    }
  }
}

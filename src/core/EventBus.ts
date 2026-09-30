// Simple typed EventBus for decoupled game event handling

type EventCallback = (data?: any) => void;

class GameEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    const subs = this.listeners.get(event);
    if (subs) {
      subs.delete(callback);
    }
  }

  emit(event: string, data?: any) {
    const subs = this.listeners.get(event);
    if (subs) {
      subs.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new GameEventBus();

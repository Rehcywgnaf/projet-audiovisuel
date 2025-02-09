type EventCallback = (data?: any) => void;

export class EventSystem {
  private static instance: EventSystem;
  private events: Map<string, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem();
    }
    return EventSystem.instance;
  }

  // Enregistrer un écouteur pour un événement
  on(eventName: string, callback: EventCallback): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    
    const eventListeners = this.events.get(eventName)!;
    eventListeners.add(callback);

    // Retourne une fonction de désabonnement
    return () => {
      eventListeners.delete(callback);
    };
  }

  // Émettre un événement
  emit(eventName: string, data?: any): void {
    const eventListeners = this.events.get(eventName);
    
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  // Permettre de vider tous les listeners d'un événement
  clear(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

export default EventSystem;
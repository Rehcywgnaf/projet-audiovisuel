type EventCallback = (data: any) => void;
type EventName = 'roleChanged' | 'permissionChanged';

class EventSystem {
    private static instance: EventSystem;
    private listeners: Map<EventName, EventCallback[]>;

    private constructor() {
        this.listeners = new Map();
    }

    static getInstance(): EventSystem {
        if (!EventSystem.instance) {
            EventSystem.instance = new EventSystem();
        }
        return EventSystem.instance;
    }

    on(event: EventName, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    emit(event: EventName, data: any) {
        if (this.listeners.has(event)) {
            this.listeners.get(event)?.forEach(callback => callback(data));
        }
    }

    off(event: EventName, callback: EventCallback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event) ?? [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}
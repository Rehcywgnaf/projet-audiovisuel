import { EventSystem } from '../../src/core/EventSystem';

describe('EventSystem', () => {
    let eventSystem: EventSystem;

    beforeEach(() => {
        eventSystem = EventSystem.getInstance();
    });

    test('doit maintenir une seule instance (singleton)', () => {
        const instance1 = EventSystem.getInstance();
        const instance2 = EventSystem.getInstance();
        expect(instance1).toBe(instance2);
    });

    test('doit permettre l\'abonnement et la réception d\'événements', () => {
        const mockCallback = jest.fn();
        eventSystem.on('roleChanged', mockCallback);
        
        const testData = { userId: 'user1', role: 'admin' };
        eventSystem.emit('roleChanged', testData);
        
        expect(mockCallback).toHaveBeenCalledWith(testData);
    });

    test('doit permettre le désabonnement', () => {
        const mockCallback = jest.fn();
        eventSystem.on('roleChanged', mockCallback);
        eventSystem.off('roleChanged', mockCallback);
        
        eventSystem.emit('roleChanged', {});
        
        expect(mockCallback).not.toHaveBeenCalled();
    });

    test('doit gérer plusieurs abonnés', () => {
        const mockCallback1 = jest.fn();
        const mockCallback2 = jest.fn();
        
        eventSystem.on('roleChanged', mockCallback1);
        eventSystem.on('roleChanged', mockCallback2);
        
        const testData = { userId: 'user1', role: 'admin' };
        eventSystem.emit('roleChanged', testData);
        
        expect(mockCallback1).toHaveBeenCalledWith(testData);
        expect(mockCallback2).toHaveBeenCalledWith(testData);
    });

    test('doit ignorer les événements sans abonnés', () => {
        expect(() => {
            eventSystem.emit('roleChanged', {});
        }).not.toThrow();
    });
});
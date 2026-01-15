/**
 * Base class for all domain events
 */
export abstract class DomainEvent {
    public readonly occurredAt: Date;
    public readonly eventType: string;

    constructor(eventType: string) {
        this.occurredAt = new Date();
        this.eventType = eventType;
    }

    /**
     * Converts event to JSON representation
     */
    abstract toJSON(): Record<string, any>;
}

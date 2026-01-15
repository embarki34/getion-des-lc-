import { DomainEvent } from '../../domain/events/DomainEvent';

/**
 * Port for event publisher
 * Enables event-driven architecture
 */
export interface IEventPublisher {
    /**
     * Publishes a domain event
     */
    publish(event: DomainEvent): Promise<void>;

    /**
     * Publishes multiple domain events
     */
    publishAll(events: DomainEvent[]): Promise<void>;
}

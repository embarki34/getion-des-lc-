import { IEventPublisher } from '../../application/ports/IEventPublisher';
import { DomainEvent } from '../../domain/events/DomainEvent';

/**
 * In-memory implementation of event publisher
 * For production, replace with a proper message broker (RabbitMQ, Kafka, etc.)
 */
export class InMemoryEventPublisher implements IEventPublisher {
    /**
     * Publishes a domain event
     */
    async publish(event: DomainEvent): Promise<void> {
        // Log the event (in production, send to message broker)
        console.log('[Event Published]', event.toJSON());
        
        // In a real implementation, you would:
        // 1. Serialize the event
        // 2. Send to message broker
        // 3. Handle failures and retries
    }

    /**
     * Publishes multiple domain events
     */
    async publishAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.publish(event);
        }
    }
}

import { ValidationException } from '../exceptions/DomainExceptions';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

/**
 * UserId value object
 * Strongly-typed user identifier
 */
export class UserId {
    private constructor(private readonly value: string) {}

    /**
     * Creates a new UserId with a generated UUID
     */
    static generate(): UserId {
        return new UserId(uuidv4());
    }

    /**
     * Creates a UserId from an existing string
     * @throws ValidationException if the ID is not a valid UUID
     */
    static fromString(id: string): UserId {
        if (!id) {
            throw new ValidationException('User ID cannot be empty');
        }

        if (!validateUuid(id)) {
            throw new ValidationException(`Invalid User ID format: ${id}`);
        }

        return new UserId(id);
    }

    /**
     * Gets the ID value
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Checks equality with another UserId
     */
    equals(other: UserId): boolean {
        return this.value === other.value;
    }

    /**
     * Returns string representation
     */
    toString(): string {
        return this.value;
    }
}

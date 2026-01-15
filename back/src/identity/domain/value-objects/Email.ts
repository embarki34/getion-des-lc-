import { InvalidEmailException } from '../exceptions/DomainExceptions';

/**
 * Email value object
 * Ensures email is always valid and normalized
 */
export class Email {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    private constructor(private readonly value: string) {}

    /**
     * Creates an Email value object
     * @throws InvalidEmailException if email format is invalid
     */
    static create(email: string): Email {
        const normalized = email.trim().toLowerCase();
        
        if (!normalized) {
            throw new InvalidEmailException('Email cannot be empty');
        }

        if (!this.EMAIL_REGEX.test(normalized)) {
            throw new InvalidEmailException(normalized);
        }

        return new Email(normalized);
    }

    /**
     * Gets the email value
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Checks equality with another Email
     */
    equals(other: Email): boolean {
        return this.value === other.value;
    }

    /**
     * Returns string representation
     */
    toString(): string {
        return this.value;
    }
}

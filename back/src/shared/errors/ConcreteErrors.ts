import { BaseError } from './BaseError';

/**
 * Validation error class
 */
export class ValidationError extends BaseError {
    constructor(message: string, code: string) {
        super(message, code);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends BaseError {
    constructor(message: string, code: string) {
        super(message, code);
    }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends BaseError {
    constructor(message: string, code: string) {
        super(message, code);
    }
}

/**
 * Not found error class
 */
export class NotFoundError extends BaseError {
    constructor(message: string, code: string) {
        super(message, code);
    }
}

/**
 * Internal error class
 */
export class InternalError extends BaseError {
    constructor(message: string, code: string) {
        super(message, code);
    }
}

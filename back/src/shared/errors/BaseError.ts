/**
 * Base error class for all domain and application errors
 */
export abstract class BaseError extends Error {
    public readonly timestamp: Date;
    public readonly code: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.timestamp = new Date();
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Converts error to JSON representation
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            timestamp: this.timestamp.toISOString(),
        };
    }
}

/**
 * Result type for functional error handling
 * Represents either a success with a value or a failure with an error
 */
export class Result<T, E = Error> {
    private constructor(
        private readonly _isSuccess: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) {}

    /**
     * Creates a successful result
     */
    static ok<T, E = Error>(value: T): Result<T, E> {
        return new Result<T, E>(true, value, undefined);
    }

    /**
     * Creates a failed result
     */
    static fail<T, E = Error>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    /**
     * Checks if the result is successful
     */
    isSuccess(): boolean {
        return this._isSuccess;
    }

    /**
     * Checks if the result is a failure
     */
    isFailure(): boolean {
        return !this._isSuccess;
    }

    /**
     * Gets the value if successful, throws if failure
     */
    getValue(): T {
        if (!this._isSuccess) {
            throw new Error('Cannot get value from a failed result');
        }
        return this._value!;
    }

    /**
     * Gets the error if failure, throws if success
     */
    getError(): E {
        if (this._isSuccess) {
            throw new Error('Cannot get error from a successful result');
        }
        return this._error!;
    }

    /**
     * Maps the value if successful
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        if (this._isSuccess) {
            return Result.ok(fn(this._value!));
        }
        return Result.fail(this._error!);
    }

    /**
     * Flat maps the value if successful
     */
    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        if (this._isSuccess) {
            return fn(this._value!);
        }
        return Result.fail(this._error!);
    }

    /**
     * Executes a function if successful
     */
    onSuccess(fn: (value: T) => void): Result<T, E> {
        if (this._isSuccess) {
            fn(this._value!);
        }
        return this;
    }

    /**
     * Executes a function if failure
     */
    onFailure(fn: (error: E) => void): Result<T, E> {
        if (!this._isSuccess) {
            fn(this._error!);
        }
        return this;
    }

    /**
     * Gets the value or a default value if failure
     */
    getOrElse(defaultValue: T): T {
        return this._isSuccess ? this._value! : defaultValue;
    }

    /**
     * Gets the value or computes a default value if failure
     */
    getOrElseGet(fn: (error: E) => T): T {
        return this._isSuccess ? this._value! : fn(this._error!);
    }
}

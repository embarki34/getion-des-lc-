import { BaseError } from "../../../shared/errors/BaseError";
import { ErrorCodes } from "../../../shared/errors/ErrorCodes";

/**
 * Base class for all domain exceptions
 */
export abstract class DomainException extends BaseError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

/**
 * Thrown when validation fails in the domain layer
 */
export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message, ErrorCodes.VALIDATION_ERROR);
  }
}

/**
 * Thrown when email format is invalid
 */
export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, ErrorCodes.INVALID_EMAIL_FORMAT);
  }
}

/**
 * Thrown when password doesn't meet requirements
 */
export class InvalidPasswordException extends DomainException {
  constructor(message: string) {
    super(message, ErrorCodes.INVALID_PASSWORD_FORMAT);
  }
}

/**
 * Thrown when user credentials are invalid
 */
export class InvalidCredentialsException extends DomainException {
  constructor() {
    super("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS);
  }
}

/**
 * Thrown when user account is locked
 */
export class AccountLockedException extends DomainException {
  constructor(lockedUntil: Date) {
    super(
      `Account is locked until ${lockedUntil.toISOString()}`,
      ErrorCodes.ACCOUNT_LOCKED
    );
  }
}

/**
 * Thrown when email is not verified
 */
export class EmailNotVerifiedException extends DomainException {
  constructor() {
    super(
      "Email address must be verified before login",
      ErrorCodes.EMAIL_NOT_VERIFIED
    );
  }
}

/**
 * Thrown when user already exists
 */
export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }
}

/**
 * Thrown when user is not found
 */
export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, ErrorCodes.USER_NOT_FOUND);
  }
}

/**
 * Thrown when account is deactivated
 */
export class AccountDeactivatedException extends DomainException {
  constructor() {
    super("Account has been deactivated", ErrorCodes.ACCOUNT_DEACTIVATED);
  }
}

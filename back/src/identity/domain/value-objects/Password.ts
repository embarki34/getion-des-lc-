import { InvalidPasswordException } from "../exceptions/DomainExceptions";

/**
 * Password value object
 * Ensures password meets security requirements
 */
export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;
  private static readonly REQUIRE_UPPERCASE = true;
  private static readonly REQUIRE_LOWERCASE = true;
  private static readonly REQUIRE_DIGIT = true;
  private static readonly REQUIRE_SPECIAL_CHAR = true;

  private constructor(private readonly value: string) {}

  /**
   * Creates a Password value object
   * @throws InvalidPasswordException if password doesn't meet requirements
   */
  static create(password: string): Password {
    this.validate(password);
    return new Password(password);
  }

  /**
   * Creates a Password from an already hashed value
   * Used when loading from database
   */
  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  /**
   * Validates password against security requirements
   */
  private static validate(password: string): void {
    if (!password) {
      throw new InvalidPasswordException("Password cannot be empty");
    }

    if (password.length < this.MIN_LENGTH) {
      throw new InvalidPasswordException(
        `Password must be at least ${this.MIN_LENGTH} characters long`
      );
    }

    if (password.length > this.MAX_LENGTH) {
      throw new InvalidPasswordException(
        `Password must not exceed ${this.MAX_LENGTH} characters`
      );
    }

    // if (this.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    //     throw new InvalidPasswordException(
    //         'Password must contain at least one uppercase letter'
    //     );
    // }

    // if (this.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    //   throw new InvalidPasswordException(
    //     "Password must contain at least one lowercase letter"
    //   );
    // }

    // if (this.REQUIRE_DIGIT && !/\d/.test(password)) {
    //   throw new InvalidPasswordException(
    //     "Password must contain at least one digit"
    //   );
    // }

    // if (
    //   this.REQUIRE_SPECIAL_CHAR &&
    //   !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    // ) {
    //   throw new InvalidPasswordException(
    //     "Password must contain at least one special character"
    //   );
    // }
  }

  /**
   * Gets the password value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Checks if this is a hashed password
   * Bcrypt hashes start with $2a$, $2b$, or $2y$
   */
  isHashed(): boolean {
    return /^\$2[aby]\$/.test(this.value);
  }

  /**
   * Returns masked representation for logging
   */
  toString(): string {
    return "********";
  }
}

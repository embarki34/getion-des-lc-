import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { UserRole } from "../value-objects/UserRole";
import { AccountStatus, canLogin } from "../value-objects/AccountStatus";
import {
  AccountLockedException,
  EmailNotVerifiedException,
  AccountDeactivatedException,
  ValidationException,
} from "../exceptions/DomainExceptions";

/**
 * User aggregate root
 * Encapsulates all business logic related to user identity
 */
export class User {
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION_MINUTES = 15;

  private constructor(
    private readonly id: UserId,
    private name: string,
    private readonly email: Email,
    private phone: string,
    private password: Password,
    private role: UserRole,
    private status: AccountStatus,
    private emailVerified: boolean,
    private emailVerifiedAt: Date | null,
    private failedLoginAttempts: number,
    private lockedUntil: Date | null,
    private lastLoginAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  /**
   * Creates a new user (factory method)
   */
  static create(
    name: string,
    email: Email,
    phone: string,
    password: Password,
    role: UserRole = UserRole.USER,
    status: AccountStatus = AccountStatus.PENDING
  ): User {
    this.validateName(name);

    return new User(
      UserId.generate(),
      name,
      email,
      phone,
      password,
      role,
      status,
      false,
      null,
      0,
      null,
      null,
      new Date(),
      new Date()
    );
  }

  /**
   * Reconstitutes a user from persistence (factory method)
   */
  static reconstitute(
    id: UserId,
    name: string,
    email: Email,
    phone: string,
    password: Password,
    role: UserRole,
    status: AccountStatus,
    emailVerified: boolean,
    emailVerifiedAt: Date | null,
    failedLoginAttempts: number,
    lockedUntil: Date | null,
    lastLoginAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(
      id,
      name,
      email,
      phone,
      password,
      role,
      status,
      emailVerified,
      emailVerifiedAt,
      failedLoginAttempts,
      lockedUntil,
      lastLoginAt,
      createdAt,
      updatedAt
    );
  }

  /**
   * Validates user name
   */
  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationException("Name cannot be empty");
    }

    if (name.trim().length < 2) {
      throw new ValidationException("Name must be at least 2 characters long");
    }

    if (name.trim().length > 100) {
      throw new ValidationException("Name must not exceed 100 characters");
    }
  }

  /**
   * Verifies if user can login
   * @throws AccountLockedException if account is locked
   * @throws EmailNotVerifiedException if email is not verified
   * @throws AccountDeactivatedException if account is deactivated
   */
  canLogin(): void {
    if (this.isLocked()) {
      throw new AccountLockedException(this.lockedUntil!);
    }

    if (!this.emailVerified) {
      throw new EmailNotVerifiedException();
    }

    if (!canLogin(this.status)) {
      throw new AccountDeactivatedException();
    }
  }

  /**
   * Records a successful login
   */
  recordSuccessfulLogin(): void {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Records a failed login attempt
   */
  recordFailedLoginAttempt(): void {
    this.failedLoginAttempts++;
    this.updatedAt = new Date();

    if (this.failedLoginAttempts >= User.MAX_FAILED_ATTEMPTS) {
      this.lockAccount();
    }
  }

  /**
   * Locks the account
   */
  private lockAccount(): void {
    const lockoutDuration = User.LOCKOUT_DURATION_MINUTES * 60 * 1000;
    this.lockedUntil = new Date(Date.now() + lockoutDuration);
    this.updatedAt = new Date();
  }

  /**
   * Checks if account is currently locked
   */
  isLocked(): boolean {
    if (!this.lockedUntil) {
      return false;
    }

    if (this.lockedUntil < new Date()) {
      // Lock has expired
      this.lockedUntil = null;
      this.failedLoginAttempts = 0;
      return false;
    }

    return true;
  }

  /**
   * Verifies the email address
   */
  verifyEmail(): void {
    if (this.emailVerified) {
      return; // Already verified
    }

    this.emailVerified = true;
    this.emailVerifiedAt = new Date();
    this.status = AccountStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  /**
   * Changes the password
   */
  changePassword(newPassword: Password): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  /**
   * Updates the user's name
   */
  updateName(newName: string): void {
    User.validateName(newName);
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  /**
   * Changes the user's role
   */
  changeRole(newRole: UserRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  /**
   * Suspends the account
   */
  suspend(): void {
    this.status = AccountStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  /**
   * Activates the account
   */
  activate(): void {
    if (!this.emailVerified) {
      throw new ValidationException(
        "Cannot activate account without email verification"
      );
    }
    this.status = AccountStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  /**
   * Soft deletes the account
   */
  delete(): void {
    this.status = AccountStatus.DELETED;
    this.updatedAt = new Date();
  }

  // Getters
  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): Password {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  getPhone(): string {
    return this.phone;
  }

  getStatus(): AccountStatus {
    return this.status;
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  getEmailVerifiedAt(): Date | null {
    return this.emailVerifiedAt;
  }

  getFailedLoginAttempts(): number {
    return this.failedLoginAttempts;
  }

  getLockedUntil(): Date | null {
    return this.lockedUntil;
  }

  getLastLoginAt(): Date | null {
    return this.lastLoginAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}

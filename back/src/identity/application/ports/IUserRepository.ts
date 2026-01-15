import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/value-objects/UserId';
import { Email } from '../../domain/value-objects/Email';

/**
 * Repository port for User aggregate
 * Defines the contract for user persistence
 */
export interface IUserRepository {
    /**
     * Saves a new user
     */
    save(user: User): Promise<void>;

    /**
     * Updates an existing user
     */
    update(user: User): Promise<void>;

    /**
     * Finds a user by ID
     */
    findById(id: UserId): Promise<User | null>;

    /**
     * Finds a user by email
     */
    findByEmail(email: Email): Promise<User | null>;

    /**
     * Checks if a user with the given email exists
     */
    existsByEmail(email: Email): Promise<boolean>;

    /**
     * Deletes a user (hard delete)
     */
    delete(id: UserId): Promise<void>;

    /**
     * Finds all users
     */
    findAll(): Promise<User[]>;

    /**
     * Finds users by Business Unit ID
     */
    findByBusinessUnitId(businessUnitId: string): Promise<User[]>;
}

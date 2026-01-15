import { Password } from "../value-objects/Password";

/**
 * Port for password hashing service
 * Infrastructure will implement this with bcrypt or other hashing algorithm
 */
export interface IPasswordHashingService {
  /**
   * Hashes a plain text password
   */
  hash(password: Password): Promise<Password>;

  /**
   * Compares a plain text password with a hashed password
   */
  compare(plainPassword: Password, hashedPassword: Password): Promise<boolean>;
}

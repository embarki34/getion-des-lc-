import bcrypt from "bcryptjs";
import { IPasswordHashingService } from "../../domain/services/IPasswordHashingService";
import { Password } from "../../domain/value-objects/Password";

/**
 * Bcrypt implementation of password hashing service
 */
export class BcryptPasswordHashingService implements IPasswordHashingService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  /**
   * Hashes a plain text password using bcrypt
   */
  async hash(password: Password): Promise<Password> {
    const plainValue = password.getValue();
    console.log("🔐 [HASH] Plain password:", plainValue);
    console.log("🔐 [HASH] Plain password length:", plainValue.length);

    const hashedValue = await bcrypt.hash(plainValue, this.saltRounds);
    console.log("🔐 [HASH] Hashed password:", hashedValue);
    console.log("🔐 [HASH] Hash length:", hashedValue.length);

    return Password.fromHash(hashedValue);
  }

  /**
   * Compares a plain text password with a hashed password
   */
  async compare(
    plainPassword: Password,
    hashedPassword: Password
  ): Promise<boolean> {
    const plainValue = plainPassword.getValue();
    const hashValue = hashedPassword.getValue();

    console.log("🔍 [COMPARE] Plain password:", plainValue);
    console.log("🔍 [COMPARE] Plain password length:", plainValue.length);
    console.log("🔍 [COMPARE] Stored hash:", hashValue);
    console.log("🔍 [COMPARE] Hash length:", hashValue.length);
    console.log(
      "🔍 [COMPARE] Hash starts with $2:",
      hashValue.startsWith("$2")
    );

    const result = await bcrypt.compare(plainValue, hashValue);
    console.log("🔍 [COMPARE] Result:", result);

    return result;
  }
}

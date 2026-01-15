import { User } from "../../../domain/entities/User";
import { UserId } from "../../../domain/value-objects/UserId";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { UserRole } from "../../../domain/value-objects/UserRole";
import { AccountStatus } from "../../../domain/value-objects/AccountStatus";

/**
 * Prisma user type (from database)
 */
export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  role: string;
  status: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps between domain User entity and Prisma user model
 */
export class UserMapper {
  /**
   * Converts domain User to Prisma user data
   */
  static toPrisma(user: User): Omit<PrismaUser, "createdAt" | "updatedAt"> {
    const data = {
      id: user.getId().getValue(),
      name: user.getName(),
      phone: user.getPhone(),
      email: user.getEmail().getValue(),
      password: user.getPassword().getValue(),
      role: user.getRole(),
      status: user.getStatus(),
      emailVerified: user.isEmailVerified(),
      emailVerifiedAt: user.getEmailVerifiedAt(),
      failedLoginAttempts: user.getFailedLoginAttempts(),
      lockedUntil: user.getLockedUntil(),
      lastLoginAt: user.getLastLoginAt(),
    };

    console.log("💾 [MAPPER] Saving to DB - Password:", data.password);
    console.log(
      "💾 [MAPPER] Saving to DB - Password length:",
      data.password.length
    );

    return data;
  }

  /**
   * Converts Prisma user to domain User entity
   */
  static toDomain(prismaUser: PrismaUser): User {
    return User.reconstitute(
      UserId.fromString(prismaUser.id),
      prismaUser.name,
      Email.create(prismaUser.email),
      prismaUser.phone || "",
      Password.fromHash(prismaUser.password),
      prismaUser.role as UserRole,
      prismaUser.status as AccountStatus,
      prismaUser.emailVerified,
      prismaUser.emailVerifiedAt,
      prismaUser.failedLoginAttempts,
      prismaUser.lockedUntil,
      prismaUser.lastLoginAt,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }
}

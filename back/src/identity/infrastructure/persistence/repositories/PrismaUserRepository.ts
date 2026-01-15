import { PrismaClient } from "../prisma/client";
import { IUserRepository } from "../../../application/ports/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserId } from "../../../domain/value-objects/UserId";
import { Email } from "../../../domain/value-objects/Email";
import { PrismaUser, UserMapper } from "../mappers/UserMapper";

/**
 * Prisma implementation of User repository
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  /**
   * Saves a new user
   */
  async save(user: User): Promise<void> {
    const data = UserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: {
        ...data,
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    });
  }

  /**
   * Updates an existing user
   */
  async update(user: User): Promise<void> {
    const data = UserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: { id: user.getId().getValue() },
      data: {
        ...data,
        updatedAt: user.getUpdatedAt(),
      },
    });
  }

  /**
   * Finds a user by ID
   */
  async findById(id: UserId): Promise<User | null> {
    const prismaUser: PrismaUser | null = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
    }) as unknown as PrismaUser | null;

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Finds a user by email
   */
  async findByEmail(email: Email): Promise<User | null> {
    // @ts-ignore
    const prismaUser: PrismaUser | null = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    }) as unknown as PrismaUser | null;

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Checks if a user with the given email exists
   */
  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }

  /**
   * Deletes a user (hard delete)
   */
  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.getValue() },
    });
  }

  /**
   * Finds all users
   */
  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany() as unknown as PrismaUser[];
    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }

  /**
   * Finds users by Business Unit ID
   */
  async findByBusinessUnitId(businessUnitId: string): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: { businessUnitId },
    }) as unknown as PrismaUser[];

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }
}

import { prisma } from '../../prisma';
import { User } from '@prisma/client';

// User data without password for safe returns
export type SafeUser = Omit<User, 'password'>;

/**
 * Repository for authentication-related database operations
 */
class AuthRepository {
  /**
   * Create a new user
   */
  async createUser(email: string, hashedPassword: string): Promise<SafeUser> {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      // Handle unique constraint violation
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by email (including password for authentication)
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${(error as Error).message}`);
    }
  }

  /**
   * Find user by ID (including password for authentication)
   */
  async findUserById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${(error as Error).message}`);
    }
  }

  /**
   * Find safe user by ID (without password)
   */
  async findSafeUserById(id: number): Promise<SafeUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to find safe user by ID: ${(error as Error).message}`);
    }
  }

  /**
   * Update user password
   */
  async updateUserPassword(id: number, hashedPassword: string): Promise<SafeUser> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to update user password: ${(error as Error).message}`);
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const count = await prisma.user.count({
        where: { email },
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check email existence: ${(error as Error).message}`);
    }
  }
}

// Export singleton instance
export default new AuthRepository();
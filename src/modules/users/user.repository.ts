import { prisma } from '../../prisma';
import { User } from '@prisma/client';

// User data without password for safe returns
export type SafeUser = Omit<User, 'password'>;

// Pagination options
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Paginated result
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Repository for user-related database operations
 */
class UserRepository {
  /**
   * Create a new user
   */
  async createUser(data: { email: string; password: string }): Promise<SafeUser> {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Find user by ID (without password)
   */
  async findUserById(id: number): Promise<SafeUser | null> {
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
    } catch (error: any) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  /**
   * Find user by email (without password)
   */
  async findUserByEmail(email: string): Promise<SafeUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error: any) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(
    options: PaginationOptions,
    filters?: { email?: string }
  ): Promise<PaginatedResult<SafeUser>> {
    try {
      const { page, limit } = options;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (filters?.email) {
        where.email = {
          contains: filters.email,
          mode: 'insensitive',
        };
      }

      // Get total count
      const total = await prisma.user.count({ where });

      // Get paginated data
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return {
        data: users,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrevious,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }

  /**
   * Update user
   */
  async updateUser(
    id: number,
    data: Partial<{ email: string; password: string }>
  ): Promise<SafeUser> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...data,
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<SafeUser> {
    try {
      const user = await prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Check if user exists
   */
  async userExists(id: number): Promise<boolean> {
    try {
      const count = await prisma.user.count({
        where: { id },
      });

      return count > 0;
    } catch (error: any) {
      throw new Error(`Failed to check user existence: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new UserRepository();
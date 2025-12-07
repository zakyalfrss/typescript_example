import { hashPassword } from '../../utils/password';
import userRepository, { 
  SafeUser, 
  PaginationOptions, 
  PaginatedResult 
} from './user.repository';
import { AppError } from '../../middlewares/error.middleware';

// User creation data
export interface CreateUserData {
  email: string;
  password: string;
}

// User update data
export interface UpdateUserData {
  email?: string;
  password?: string;
}

/**
 * Service for user business logic
 */
class UserService {
  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<SafeUser> {
    try {
      // Validate email format (basic validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
      }

      // Validate password strength
      if (data.password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400, 'WEAK_PASSWORD');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await userRepository.createUser({
        email: data.email,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error && error.message === 'Email already exists') {
        throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
      }
      throw new AppError('Failed to create user', 500, 'USER_CREATION_FAILED');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<SafeUser> {
    try {
      const user = await userRepository.findUserById(id);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get user', 500, 'GET_USER_FAILED');
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
      // Validate pagination options
      if (options.page < 1) {
        throw new AppError('Page must be greater than 0', 400, 'INVALID_PAGE');
      }
      if (options.limit < 1 || options.limit > 100) {
        throw new AppError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT');
      }

      const result = await userRepository.getAllUsers(options, filters);

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get users', 500, 'GET_USERS_FAILED');
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, data: UpdateUserData): Promise<SafeUser> {
    try {
      // Check if user exists
      const userExists = await userRepository.userExists(id);
      if (!userExists) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Prepare update data
      const updateData: UpdateUserData = {};

      if (data.email !== undefined) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
        }
        updateData.email = data.email;
      }

      if (data.password !== undefined) {
        // Validate password strength
        if (data.password.length < 8) {
          throw new AppError('Password must be at least 8 characters', 400, 'WEAK_PASSWORD');
        }
        // Hash new password
        updateData.password = await hashPassword(data.password);
      }

      // Update user
      const user = await userRepository.updateUser(id, updateData);

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error && error.message === 'Email already exists') {
        throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
      }
      throw new AppError('Failed to update user', 500, 'USER_UPDATE_FAILED');
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<SafeUser> {
    try {
      // Check if user exists
      const userExists = await userRepository.userExists(id);
      if (!userExists) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Delete user
      const user = await userRepository.deleteUser(id);

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error && error.message === 'User not found') {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      throw new AppError('Failed to delete user', 500, 'USER_DELETION_FAILED');
    }
  }
}

// Export singleton instance
export default new UserService();
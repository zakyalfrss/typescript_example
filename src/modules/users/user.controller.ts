import { Request, Response, NextFunction } from 'express';
import userService from './user.service';
import { success, paginatedSuccess, validationError } from '../../utils/response';
import { AppError } from '../../middlewares/error.middleware';

// Validation schemas
import { z } from 'zod';

// Create user schema
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Update user schema
const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

// Pagination schema
const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  email: z.string().optional(),
});

/**
 * Controller for user routes
 */
class UserController {
  /**
   * Create a new user
   */
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validationResult = createUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errors: Record<string, string[]> = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) errors[path] = [];
          errors[path].push(err.message);
        });
        validationError(res, errors);
        return;
      }

      const data = validationResult.data;

      // Create user
      const user = await userService.createUser(data);

      // Send response
      success(res, { user }, 'User created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid user ID', 400, 'INVALID_ID');
      }

      const user = await userService.getUserById(id);

      success(res, { user }, 'User retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate query parameters
      const validationResult = paginationSchema.safeParse(req.query);
      if (!validationResult.success) {
        const errors: Record<string, string[]> = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) errors[path] = [];
          errors[path].push(err.message);
        });
        validationError(res, errors);
        return;
      }

      const { page, limit, email } = validationResult.data;

      // Get users
      const result = await userService.getAllUsers(
        { page, limit },
        email ? { email } : undefined
      );

      // Send paginated response
      paginatedSuccess(
        res,
        result.data,
        {
          page: result.meta.page,
          limit: result.meta.limit,
          total: result.meta.total,
          totalPages: result.meta.totalPages,
        },
        'Users retrieved successfully'
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update user
   */
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid user ID', 400, 'INVALID_ID');
      }

      // Validate request body
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errors: Record<string, string[]> = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) errors[path] = [];
          errors[path].push(err.message);
        });
        validationError(res, errors);
        return;
      }

      const data = validationResult.data;

      // Check if there's data to update
      if (Object.keys(data).length === 0) {
        throw new AppError('No data provided for update', 400, 'NO_UPDATE_DATA');
      }

      // Update user
      const user = await userService.updateUser(id, data);

      success(res, { user }, 'User updated successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid user ID', 400, 'INVALID_ID');
      }

      const user = await userService.deleteUser(id);

      success(res, { user }, 'User deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

// Export singleton instance
export default new UserController();
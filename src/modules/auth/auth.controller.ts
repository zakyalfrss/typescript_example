import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  tokenSchema 
} from './auth.schema';
import { success, error, validationError } from '../../utils/response';
import { AppError } from '../../middlewares/error.middleware';

/**
 * Controller for authentication routes
 */
class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validationResult = registerSchema.safeParse(req.body);
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

      // Register user
      const result = await authService.register(data);

      // Send response
      success(res, {
        user: result.user,
        token: result.token,
      }, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validationResult = loginSchema.safeParse(req.body);
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

      // Login user
      const result = await authService.login(data);

      // Send response
      success(res, {
        user: result.user,
        token: result.token,
      }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'UNAUTHENTICATED');
      }

      const user = await authService.getCurrentUser(req.user.userId);

      success(res, { user }, 'Profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change password
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 'UNAUTHENTICATED');
      }

      // Validate request body
      const validationResult = changePasswordSchema.safeParse(req.body);
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

      // Change password
      const user = await authService.changePassword(req.user.userId, data);

      success(res, { user }, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validationResult = forgotPasswordSchema.safeParse(req.body);
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

      // Process forgot password request
      await authService.forgotPassword(data);

      // Always return success to prevent email enumeration
      success(res, null, 'If the email exists, a reset link has been sent');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate token
      const tokenValidation = tokenSchema.safeParse(req.params);
      if (!tokenValidation.success) {
        throw new AppError('Invalid token', 400, 'INVALID_TOKEN');
      }

      // Validate request body
      const validationResult = resetPasswordSchema.safeParse(req.body);
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

      const data = {
        ...validationResult.data,
        token: tokenValidation.data.token,
      };

      // Reset password
      await authService.resetPassword(data);

      success(res, null, 'Password reset successful');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logout (client-side operation, but can invalidate tokens if needed)
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real application with token invalidation:
      // 1. Add token to blacklist
      // 2. Or use refresh tokens and revoke them
      
      success(res, null, 'Logout successful');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify token (for checking if token is still valid)
   */
  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
      }

      const user = await authService.getCurrentUser(req.user.userId);

      success(res, { 
        valid: true, 
        user,
        expiresIn: '24h' // This should come from token payload or config
      }, 'Token is valid');
    } catch (err) {
      next(err);
    }
  }
}

// Export singleton instance
export default new AuthController();
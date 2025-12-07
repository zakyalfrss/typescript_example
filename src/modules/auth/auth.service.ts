import { User } from '@prisma/client';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken } from '../../utils/token';
import { UserPayload } from '../../utils/auth';
import authRepository, { SafeUser } from './auth.repository';
import { 
  RegisterInput, 
  LoginInput, 
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput 
} from './auth.schema';
import { AppError } from '../../middlewares/error.middleware';

/**
 * Service for authentication business logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<{ user: SafeUser; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await authRepository.findUserByEmail(data.email);
      if (existingUser) {
        throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await authRepository.createUser(data.email, hashedPassword);

      // Generate token
      const token = this.generateUserToken(user);

      return { user, token };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Registration failed', 500, 'REGISTRATION_FAILED');
    }
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<{ user: SafeUser; token: string }> {
    try {
      // Find user by email
      const user = await authRepository.findUserByEmail(data.email);
      if (!user) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Verify password
      const isPasswordValid = await comparePassword(data.password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Convert to safe user (without password)
      const safeUser: SafeUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Generate token
      const token = this.generateUserToken(safeUser);

      return { user: safeUser, token };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 500, 'LOGIN_FAILED');
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: number, 
    data: ChangePasswordInput
  ): Promise<SafeUser> {
    try {
      // Get user with password
      const user = await authRepository.findUserById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(
        data.currentPassword, 
        user.password
      );
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 401, 'INVALID_CURRENT_PASSWORD');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(data.newPassword);

      // Update password
      const updatedUser = await authRepository.updateUserPassword(userId, hashedNewPassword);

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Password change failed', 500, 'PASSWORD_CHANGE_FAILED');
    }
  }

  /**
   * Forgot password (placeholder for email sending logic)
   */
  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    try {
      // Check if user exists
      const userExists = await authRepository.emailExists(data.email);
      if (!userExists) {
        // Don't reveal if user exists for security
        return;
      }

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Store it in the database with expiration
      // 3. Send reset email with link containing token
      
      console.log(`Reset password requested for: ${data.email}`);
      // Implement email sending logic here
    } catch (error) {
      // Don't throw error to prevent email enumeration
      console.error('Forgot password error:', error);
    }
  }

  /**
   * Reset password (placeholder)
   */
  async resetPassword(data: ResetPasswordInput & { token: string }): Promise<void> {
    try {
      // In a real application, you would:
      // 1. Verify the reset token
      // 2. Check if it's not expired
      // 3. Find user by token
      // 4. Update password
      
      console.log(`Password reset requested with token: ${data.token}`);
      throw new AppError('Reset password not implemented', 501, 'NOT_IMPLEMENTED');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Password reset failed', 500, 'PASSWORD_RESET_FAILED');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: number): Promise<SafeUser> {
    try {
      const user = await authRepository.findSafeUserById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get user profile', 500, 'GET_PROFILE_FAILED');
    }
  }

  /**
   * Generate JWT token for user
   */
  private generateUserToken(user: SafeUser): string {
    const payload: UserPayload = {
      userId: user.id,
      email: user.email,
    };

    return generateAccessToken(payload);
  }
}

// Export singleton instance
export default new AuthService();
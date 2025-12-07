import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/token';
import { AppError } from './error.middleware';
import { UserPayload } from '../utils/auth';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user payload to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      throw new AppError('Authorization header is missing', 401, 'MISSING_TOKEN');
    }

    // Extract and verify token
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      throw new AppError('Invalid authorization header format', 401, 'INVALID_AUTH_HEADER');
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user payload to request
    req.user = decoded as UserPayload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
    }
  }
};

/**
 * Optional authentication middleware
 * Tries to authenticate but doesn't fail if token is missing/invalid
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        const decoded = verifyAccessToken(token);
        req.user = decoded as UserPayload;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.debug('Optional auth failed:', (error as Error).message);
  }

  next();
};

/**
 * Role-based authorization middleware
 * @param allowedRoles - Array of allowed roles (to be implemented when role system is added)
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    // For now, we don't have roles in our User model
    // This is a placeholder for future role-based authorization
    // if (!allowedRoles.includes(req.user.role)) {
    //   throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
    // }

    next();
  };
};
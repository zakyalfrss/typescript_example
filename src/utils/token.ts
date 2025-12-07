import jwt from 'jsonwebtoken';
import envConfig from '../config/env';
import { UserPayload } from './auth';

// Token configuration
const JWT_SECRET = envConfig.JWT_SECRET;
const JWT_EXPIRES_IN = envConfig.JWT_EXPIRES_IN;

/**
 * Generate access token
 * @param payload - User payload to encode in token
 * @returns string - Generated JWT token
 */
export const generateAccessToken = (payload: UserPayload): string => {
  try {
    // Type assertion untuk menghindari type error
    const token = jwt.sign(
      payload as object, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN as any }
    );
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${(error as Error).message}`);
  }
};

/**
 * Verify access token
 * @param token - JWT token to verify
 * @returns UserPayload - Decoded user payload
 * @throws Error - If token is invalid or expired
 */
export const verifyAccessToken = (token: string): UserPayload => {
  try {
    // Remove 'Bearer ' prefix if present
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decoded = jwt.verify(actualToken, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error(`Token verification failed: ${(error as Error).message}`);
    }
  }
};

/**
 * Extract token from request headers
 * @param authHeader - Authorization header string
 * @returns string | null - Token if found, null otherwise
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
};
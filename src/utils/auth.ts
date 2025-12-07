import { Request } from 'express';

// Define user payload interface for JWT
export interface UserPayload {
  userId: number;
  email: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Helper to check if user is authenticated
export const isAuthenticated = (req: Request): boolean => {
  return !!req.user;
};

// Helper to get current user (throws if not authenticated)
export const getCurrentUser = (req: Request): UserPayload => {
  if (!req.user) {
    throw new Error('User is not authenticated');
  }
  return req.user;
};
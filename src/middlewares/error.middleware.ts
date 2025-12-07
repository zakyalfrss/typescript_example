import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response';

// Custom error class - HAPUS export keyword dari class declaration
class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code: string | undefined;
  let isOperational = false;

  // Check if it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors
    statusCode = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
    isOperational = true;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid or expired token';
    code = 'INVALID_TOKEN';
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
    code = 'TOKEN_EXPIRED';
    isOperational = true;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    // Handle Prisma errors
    statusCode = 400;
    message = 'Database operation failed';
    code = 'DATABASE_ERROR';
    isOperational = true;
  }

  // Log the error for debugging (only in development or for non-operational errors)
  if (process.env.NODE_ENV === 'development' || !isOperational) {
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Send error response
  error(res, message, statusCode, code);
};

export default errorMiddleware;
export { AppError }; // Export di sini saja
import { Response } from 'express';

// Standard response interface
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Send success response
 * @param res - Express response object
 * @param data - Data to send in response
 * @param message - Optional success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const success = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Send paginated success response
 * @param res - Express response object
 * @param data - Array of data items
 * @param meta - Pagination metadata
 * @param message - Optional success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const paginatedSuccess = <T>(
  res: Response,
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages,
    },
  };

  if (message) {
    response.message = message;
  }

  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param res - Express response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param code - Optional error code for clients
 */
export const error = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (code) {
    response.code = code;
  }

  res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param res - Express response object
 * @param errors - Validation errors
 * @param message - Optional custom message
 */
export const validationError = (
  res: Response,
  errors: Record<string, string[]>,
  message: string = 'Validation failed'
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    data: { errors },
  };

  res.status(400).json(response);
};
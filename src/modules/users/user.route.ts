import { Router } from 'express';
import userController from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';

// Import validation schemas
import { z } from 'zod';

// Define validation schemas
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID'),
  }),
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  }),
});

const getUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID'),
  }),
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID'),
  }),
});

const getUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).default('1'),
    limit: z.string().regex(/^\d+$/).default('10'),
    email: z.string().optional(),
  }),
});

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Private (Admin only in future)
 */
router.get('/', authMiddleware, validateRequest(getUsersSchema), userController.getAllUsers);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private (Admin only in future)
 */
router.post('/', authMiddleware, validateRequest(createUserSchema), userController.createUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, validateRequest(getUserSchema), userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Own user or Admin)
 */
router.put('/:id', authMiddleware, validateRequest(updateUserSchema), userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only in future)
 */
router.delete('/:id', authMiddleware, validateRequest(deleteUserSchema), userController.deleteUser);

export default router;
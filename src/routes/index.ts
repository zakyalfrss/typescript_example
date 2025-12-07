import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import userController from '../modules/users/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Authentication routes
 */
router.use('/auth', authRoutes);

/**
 * User routes (protected)
 */
router.get('/users', authMiddleware, userController.getAllUsers);
router.post('/users', authMiddleware, userController.createUser);
router.get('/users/:id', authMiddleware, userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

export default router;
import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/:id', authenticate, userController.getUserById);
router.get('/', authenticate, requireRole('ADMIN'), userController.getAllUsers);
router.patch('/:id/block', authenticate, userController.blockUser);

export default router;

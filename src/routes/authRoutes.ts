import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateRegister, validateLogin } from '../validators/authValidator';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;

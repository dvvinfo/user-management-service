import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from './errorHandler';
import { AuthRequest, UserPayload } from '../types';

const authService = new AuthService();

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token) as UserPayload;

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Access denied'));
    }

    next();
  };
};

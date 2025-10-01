import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, _res: Response, next: NextFunction) => {
  const { fullName, birthDate, email, password } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return next(new AppError(400, 'Full name is required and must be at least 2 characters'));
  }

  if (!birthDate) {
    return next(new AppError(400, 'Birth date is required'));
  }

  const date = new Date(birthDate);
  if (isNaN(date.getTime())) {
    return next(new AppError(400, 'Invalid birth date format'));
  }

  if (!email || !emailRegex.test(email)) {
    return next(new AppError(400, 'Valid email is required'));
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(new AppError(400, 'Password is required and must be at least 6 characters'));
  }

  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    return next(new AppError(400, 'Valid email is required'));
  }

  if (!password || typeof password !== 'string') {
    return next(new AppError(400, 'Password is required'));
  }

  next();
};

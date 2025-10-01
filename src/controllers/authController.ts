import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

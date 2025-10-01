import { Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/errorHandler';

const userService = new UserService();

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user!;

  if (!userService.canAccessUser(currentUser.id, currentUser.role, id)) {
    throw new AppError(403, 'You do not have permission to access this user');
  }

  const user = await userService.getUserById(id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

export const blockUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user!;

  if (!userService.canAccessUser(currentUser.id, currentUser.role, id)) {
    throw new AppError(403, 'You do not have permission to block this user');
  }

  const user = await userService.blockUser(id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

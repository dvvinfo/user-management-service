import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { Role } from '@prisma/client';

export class UserService {
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        birthDate: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        birthDate: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async blockUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!user.isActive) {
      throw new AppError(400, 'User is already blocked');
    }

    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
      },
    });
  }

  canAccessUser(requestUserId: string, requestUserRole: Role, targetUserId: string): boolean {
    return requestUserRole === Role.ADMIN || requestUserId === targetUserId;
  }
}

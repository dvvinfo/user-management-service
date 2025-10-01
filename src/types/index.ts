import { Request } from 'express';
import { Role } from '@prisma/client';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface RegisterDto {
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
  };
}

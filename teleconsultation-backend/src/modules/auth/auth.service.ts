import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';

@Injectable()
export class AuthService {
  private mockUsers: User[] = [
    {
      id: 'mock-admin-1',
      username: 'admin',
      password: '$2a$10$q3DV6.2qPxL5P0H1RCa6kOGOxbbAnaTKAC2w3e1QzJs3sqn7C0ogG',
      email: 'admin@example.com',
      phoneNumber: '13800138000',
      role: UserRole.ADMIN,
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'mock-patient-1',
      username: 'patient1',
      password: '$2a$10$q3DV6.2qPxL5P0H1RCa6kOGOxbbAnaTKAC2w3e1QzJs3sqn7C0ogG',
      email: 'patient1@example.com',
      phoneNumber: '13800138001',
      role: UserRole.PATIENT,
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'mock-doctor-1',
      username: 'doctor1',
      password: '$2a$10$q3DV6.2qPxL5P0H1RCa6kOGOxbbAnaTKAC2w3e1QzJs3sqn7C0ogG',
      email: 'doctor1@example.com',
      phoneNumber: '13900139001',
      role: UserRole.DOCTOR,
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, password, email, phoneNumber, role } = registerDto;

    const existingUser = this.mockUsers.find(u => u.username === username);
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await hashPassword(password);

    const user: User = {
      id: `user-${Date.now()}`,
      username,
      password: hashedPassword,
      email: email || null,
      phoneNumber: phoneNumber || null,
      role: role || UserRole.PATIENT,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockUsers.push(user);

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = this.mockUsers.find(u => u.username === username);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const secret = this.configService.get('jwt.secret');
    const expiresIn = this.configService.get('jwt.expiresIn');

    const token = generateToken(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      secret,
      expiresIn,
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    const user = this.mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}

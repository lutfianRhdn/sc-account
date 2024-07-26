import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';
import { User } from '../user/interfaces/user.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterRequest) {
    const user = await this.userService.findByEmail(input.email);
    if (user) {
      throw new HttpException('User already exists', 409);
    }

    if (input.password !== input.confirmPassword) {
      throw new HttpException('Passwords do not match', 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.userService.create({
      email: input.email,
      name: input.name,
      password: hashedPassword,
    });
  }

  async validateUser({ email, password }: LoginRequest) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new HttpException('Invalid email or password', 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const token = await this.generateToken(user);
    await this.updateRefreshToken(token.refreshToken, user._id);

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async logout(userId: string) {
    if (!userId) throw new HttpException('User not found', 404);
    await this.updateRefreshToken(null, userId);
  }

  async updateRefreshToken(refreshToken: string, userId: string) {
    return this.userService.updateRefreshToken(refreshToken, userId);
  }

  async generateToken(user: User) {
    console.log(user);
    const payload = { email: user.email, name: user.name, _id: user._id };
    const token = {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
    return token;
  }
}

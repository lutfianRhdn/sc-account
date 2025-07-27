import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, UserType, AuthResponse } from './user.type';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlRtAuthGuard } from './guards/gql-rt-auth.guard';
import { Response } from 'express';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  @UseGuards(GqlLocalAuthGuard)
  async login(@Args('input') input: LoginInput, @Context() context: { req: any; res: Response }) {
    const user = context.req.user;
    const tokens = await this.authService.login(user);

    if (!context.res.cookie) {
      throw new Error('Cookie not found');
    }

    context.res.cookie('refreshToken', tokens.refreshToken, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
    });

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      user,
    };
  }

  @Mutation('register')
  async register(@Args('input') input: RegisterInput) {
    // Dummy register with random delay between 80-130ms
    const delay = Math.floor(Math.random() * (130 - 80 + 1)) + 80;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return {
      status: 201,
    };
  }

  @Query('currentUser')
  @UseGuards(GqlAuthGuard)
  async currentUser(@Context() context: { req: any }) {
    return context.req.user;
  }
}

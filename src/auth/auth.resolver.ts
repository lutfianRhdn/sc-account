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
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: { req: any; res: Response },
  ) {
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
  async register(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('confirmPassword') confirmPassword: string,
  ) {
    await this.authService.register({ email, name, password, confirmPassword });
    return {
      message: 'User created successfully',
    };
  }

  @Mutation(() => AuthResponse)
  @UseGuards(GqlRtAuthGuard)
  async generateToken(@Context() context: { req: any }) {
    const user = context.req.user;
    const tokens = await this.authService.generateToken(user);

    return {
      message: 'Token generated successfully',
      accessToken: tokens.accessToken,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlRtAuthGuard)
  async logout(@Context() context: { req: any }) {
    const { sub } = context.req.user;
    await this.authService.logout(sub);
    return true;
  }

  @Query('currentUser')
  @UseGuards(GqlAuthGuard)
  async currentUser(@Context() context: { req: any }) {
    return context.req.user;
  }
}

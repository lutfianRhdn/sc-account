import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['./**/*.graphql'],
      playground: true,
      introspection: true,
      context: ({ req, res }) => {
        const authHeader = req.headers.authorization;

        if (authHeader) {
          return {
            req,
            token: authHeader.replace('Bearer ', ''),
          };
        }

        return { req, res };
      },
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error;
      },
    }),
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

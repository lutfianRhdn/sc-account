import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

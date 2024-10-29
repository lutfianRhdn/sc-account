import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://application:CodeLabs011013@socialabs-database.global.mongocluster.cosmos.azure.com/account?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000',
    ),
  ],
})
export class DatabaseModule {}

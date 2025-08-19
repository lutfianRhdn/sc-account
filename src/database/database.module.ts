import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://application:skripsi@socialabs.pjkgs8t.mongodb.net/account')],
})
export class DatabaseModule {}

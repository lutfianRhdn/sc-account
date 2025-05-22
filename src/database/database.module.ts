import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://application:K3p042412@cluster0.tn3np.mongodb.net/account')],
})
export class DatabaseModule {}

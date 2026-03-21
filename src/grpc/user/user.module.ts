import { Module } from '@nestjs/common';
import { PasswordModule } from './password/password.module';
import { UserGrpcController } from './user.controller';

@Module({
  imports: [PasswordModule],
  controllers: [UserGrpcController],
})
export class UserModule {}

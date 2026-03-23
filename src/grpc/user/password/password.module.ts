import { Global, Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from 'src/grpc/user/password/entity/password.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}

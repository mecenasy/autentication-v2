import { Module } from '@nestjs/common';
import { PasskeyController } from './passkey.controller';
import { PasskeyService } from './passkey.service';
import { PassKey } from 'src/grpc/auth/passkey/entity/passkey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PassKey])],
  controllers: [PasskeyController],
  providers: [PasskeyService],
})
export class PasskeyModule {}

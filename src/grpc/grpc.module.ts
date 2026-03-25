import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassKey } from 'src/grpc/auth/passkey/entity/passkey.entity';
import { ProjectAuth } from 'src/common/postgres/entity/project-auth.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SocialConfigModule } from './social-config/social-config.module';
import { PasskeyModule } from './auth/passkey/passkey.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassKey, ProjectAuth]),
    UserModule,
    AuthModule,
    SocialConfigModule,
    PasskeyModule,
  ],
  exports: [TypeOrmModule],
})
export class GrpcModule {}

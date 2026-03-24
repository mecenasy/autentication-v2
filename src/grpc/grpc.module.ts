import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from 'src/grpc/user/history/entity/history.entity';
import { PassKey } from 'src/common/postgres/entity/passkey.entity';
import { ProjectAuth } from 'src/common/postgres/entity/project-auth.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SocialConfigModule } from './social-config/social-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([History, PassKey, ProjectAuth]),
    UserModule,
    AuthModule,
    SocialConfigModule,
  ],
  exports: [TypeOrmModule],
})
export class GrpcModule {}

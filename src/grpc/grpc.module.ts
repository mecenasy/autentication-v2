import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from 'src/common/postgres/entity/history.entity';
import { PassKey } from 'src/common/postgres/entity/passkey.entity';
import { ProjectAuth } from 'src/common/postgres/entity/project-auth.entity';
import { UserSettings } from 'src/common/postgres/entity/user-settings.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([History, PassKey, ProjectAuth, UserSettings]),
    UserModule,
    AuthModule,
  ],
  exports: [TypeOrmModule],
})
export class GrpcModule {}

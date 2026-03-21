import { Module } from '@nestjs/common';
import { UserGrpcController } from './user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/postgres/entity/user.entity';
import { Password } from 'src/common/postgres/entity/password.entity';
import { History } from 'src/common/postgres/entity/history.entity';
import { SocialAccounts } from 'src/common/postgres/entity/social-accounts.entity';
import { PassKey } from 'src/common/postgres/entity/passkey.entity';
import { ProjectAuth } from 'src/common/postgres/entity/project-auth.entity';
import { UserSettings } from 'src/common/postgres/entity/user-settings.entity';
import { SocialConfig } from 'src/common/postgres/entity/social-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Password,
      History,
      SocialAccounts,
      PassKey,
      ProjectAuth,
      UserSettings,
      SocialConfig,
    ]),
  ],
  controllers: [UserGrpcController],
})
export class GrpcModule {}

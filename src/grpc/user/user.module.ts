import { Global, Module } from '@nestjs/common';
import { PasswordModule } from './password/password.module';
import { UserGrpcController } from './user.controller';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserGrpcService } from './user.service';
import { HistoryModule } from './history/history.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PasswordModule,
    UserSettingsModule,
    SocialAccountsModule,
    HistoryModule,
  ],
  controllers: [UserGrpcController],
  providers: [UserGrpcService],
  exports: [UserGrpcService],
})
export class UserModule {}

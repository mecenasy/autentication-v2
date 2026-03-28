import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SocialConfigModule } from './social-config/social-config.module';
import { PasskeyModule } from './auth/passkey/passkey.module';

@Module({
  imports: [UserModule, AuthModule, SocialConfigModule, PasskeyModule],
})
export class GrpcModule {}

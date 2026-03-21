import { Module } from '@nestjs/common';
import { MfaModule } from './mfa/mfa.module';
import { LoginModule } from './login/login.module';
import { OtpModule } from './otp/otp.module';
import { TfaModule } from './tfa/tfa.module';

@Module({
  imports: [MfaModule, OtpModule, TfaModule, LoginModule],
})
export class AuthModule {}

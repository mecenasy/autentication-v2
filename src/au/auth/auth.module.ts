import { Module } from '@nestjs/common';
import { MfaModule } from './mfa/mfa.module';
import { LoginModule } from './login/login.module';
import { OtpModule } from './otp/otp.module';
import { TfaModule } from './tfa/tfa.module';
import { StrategyModule } from './strategy/strategy.module';
import { PasskeyModule } from './passkey/passkey.module';

@Module({
  imports: [
    MfaModule,
    OtpModule,
    TfaModule,
    LoginModule,
    StrategyModule,
    PasskeyModule,
  ],
})
export class AuthModule {}

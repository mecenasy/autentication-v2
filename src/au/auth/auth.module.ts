import { Module } from '@nestjs/common';
import { MfaModule } from './mfa/mfa.module';
import { LoginModule } from './login/login.module';
import { OtpModule } from './otp/otp.module';
import { TfaModule } from './tfa/tfa.module';
import { StrategyModule } from './strategy/strategy.module';
import { PasskeyModule } from './passkey/passkey.module';
import { QrCodeModule } from './gr-code/qr-code.module';
import { FederationModule } from './federation/federation.module';

@Module({
  imports: [
    MfaModule,
    OtpModule,
    TfaModule,
    LoginModule,
    StrategyModule,
    PasskeyModule,
    QrCodeModule,
    FederationModule,
  ],
})
export class AuthModule {}

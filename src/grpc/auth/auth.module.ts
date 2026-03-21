import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { MfaModule } from './mfa/mfa.module';

@Module({
  imports: [LoginModule, MfaModule],
})
export class AuthModule {}

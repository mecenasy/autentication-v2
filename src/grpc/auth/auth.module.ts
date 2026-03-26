import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { FederationModule } from './federation/federation.module';

@Module({
  imports: [LoginModule, FederationModule],
})
export class AuthModule {}

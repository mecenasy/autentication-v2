import { Module } from '@nestjs/common';
import { federationCommands } from './commands/handler';

import { FederationAuthCommandResolver } from './federation-auth-command-resolver';
import { RiskModule } from '../../risk/risk.module';

@Module({
  imports: [RiskModule],
  providers: [...federationCommands, FederationAuthCommandResolver],
})
export class AuthModule {}

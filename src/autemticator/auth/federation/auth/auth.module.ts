import { Module } from '@nestjs/common';
import { federationCommands } from './commands/handler';
import { CqrsModule } from '@nestjs/cqrs';
import { FederationAuthCommandResolver } from './federation-auth-command-resolver';
import { RiskModule } from '../../risk/risk.module';
import { TypeConfigService } from 'src/configs/types.config.service';

@Module({
  imports: [CqrsModule, RiskModule],
  providers: [
    ...federationCommands,
    FederationAuthCommandResolver,
    TypeConfigService,
  ],
})
export class AuthModule {}

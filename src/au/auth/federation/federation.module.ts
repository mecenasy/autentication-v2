import { Module } from '@nestjs/common';
import { DiscoveryModule } from './discovery/discovery.module';
import { AuthModule } from './auth/auth.module';
import { federationHCommands } from './commands/handler';
import { federationQueries } from './queries/handler';
import { FederationQueryResolver } from './federation-query.resolver';
import { FederationCommandsResolver } from './federation-command.resolver';
import { TypeConfigService } from 'src/configs/types.config.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DiscoveryModule, AuthModule],
  providers: [
    ...federationQueries,
    ...federationHCommands,
    FederationQueryResolver,
    FederationCommandsResolver,
    TypeConfigService,
  ],
})
export class FederationModule {}

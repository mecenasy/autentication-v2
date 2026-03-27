import { Module } from '@nestjs/common';
import { DiscoveryModule } from './discovery/discovery.module';
import { AuthModule } from './auth/auth.module';
import { federationHCommands } from './commands/handler';
import { federationQueries } from './queries/handler';
import { FederationQueryResolver } from './federation-query.resolver';
import { FederationCommandsResolver } from './federation-command.resolver';

@Module({
  imports: [DiscoveryModule, AuthModule],
  providers: [
    ...federationQueries,
    ...federationHCommands,
    FederationQueryResolver,
    FederationCommandsResolver,
  ],
})
export class FederationModule {}

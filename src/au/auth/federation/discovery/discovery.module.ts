import { Module } from '@nestjs/common';
import { discoveryCommands } from './queries/handler';
import { DiscoveryFederationQueryResolver } from './discovery.resolver';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [...discoveryCommands, DiscoveryFederationQueryResolver],
})
export class DiscoveryModule {}

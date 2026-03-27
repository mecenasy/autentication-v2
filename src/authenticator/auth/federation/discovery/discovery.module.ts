import { Module } from '@nestjs/common';
import { discoveryCommands } from './queries/handler';
import { DiscoveryFederationQueryResolver } from './discovery.resolver';

@Module({
  providers: [...discoveryCommands, DiscoveryFederationQueryResolver],
})
export class DiscoveryModule {}

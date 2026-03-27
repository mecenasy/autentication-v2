import { Args, Query, Resolver } from '@nestjs/graphql';
import { DiscoveryFederationType } from './dto/discovery.type';
import { DiscoveryFederationQuery } from './queries/impl/discovery-feeration.query';
import { QueryBus } from '@nestjs/cqrs';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver('Discovery')
export class DiscoveryFederationQueryResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Public()
  @Query(() => DiscoveryFederationType)
  async discoveryFederation(@Args('clientId') clientId: string) {
    return this.queryBus.execute<
      DiscoveryFederationQuery,
      DiscoveryFederationType
    >(new DiscoveryFederationQuery(clientId));
  }
}

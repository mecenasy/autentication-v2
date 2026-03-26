import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { GetFederationType } from './dto/get-federation..type';
import { GetFederationQuery } from './queries/impl/get-federation.query';
import { GetAllFederationQuery } from './queries/impl/get-all-federation.query';
import { GetFederationDetailsType } from './dto/get-federation-details.type';

@Resolver('Federation')
export class FederationQueryResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => [GetFederationType])
  async federationGetAll(@CurrentUserId() userId: string) {
    return this.queryBus.execute<GetAllFederationQuery, GetFederationType>(
      new GetAllFederationQuery(userId),
    );
  }

  @Query(() => GetFederationDetailsType)
  async federationGet(
    @CurrentUserId() userId: string,
    @Args('clientId') clientId: string,
  ) {
    return this.queryBus.execute<GetFederationQuery, GetFederationDetailsType>(
      new GetFederationQuery(clientId, userId),
    );
  }
}

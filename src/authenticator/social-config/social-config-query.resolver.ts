import { Query } from '@nestjs/graphql';
import { Args, Resolver } from '@nestjs/graphql';
import { GetAllSocialConfigsQuery } from './queries/impl/find-all-social-configs.query';
import { SocialConfigsType } from './dto/social-configs.type';
import { QueryBus } from '@nestjs/cqrs';
import { SocialConfigType } from './dto/social-config.type';
import { GetSocialConfigByIdQuery } from './queries/impl/find-social-config-by-provider.query';

@Resolver('Social-config')
export class SocialConfigQueryResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => SocialConfigsType)
  async getAllConfig() {
    return this.queryBus.execute<GetAllSocialConfigsQuery, SocialConfigsType>(
      new GetAllSocialConfigsQuery(),
    );
  }

  @Query(() => SocialConfigType)
  async getConfig(@Args('id') token: string) {
    return this.queryBus.execute<GetSocialConfigByIdQuery, SocialConfigType>(
      new GetSocialConfigByIdQuery(token),
    );
  }
}

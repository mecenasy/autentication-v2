import { Resolver, Query, Args } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { StatusAuthQuery } from './queries/impl/status-auth.query';
import { LoginStatusType } from './dto/login-status.tape';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { VerifyTokenType } from './dto/verify-token.type';
import { VerifyTokenQuery } from './queries/impl/verify-token.query';

@Resolver('Login')
export class LoginQueriesResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Public()
  @Query(() => LoginStatusType)
  async loginStatus(@CurrentUserId() userId: string) {
    return this.queryBus.execute<StatusAuthQuery, LoginStatusType>(
      new StatusAuthQuery(userId),
    );
  }

  @Public()
  @Query(() => VerifyTokenType)
  async verifyToken(@Args('token') token: string) {
    return this.queryBus.execute<VerifyTokenQuery, VerifyTokenType>(
      new VerifyTokenQuery(token),
    );
  }
}

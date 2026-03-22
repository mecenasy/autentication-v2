import { Resolver, Query } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { StatusAuthQuery } from './queries/impl/status-auth.query';
import { LoginStatusType } from './dto/login-status.tape';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Resolver('Login')
export class LoginQueriesResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => LoginStatusType)
  async loginStatus(@CurrentUserId() userId: string) {
    return this.queryBus.execute<StatusAuthQuery, LoginStatusType>(
      new StatusAuthQuery(userId),
    );
  }
}

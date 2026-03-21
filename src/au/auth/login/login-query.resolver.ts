import { Resolver, Context, Query } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { StatusAuthCommand } from './queries/impl/status-auth.command';
import { LoginStatusType } from './dto/login-status.tape';
import express from 'express';

@Resolver('Login')
export class LoginQueriesResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Query(() => LoginStatusType)
  async loginStatus(@Context() ctx: express.Response) {
    return this.commandBus.execute<StatusAuthCommand, LoginStatusType>(
      new StatusAuthCommand(ctx.req.session.user_id ?? ''),
    );
  }
}

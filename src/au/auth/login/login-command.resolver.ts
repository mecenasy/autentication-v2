import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { LoginType } from './dto/login-type';
import { LoginCommand } from './commands/impl/login.command';
import { StatusType } from './dto/status.type';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { LogoutCommand } from './commands/impl/logout.command';
import { Context } from '@nestjs/graphql';
import express from 'express';
@Resolver('Login')
export class LoginCommandsResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => StatusType)
  async loginUser(@Args('input') input: LoginType) {
    return this.commandBus.execute<LoginCommand, StatusType>(
      new LoginCommand(input.email, input.password),
    );
  }

  @Mutation(() => StatusType)
  async logoutUser(
    @CurrentUserId() userId: string,
    @Context() ctx: express.Response,
  ) {
    return this.commandBus.execute<LogoutCommand, StatusType>(
      new LogoutCommand(userId, ctx.req.session),
    );
  }
}

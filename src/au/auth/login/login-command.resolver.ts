import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { LoginType } from './dto/login-type';
import { LoginCommand } from './commands/impl/login.command';
import { StatusType } from './dto/status.type';

@Resolver('Login')
export class LoginCommandsResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => StatusType)
  async loginUser(@Args('input') input: LoginType) {
    return this.commandBus.execute<LoginCommand, StatusType>(
      new LoginCommand(input.email, input.password),
    );
  }
}

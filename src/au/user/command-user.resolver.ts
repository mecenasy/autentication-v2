import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { CreateUserType } from './dto/create-user.type.';
import { UserType } from './dto/user.type.';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver('User')
export class CommandUsersResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserType) {
    return this.commandBus.execute<CreateUserCommand, UserType>(
      new CreateUserCommand(input),
    );
  }
}

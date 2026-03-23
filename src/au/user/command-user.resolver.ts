import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { CreateUserType } from './dto/create-user.type.';
import { UserType } from './dto/user.type.';
import { CreateSocialUserType } from './dto/create-social-user.type';
import { CreateSocialUserCommand } from './commands/impl/create-social-user.command';
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
  @Public()
  @Mutation(() => UserType)
  async createSocialUser(@Args('input') input: CreateSocialUserType) {
    const result = await this.commandBus.execute<
      CreateSocialUserCommand,
      CreateSocialUserType
    >(new CreateSocialUserCommand(input));

    return result;
  }
}

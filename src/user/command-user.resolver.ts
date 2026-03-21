import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { CreateUserType } from './dto/create-user.type.';
import { UserType } from './dto/user.type.';
import { CreateSocialUserType } from './dto/create-social-user.type';
import { CreateSocialUserCommand } from './commands/impl/create-social-user.command';

@Resolver('User')
export class CommandUsersResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserType) {
    return this.commandBus.execute<CreateUserCommand, UserType>(
      new CreateUserCommand(input),
    );
  }

  @Mutation(() => UserType)
  async updateUser(@Args('input') input: CreateUserType) {
    return this.commandBus.execute<CreateUserCommand, UserType>(
      new CreateUserCommand(input),
    );
  }

  @Mutation(() => CreateSocialUserType)
  async deleteUser(@Args('input') input: CreateSocialUserType) {
    const result = await this.commandBus.execute<
      CreateSocialUserCommand,
      CreateSocialUserType
    >(new CreateSocialUserCommand(input));

    return result;
  }
}

import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RemovePasskeyCommand } from './commands/impl/remove-passkey.command';
import { RemovePasskeyType } from './dto/remove.passkey';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Resolver('Passkey')
export class PasskeyCommandsResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => RemovePasskeyType)
  async removePasskey(@Args('id') id: string, @CurrentUserId() userId: string) {
    return this.commandBus.execute<RemovePasskeyCommand, { status: boolean }>(
      new RemovePasskeyCommand(id, userId),
    );
  }
}

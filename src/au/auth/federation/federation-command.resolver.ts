import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateFederationType } from './dto/create-federation.type';
import { CreateFederationCommand } from './commands/impl/create-federation.command';
import { CratedFederationInputType } from './dto/create-federation-input.type';
import { GenerateSecretFederationCommand } from './commands/impl/generate-secret.federation.command';
import { RemoveFederationCommand } from './commands/impl/remove-federation.command';
import { ToggleFederationCommand } from './commands/impl/toggle-federation.command';
import { UpdateFederationCommand } from './commands/impl/update-federation.command';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { GenerateSecretType } from './dto/generate-secret.type';
import { RemoveFederationType } from './dto/remove.federation.type';
import { ToggleFederationType } from './dto/toggle-federation.type';

@Resolver('Federation')
export class FederationCommandsResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => CreateFederationType)
  async federationCreate(
    @CurrentUserId() userId: string,
    @Args('input') { clientUrl, name }: CratedFederationInputType,
  ) {
    return this.commandBus.execute<
      CreateFederationCommand,
      CreateFederationType
    >(new CreateFederationCommand(userId, name, clientUrl));
  }
  @Mutation(() => GenerateSecretType)
  async generateSecret(
    @CurrentUserId() userId: string,
    @Args('clientId') clientId: string,
  ) {
    return this.commandBus.execute<
      GenerateSecretFederationCommand,
      CreateFederationType
    >(new GenerateSecretFederationCommand(clientId, userId));
  }
  @Mutation(() => RemoveFederationType)
  async federationRemove(
    @CurrentUserId() userId: string,
    @Args('clientId') clientId: string,
  ) {
    return this.commandBus.execute<
      RemoveFederationCommand,
      CreateFederationType
    >(new RemoveFederationCommand(clientId, userId));
  }
  @Mutation(() => ToggleFederationType)
  async federationToggle(
    @CurrentUserId() userId: string,
    @Args('clientId') clientId: string,
  ) {
    return this.commandBus.execute<
      ToggleFederationCommand,
      CreateFederationType
    >(new ToggleFederationCommand(clientId, userId));
  }
  @Mutation(() => CreateFederationType)
  async federationUpdate(
    @CurrentUserId() userId: string,
    @Args('clientId') clientId: string,
    @Args('input') { clientUrl, name, active }: CratedFederationInputType,
  ) {
    return this.commandBus.execute<
      UpdateFederationCommand,
      CreateFederationType
    >(new UpdateFederationCommand(name, clientUrl, clientId, userId, active));
  }
}

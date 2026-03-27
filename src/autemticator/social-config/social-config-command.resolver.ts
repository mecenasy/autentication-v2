import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SocialConfigType } from './dto/social-config.type';
import { DeleteSocialConfigType } from './dto/delete-social-config.type';
import { ActiveSocialConfigType } from './dto/active-social-config.type';
import { CreateSocialConfigCommand } from './commands/impl/create-social-config.command';
import { UpdateSocialConfigCommand } from './commands/impl/update-social-config.command';
import { DeleteSocialConfigCommand } from './commands/impl/delete-social-config.command';
import { ToggleActiveSocialConfigCommand } from './commands/impl/toggle-active-social-config.command';
import { UpdateSocialConfigDto } from './dto/update-social-config.dto';
import { CreateSocialConfigDto } from './dto/create-social-config.dto';

@Resolver('Social-config')
export class SocialConfigCommandResolver {
  constructor(private readonly commandBus: CommandBus) {}
  @Mutation(() => SocialConfigType)
  async createSocialConfig(@Args('input') input: CreateSocialConfigDto) {
    return this.commandBus.execute<CreateSocialConfigCommand, SocialConfigType>(
      new CreateSocialConfigCommand(input),
    );
  }
  @Mutation(() => SocialConfigType)
  async updateSocialConfig(
    @Args('id') id: string,
    @Args('config') config: UpdateSocialConfigDto,
  ) {
    return this.commandBus.execute<UpdateSocialConfigCommand, SocialConfigType>(
      new UpdateSocialConfigCommand(id, config),
    );
  }
  @Mutation(() => DeleteSocialConfigType)
  async deleteSocialConfig(@Args('id') id: string) {
    return this.commandBus.execute<
      DeleteSocialConfigCommand,
      DeleteSocialConfigType
    >(new DeleteSocialConfigCommand(id));
  }
  @Mutation(() => ActiveSocialConfigType)
  async activeSocialConfig(@Args('id') id: string) {
    return this.commandBus.execute<
      ToggleActiveSocialConfigCommand,
      ActiveSocialConfigType
    >(new ToggleActiveSocialConfigCommand(id));
  }
}

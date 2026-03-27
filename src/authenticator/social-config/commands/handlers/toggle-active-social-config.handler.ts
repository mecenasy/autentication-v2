import { CommandHandler } from '@nestjs/cqrs';
import { ToggleActiveSocialConfigCommand } from '../impl/toggle-active-social-config.command';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
} from 'src/proto/social-config';
import { Handler } from 'src/common/handler/handler';
import { ActiveSocialConfigType } from '../../dto/active-social-config.type';
import { lastValueFrom } from 'rxjs';

@CommandHandler(ToggleActiveSocialConfigCommand)
export class ToggleActiveSocialConfigHandler extends Handler<
  ToggleActiveSocialConfigCommand,
  ActiveSocialConfigType,
  SocialConfigProxyServiceClient
> {
  constructor() {
    super(SOCIAL_CONFIG_PROXY_SERVICE_NAME);
  }

  async execute(
    command: ToggleActiveSocialConfigCommand,
  ): Promise<ActiveSocialConfigType> {
    const { id } = command;
    const result = await lastValueFrom(
      this.gRpcService.activeSocialConfig({ id }),
    );
    return result;
  }
}

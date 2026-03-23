import { CommandHandler } from '@nestjs/cqrs';
import { UpdateSocialConfigCommand } from '../impl/update-social-config.command';
import { Handler } from 'src/common/handler/handler';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
} from 'src/proto/social-config';
import { SocialConfigType } from '../../dto/social-config.type';
import { lastValueFrom } from 'rxjs';
import { mapProvider } from 'src/libs/utils/provider-enum-mapper';

@CommandHandler(UpdateSocialConfigCommand)
export class UpdateSocialConfigHandler extends Handler<
  UpdateSocialConfigCommand,
  SocialConfigType,
  SocialConfigProxyServiceClient
> {
  constructor() {
    super(SOCIAL_CONFIG_PROXY_SERVICE_NAME);
  }

  async execute(command: UpdateSocialConfigCommand): Promise<SocialConfigType> {
    const { id, socialConfig } = command;

    const result = await lastValueFrom(
      this.gRpcService.updateSocialConfig({ id, ...socialConfig }),
    );
    this.logger.log(result);
    return { ...result, provider: mapProvider(result.provider) };
  }
}

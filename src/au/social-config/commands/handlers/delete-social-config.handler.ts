import { CommandHandler } from '@nestjs/cqrs';
import { DeleteSocialConfigCommand } from '../impl/delete-social-config.command';
import { Handler } from 'src/common/handler/handler';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
} from 'src/proto/social-config';
import { lastValueFrom } from 'rxjs';
import { DeleteSocialConfigType } from '../../dto/delete-social-config.type';

@CommandHandler(DeleteSocialConfigCommand)
export class DeleteSocialConfigHandler extends Handler<
  DeleteSocialConfigCommand,
  DeleteSocialConfigType,
  SocialConfigProxyServiceClient
> {
  constructor() {
    super(SOCIAL_CONFIG_PROXY_SERVICE_NAME);
  }

  async execute(
    command: DeleteSocialConfigCommand,
  ): Promise<DeleteSocialConfigType> {
    const { id } = command;

    const result = await lastValueFrom(
      this.gRpcService.deleteSocialConfig({ id }),
    );

    return { id: result.id };
  }
}

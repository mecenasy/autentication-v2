import { CommandHandler } from '@nestjs/cqrs';
import { CreateSocialConfigCommand } from '../impl/create-social-config.command';
import { Handler } from 'src/common/handler/handler';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
} from 'src/proto/social-config';
import { lastValueFrom } from 'rxjs';
import { SocialConfigType } from '../../dto/social-config.type';
import { mapProvider } from 'src/libs/utils/provider-enum-mapper';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';

@CommandHandler(CreateSocialConfigCommand)
export class CreateSocialConfigHandler extends Handler<
  CreateSocialConfigCommand,
  SocialConfigType,
  SocialConfigProxyServiceClient
> {
  constructor(private readonly configService: TypeConfigService) {
    super(SOCIAL_CONFIG_PROXY_SERVICE_NAME);
  }

  async execute(command: CreateSocialConfigCommand): Promise<SocialConfigType> {
    const { socialConfig } = command;

    const callbackUrl = `${this.configService.get<AppConfig>('app')?.appUrl}/auth/${socialConfig.provider.toLowerCase()}/verify`;

    const result = await lastValueFrom(
      this.gRpcService.createSocialConfig({ ...socialConfig, callbackUrl }),
    );
    this.logger.log(result);
    return { ...result, provider: mapProvider(result.provider) };
  }
}

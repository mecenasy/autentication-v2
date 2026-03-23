import { QueryHandler } from '@nestjs/cqrs';
import { GetSocialConfigByIdQuery } from '../impl/find-social-config-by-provider.query';
import { Handler } from 'src/common/handler/handler';
import { SocialConfigType } from '../../dto/social-config.type';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
} from 'src/proto/social-config';
import { lastValueFrom } from 'rxjs';
import { mapProvider } from 'src/libs/utils/provider-enum-mapper';

@QueryHandler(GetSocialConfigByIdQuery)
export class FindSocialConfigByProviderHandler extends Handler<
  GetSocialConfigByIdQuery,
  SocialConfigType,
  SocialConfigProxyServiceClient
> {
  constructor() {
    super(SOCIAL_CONFIG_PROXY_SERVICE_NAME);
  }

  async execute({ id }: GetSocialConfigByIdQuery): Promise<SocialConfigType> {
    const result = await lastValueFrom(
      this.gRpcService.getSocialConfig({ id }),
    );
    this.logger.log(result);
    return { ...result, provider: mapProvider(result.provider) };
  }
}

import { QueryHandler } from '@nestjs/cqrs';
import { GetAllSocialConfigsQuery } from '../impl/find-all-social-configs.query';
import { Handler } from 'src/common/handler/handler';
import { SocialConfigsType } from '../../dto/social-configs.type';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
} from 'src/proto/social-config';
import { lastValueFrom } from 'rxjs';
import { mapProvider } from 'src/libs/utils/provider-enum-mapper';

@QueryHandler(GetAllSocialConfigsQuery)
export class FindAllSocialConfigsHandler extends Handler<
  GetAllSocialConfigsQuery,
  SocialConfigsType,
  SocialConfigProxyServiceClient
> {
  constructor() {
    super(SOCIAL_CONFIG_PROXY_SERVICE_NAME);
  }

  async execute(): Promise<SocialConfigsType> {
    const result = await lastValueFrom(
      this.gRpcService.findAllSocialConfigs({}),
    );
    this.logger.log(result);
    const configs = (result.socialConfigs || []).map((config) => ({
      ...config,
      provider: mapProvider(config.provider),
    }));
    return { configs };
  }
}

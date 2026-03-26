import { QueryHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { GetFederationQuery } from '../impl/get-federation.query';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { GetFederationDetailsType } from '../../dto/get-federation-details.type';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';
import { FederationCache } from '../../type/feeration-cache';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(GetFederationQuery)
export class GetFederationHandler extends Handler<
  GetFederationQuery,
  GetFederationDetailsType,
  FederationProxyServiceClient
> {
  constructor(private readonly configService: TypeConfigService) {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({ clientId, userId }: GetFederationQuery) {
    const cache = await this.cache.getFromCache<FederationCache>({
      identifier: userId,
      prefix: 'federation',
    });

    if (cache) {
      const federation = cache[clientId];
      if (federation) {
        const urls = this.createUrl(federation.clientId);

        return { ...urls, ...federation };
      }
    }

    const result = await lastValueFrom(
      this.gRpcService.get({ userId, clientId }),
    );

    if (result) {
      const urls = this.createUrl(result.clientId);
      await this.cache.saveInCache<FederationCache>({
        identifier: userId,
        prefix: 'federation',
        data: {
          ...cache,
          [result.clientId]: result,
        },
        EX: 3600,
      });

      return { ...urls, ...result };
    }

    throw new BadRequestException('Something went wrong');
  }

  createUrl(clientId: string) {
    const config = this.configService.getOrThrow<AppConfig>('app');
    return {
      verifyUrl: `${config.appUrl}/provider-auth/verify-code`,
      loginUrl: `${config.clientUrl}/login/${clientId}?nonce={$}`,
    };
  }
}

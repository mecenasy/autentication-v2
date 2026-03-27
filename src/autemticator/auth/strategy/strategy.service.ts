import { Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CacheService } from 'src/common/cache/cache.service';
import { GrpcProxyKey } from 'src/common/proxy/constance';
import { Provider } from 'src/libs/utils/provider';
import {
  SOCIAL_CONFIG_PROXY_SERVICE_NAME,
  SocialConfigProxyServiceClient,
  SocialConfigResponse,
} from 'src/proto/social-config';

export class StrategyService implements OnModuleInit {
  private gRpcService: SocialConfigProxyServiceClient;
  constructor(
    @Inject(GrpcProxyKey)
    private readonly grpcClient: ClientGrpc,
    private readonly cacheClient: CacheService,
  ) {}

  onModuleInit() {
    this.gRpcService =
      this.grpcClient.getService<SocialConfigProxyServiceClient>(
        SOCIAL_CONFIG_PROXY_SERVICE_NAME,
      );
  }
  public async getStrategy(provider: Provider) {
    const param = {
      identifier: provider,
      prefix: 'strategy',
    };

    let strategy =
      await this.cacheClient.getFromCache<SocialConfigResponse>(param);

    if (strategy) {
      return strategy;
    }

    strategy = await lastValueFrom(
      this.gRpcService.getSocialConfig({ id: provider }),
    );

    await this.cacheClient.saveInCache<SocialConfigResponse>({
      ...param,
      data: strategy,
      EX: 3600,
    });

    return strategy;
  }
}

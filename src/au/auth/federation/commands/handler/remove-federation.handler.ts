import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { RemoveFederationCommand } from '../impl/remove-federation.command';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { RemoveFederationType } from '../../dto/remove.federation.type';
import { lastValueFrom } from 'rxjs';
import { FederationCache } from '../../type/feeration-cache';

@CommandHandler(RemoveFederationCommand)
export class RemoveFederationHandler extends Handler<
  RemoveFederationCommand,
  RemoveFederationType,
  FederationProxyServiceClient
> {
  constructor() {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({ clientId, userId }: RemoveFederationCommand) {
    const result = await lastValueFrom(
      this.gRpcService.remove({
        clientId,
        userId,
      }),
    );

    if (result?.status) {
      const cache = await this.cache.getFromCache<FederationCache>({
        identifier: userId,
        prefix: 'federation',
      });

      if (cache) {
        delete cache[clientId];

        await this.cache.saveInCache<FederationCache>({
          identifier: userId,
          prefix: 'federation',
          data: cache,
          EX: 3600,
        });
      }
    }
    return { clientId };
  }
}

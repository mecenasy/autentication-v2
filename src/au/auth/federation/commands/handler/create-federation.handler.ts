import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { CreateFederationCommand } from '../impl/create-federation.command';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { CreateFederationType } from '../../dto/create-federation.type';
import { lastValueFrom } from 'rxjs';
import { FederationCache } from '../../type/feeration-cache';

@CommandHandler(CreateFederationCommand)
export class CreateFederationHandler extends Handler<
  CreateFederationCommand,
  CreateFederationType,
  FederationProxyServiceClient
> {
  constructor() {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({ clientUrl, name, userId }: CreateFederationCommand) {
    const result = await lastValueFrom(
      this.gRpcService.create({
        clientUrl,
        name,
        userId,
      }),
    );

    const cache =
      (await this.cache.getFromCache<FederationCache>({
        identifier: userId,
        prefix: 'federation',
      })) ?? {};

    if (result) {
      cache[result.clientId] = result;

      await this.cache.saveInCache<FederationCache>({
        identifier: userId,
        prefix: 'federation',
        data: cache,
        EX: 3600,
      });
    }

    this.logger.log(result);
    return result;
  }
}

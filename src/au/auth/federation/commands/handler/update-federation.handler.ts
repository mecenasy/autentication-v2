import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { UpdateFederationCommand } from '../impl/update-federation.command';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { CreateFederationType } from '../../dto/create-federation.type';
import { lastValueFrom } from 'rxjs';
import { FederationCache } from '../../type/feeration-cache';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateFederationCommand)
export class UpdateFederationHandler extends Handler<
  UpdateFederationCommand,
  CreateFederationType,
  FederationProxyServiceClient
> {
  constructor() {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({
    clientUrl,
    clientId,
    name,
    userId,
    active,
  }: UpdateFederationCommand) {
    const result = await lastValueFrom(
      this.gRpcService.update({
        clientId,
        userId,
        clientUrl,
        name,
        isActivated: active,
      }),
    );

    if (result) {
      const cache = await this.cache.getFromCache<FederationCache>({
        identifier: userId,
        prefix: 'federation',
      });

      if (cache) {
        cache[clientId] = {
          ...cache[clientId],
          clientUrl,
          name,
          isActivated: active,
        };

        await this.cache.saveInCache<FederationCache>({
          identifier: userId,
          prefix: 'federation',
          data: cache,
          EX: 3600,
        });
        return { ...cache[clientId], clientId };
      }
    }

    throw new BadRequestException('Something went wrong');
  }
}

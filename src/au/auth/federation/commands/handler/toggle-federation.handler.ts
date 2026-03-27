import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { ToggleFederationCommand } from '../impl/toggle-federation.command';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { ToggleFederationType } from '../../dto/toggle-federation.type';
import { lastValueFrom } from 'rxjs';
import { FederationCache } from '../../type/feeration-cache';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ToggleFederationCommand)
export class ToggleFederationHandler extends Handler<
  ToggleFederationCommand,
  ToggleFederationType,
  FederationProxyServiceClient
> {
  constructor() {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({ clientId, userId }: ToggleFederationCommand) {
    try {
      const result = await lastValueFrom(
        this.gRpcService.toggle({
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
          cache[clientId].isActivated = !cache[clientId].isActivated;

          await this.cache.saveInCache<FederationCache>({
            identifier: userId,
            prefix: 'federation',
            data: cache,
            EX: 3600,
          });
          return { active: cache[clientId].isActivated, clientId };
        }
      }
      throw new BadRequestException('Something went wrong');
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Something went wrong');
    }
  }
}

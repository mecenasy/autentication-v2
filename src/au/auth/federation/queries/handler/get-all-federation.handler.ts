import { QueryHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { GetAllFederationQuery } from '../impl/get-all-federation.query';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { GetFederationType } from '../../dto/get-federation..type';
import { FederationCache } from '../../type/feeration-cache';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(GetAllFederationQuery)
export class GetAllFederationHandler extends Handler<
  GetAllFederationQuery,
  GetFederationType[],
  FederationProxyServiceClient
> {
  constructor() {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({ userId }: GetAllFederationQuery) {
    const cache = await this.cache.getFromCache<FederationCache>({
      identifier: userId,
      prefix: 'federation',
    });

    if (cache) {
      return Object.values(cache).map((federation) => ({
        name: federation.name,
        clientId: federation.clientId,
      }));
    }
    const result = await lastValueFrom(this.gRpcService.getAll({ userId }));

    if (result) {
      return result.federations ?? [];
    }

    throw new BadRequestException('Something went wrong');
  }
}

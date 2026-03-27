import { Handler } from 'src/common/handler/handler';
import { DiscoveryFederationQuery } from '../impl/discovery-feeration.query';
import { OtpService } from 'src/au/auth/otp/otp.service';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { DiscoveryFederationType } from '../../dto/discovery.type';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { LoginProcessCache } from '../../../type/login-process';
import { DiscoveryCache } from '../../../type/discovery-cache';

@QueryHandler(DiscoveryFederationQuery)
export class DiscoveryFederationHandler extends Handler<
  DiscoveryFederationQuery,
  DiscoveryFederationType,
  FederationProxyServiceClient
> {
  constructor(private readonly otpService: OtpService) {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }
  async execute({
    clientId,
  }: DiscoveryFederationQuery): Promise<DiscoveryFederationType> {
    const cache = await this.cache.getFromCache<DiscoveryCache>({
      identifier: clientId,
      prefix: 'client-federation',
    });

    const token = this.otpService.generateToken();

    if (cache?.clientUrl) {
      await this.cache.saveInCache<LoginProcessCache>({
        identifier: token,
        prefix: 'login-process',
        data: { type: 'login start' },
        EX: 1600,
      });

      return { token, clientUrl: cache.clientUrl };
    }

    const result = await lastValueFrom(
      this.gRpcService.getClient({ clientId }),
    );

    if (!result.clientUrl) {
      throw new BadRequestException('Client url not found');
    }

    this.logger.log(result);

    await this.cache.saveInCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
      data: { type: 'login start' },
      EX: 1600,
    });

    await this.cache.saveInCache<DiscoveryCache>({
      identifier: clientId,
      prefix: 'client-federation',
      data: result,
      EX: 3660,
    });

    return { token, clientUrl: result.clientUrl };
  }
}

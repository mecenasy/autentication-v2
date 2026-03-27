import { Handler } from 'src/common/handler/handler';
import { OtpService } from 'src/autemticator/auth/otp/otp.service';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshTokenFederationCommand } from '../impl/refresh-token.command';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { FederationTokenType } from '../../dto/federation-token.type';
import { RefreshTokenPayload } from '../../../type/refresh-token-cache';

@CommandHandler(RefreshTokenFederationCommand)
export class RefreshTokenFederationHandler extends Handler<
  RefreshTokenFederationCommand,
  FederationTokenType,
  FederationProxyServiceClient
> {
  constructor(private readonly otpService: OtpService) {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }
  async execute({
    token,
    secret,
    clientId,
  }: RefreshTokenFederationCommand): Promise<FederationTokenType> {
    const payload = await this.cache.getFromCache<RefreshTokenPayload>({
      identifier: token,
      prefix: 'refresh-token',
    });

    if (!payload) {
      throw new BadRequestException('Login process not found');
    }

    const client = await lastValueFrom(
      this.gRpcService.getClient({ clientId }),
    );

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    const hash = bcrypt.hashSync(secret, client.salt);

    if (hash !== client.hash) {
      throw new BadRequestException('Invalid Client Configuration');
    }

    const jwtToken = await this.otpService.generateJWT(payload);

    const refreshToken = uuid();

    await this.cache.saveInCache<RefreshTokenPayload>({
      identifier: refreshToken,
      prefix: 'refresh-token',
      data: payload,
      EX: 604800,
    });

    await this.cache.removeFromCache({
      identifier: token,
      prefix: 'login-process',
    });

    return {
      ...jwtToken,
      accessTokenExpiredIn: 3600,
      email: payload.email ?? '',
      refreshToken,
      refreshTokenExpiredIn: 604800,
    };
  }
}

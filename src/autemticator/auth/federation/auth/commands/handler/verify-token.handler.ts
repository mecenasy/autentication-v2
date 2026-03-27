import { Handler } from 'src/common/handler/handler';
import { OtpService } from 'src/autemticator/auth/otp/otp.service';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { FederationTokenType } from '../../dto/federation-token.type';
import { VerifyTokenFederationCommand } from '../impl/verify-token.command';
import { LoginProcessCache } from '../../../type/login-process';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { RefreshTokenPayload } from '../../../type/refresh-token-cache';

@CommandHandler(VerifyTokenFederationCommand)
export class VerifyTokenFederationHandler extends Handler<
  VerifyTokenFederationCommand,
  FederationTokenType,
  FederationProxyServiceClient
> {
  constructor(private readonly otpService: OtpService) {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }
  async execute({
    clientId,
    secret,
    token,
  }: VerifyTokenFederationCommand): Promise<FederationTokenType> {
    const loginProcess = await this.cache.getFromCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
    });

    if (loginProcess?.type !== 'login success') {
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

    const payload = {
      sub: loginProcess.userId ?? '',
      email: loginProcess.email ?? '',
    };
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
      email: loginProcess.email ?? '',
      refreshToken,
      refreshTokenExpiredIn: 604800,
    };
  }
}

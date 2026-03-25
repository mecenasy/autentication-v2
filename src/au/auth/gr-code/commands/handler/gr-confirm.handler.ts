import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { QrConfirmCommand } from '../impl/gr-confirm.command';
import { QrCache } from './types/types';
import { BadRequestException } from '@nestjs/common';
import { verification } from 'src/au/auth/passkey/helpers/verification';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';
import {
  PASSKEY_PROXY_SERVICE_NAME,
  PasskeyProxyServiceClient,
} from 'src/proto/passkey';
import { lastValueFrom } from 'rxjs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { Getaway } from 'src/common/getaway/getaway.getaway';

@CommandHandler(QrConfirmCommand)
export class QrConfirmHandler extends Handler<
  QrConfirmCommand,
  StatusType,
  PasskeyProxyServiceClient
> {
  constructor(
    private readonly gateway: Getaway,
    private readonly configService: TypeConfigService,
  ) {
    super(PASSKEY_PROXY_SERVICE_NAME);
  }

  async execute({ challenge, response }: QrConfirmCommand) {
    if (!challenge) {
      throw new BadRequestException('Challenge is required');
    }

    const result = await this.cache.getFromCache<QrCache>({
      identifier: challenge,
      prefix: 'qr-challenge',
    });

    if (result?.status !== 'optioned' || result.challenge !== challenge) {
      throw new BadRequestException('Wrong challenge');
    }

    const passkey = await lastValueFrom(
      this.gRpcService.getPasskey({ credentialID: response.id }),
    );

    if (!passkey.success) {
      return { status: AuthStatus.logout };
    }
    const clientUrl = this.configService.get<AppConfig>('app')?.clientUrl ?? '';

    const verify = await verification(
      response,
      clientUrl,
      result.optionChallenge ?? '',
      passkey,
    );

    await lastValueFrom(
      this.gRpcService.setCounter({
        credentialID: response.id,
        counter: verify.authenticationInfo.newCounter,
      }),
    );

    if (verify.verified) {
      this.sendAuthStatus('verified', result);
      await this.cache.saveInCache<QrCache>({
        identifier: challenge,
        prefix: 'qr-challenge',
        EX: 60,
        data: { ...result, userId: passkey.userId, status: 'verified' },
      });
    } else {
      this.sendAuthStatus('unVerified', result);
      await this.cache.removeFromCache({
        identifier: challenge,
        prefix: 'qr-challenge',
      });
    }
    return { status: AuthStatus.login };
  }

  private sendAuthStatus(
    status: 'rejected' | 'verified' | 'unVerified',
    qrAuth: QrCache,
  ) {
    this.gateway.server.to(qrAuth.challenge).emit('challenge', {
      status,
      type: 'QR-AUTH',
      nonce: qrAuth.nonce,
    });
  }
}

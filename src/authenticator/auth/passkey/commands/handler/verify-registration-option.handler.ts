import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { VerifyRegistrationOptionCommand } from '../impl/verify-registration-option.command';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';
import { lastValueFrom } from 'rxjs';
import {
  GetPasskeysResponse,
  PASSKEY_PROXY_SERVICE_NAME,
  PasskeyProxyServiceClient,
} from 'src/proto/passkey';
import { UAParser } from 'ua-parser-js';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';

@CommandHandler(VerifyRegistrationOptionCommand)
export class VerifyRegistrationOptionHandler extends Handler<
  VerifyRegistrationOptionCommand,
  StatusType,
  PasskeyProxyServiceClient
> {
  private clientUrl: string;
  constructor(private readonly configService: TypeConfigService) {
    super(PASSKEY_PROXY_SERVICE_NAME);
    this.clientUrl = this.configService.get<AppConfig>('app')?.clientUrl ?? '';
  }

  async execute({
    option,
    userId,
    ua,
  }: VerifyRegistrationOptionCommand): Promise<StatusType> {
    const challenge = await this.cache.getFromCache<string>({
      identifier: userId,
      prefix: 'passkey-option',
    });

    if (!challenge) {
      return { status: AuthStatus.logout };
    }

    const verification = await verifyRegistrationResponse({
      response: option,
      expectedChallenge: challenge,
      expectedOrigin: this.clientUrl,
      expectedRPID: this.clientUrl?.replace('https://', ''),
    });

    if (verification.verified) {
      const {
        registrationInfo: { credential },
      } = verification;

      await lastValueFrom(
        this.gRpcService.addPasskey({
          userId,
          credentialID: credential.id,
          publicKey: credential.publicKey,
          deviceName: this.getDeviceName(ua),
        }),
      );

      const passkeys = await lastValueFrom(
        this.gRpcService.getPasskeys({ userId }),
      );

      if (passkeys) {
        await this.cache.saveInCache<GetPasskeysResponse['passkeys']>({
          identifier: userId,
          prefix: 'passkeys',
          EX: 3600,
          data: passkeys.passkeys,
        });
      }

      return { status: AuthStatus.login };
    } else {
      return { status: AuthStatus.logout };
    }
  }
  private getDeviceName(ua: string) {
    const parser = new UAParser(ua);
    const res = parser.getResult();
    const device = res.device.model || res.os.name || 'Unknown Device';
    const browser = res.browser.name || '';

    return `${device} (${browser})`.trim();
  }
}

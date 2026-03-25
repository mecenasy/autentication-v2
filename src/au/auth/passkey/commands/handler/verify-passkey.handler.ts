/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { VerifyPasskeyCommand } from '../impl/verify-passkey.command.';
import { InternalServerErrorException } from '@nestjs/common';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import {
  PASSKEY_PROXY_SERVICE_NAME,
  PasskeyProxyServiceClient,
} from 'src/proto/passkey';
import { AppConfig } from 'src/configs/app.configs';
import { TypeConfigService } from 'src/configs/types.config.service';
import { lastValueFrom } from 'rxjs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from 'src/au/auth/login/dto/status.type';

@CommandHandler(VerifyPasskeyCommand)
export class VerifyPasskeyHandler extends Handler<
  VerifyPasskeyCommand,
  StatusType,
  PasskeyProxyServiceClient
> {
  private clientUrl: string;
  constructor(private readonly configService: TypeConfigService) {
    super(PASSKEY_PROXY_SERVICE_NAME);
    this.clientUrl = this.configService.get<AppConfig>('app')?.clientUrl ?? '';
  }

  async execute({ session, response }: VerifyPasskeyCommand) {
    const challenge = session.currentChallenge;

    if (!challenge) {
      return { status: AuthStatus.logout };
    }

    const passkey = await lastValueFrom(
      this.gRpcService.getPasskey({ credentialID: response.id }),
    );

    if (!passkey.success) {
      return { status: AuthStatus.logout };
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: this.clientUrl,
      expectedRPID: this.clientUrl.replace('https://', ''),
      credential: {
        id: passkey.credentialID ?? '',
        publicKey: new Uint8Array(passkey.publicKey ?? []),
        counter: passkey.counter ?? 0,
      },
    });

    if (verification.verified) {
      session.user_id = passkey.userId;
      session.currentChallenge = undefined;

      await new Promise<void>((resolve, reject) => {
        session.save((err) => {
          if (err) {
            reject(new InternalServerErrorException('Failed to save session.'));
            this.logger.error(err);
          } else {
            resolve();
          }
        });
      });
      this.gRpcService.setCounter({
        credentialID: response.id,
        counter: verification.authenticationInfo.newCounter,
      });

      return { status: AuthStatus.login };
    } else {
      return { status: AuthStatus.logout };
    }
  }
}

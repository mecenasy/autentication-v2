import { Handler } from 'src/common/handler/handler';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { VerifyPasskeyFederationCommand } from '../impl/verify-passkey.command';
import { LoginProcessCache } from '../../../type/login-process';
import {
  PASSKEY_PROXY_SERVICE_NAME,
  PasskeyProxyServiceClient,
} from 'src/proto/passkey';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { verification } from 'src/au/auth/passkey/helpers/verification';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';
import { saveSession } from 'src/au/auth/helpers/save-session';

@CommandHandler(VerifyPasskeyFederationCommand)
export class VerifyPasskeyFederationHandler extends Handler<
  VerifyPasskeyFederationCommand,
  StatusType,
  PasskeyProxyServiceClient
> {
  private clientUrl: string;

  constructor(private readonly configService: TypeConfigService) {
    super(PASSKEY_PROXY_SERVICE_NAME);
    this.clientUrl = this.configService.get<AppConfig>('app')?.clientUrl ?? '';
  }
  async execute({
    token,
    response,
    session,
  }: VerifyPasskeyFederationCommand): Promise<StatusType> {
    const loginProcess = await this.cache.getFromCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
    });

    if (loginProcess?.type !== 'login start') {
      throw new BadRequestException('Login process not found');
    }

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

    const verify = await verification(
      response,
      this.clientUrl,
      challenge,
      passkey,
    );

    if (verify.verified) {
      await lastValueFrom(
        this.gRpcService.setCounter({
          credentialID: response.id,
          counter: verify.authenticationInfo.newCounter,
        }),
      );

      await this.cache.saveInCache<LoginProcessCache>({
        identifier: token,
        prefix: 'login-process',
        data: { type: 'login success', userId: loginProcess.userId ?? '' },
      });

      session.currentChallenge = undefined;

      await saveSession(session, this.logger);

      return { status: AuthStatus.login };
    } else {
      return { status: AuthStatus.logout };
    }
  }
}

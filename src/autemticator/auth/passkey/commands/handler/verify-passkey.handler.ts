import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { VerifyPasskeyCommand } from '../impl/verify-passkey.command.';
import {
  PASSKEY_PROXY_SERVICE_NAME,
  PasskeyProxyServiceClient,
} from 'src/proto/passkey';
import { AppConfig } from 'src/configs/app.configs';
import { TypeConfigService } from 'src/configs/types.config.service';
import { lastValueFrom } from 'rxjs';
import { AuthStatus } from 'src/autemticator/auth/types/login-status';
import { StatusType } from 'src/autemticator/auth/login/dto/status.type';
import { verification } from '../../helpers/verification';
import { saveSession } from 'src/autemticator/auth/helpers/save-session';

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

    const verify = await verification(
      response,
      this.clientUrl,
      challenge,
      passkey,
    );

    if (verify.verified) {
      session.user_id = passkey.userId;
      session.currentChallenge = undefined;

      await saveSession(session, this.logger);

      await lastValueFrom(
        this.gRpcService.setCounter({
          credentialID: response.id,
          counter: verify.authenticationInfo.newCounter,
        }),
      );

      return { status: AuthStatus.login };
    } else {
      return { status: AuthStatus.logout };
    }
  }
}

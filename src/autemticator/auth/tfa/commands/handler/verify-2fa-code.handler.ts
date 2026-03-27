import { Handler } from 'src/common/handler/handler';
import { StatusType } from 'src/autemticator/auth/login/dto/status.type';
import { AuthStatus } from 'src/autemticator/auth/types/login-status';
import { CommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { authenticator } from '@otplib/preset-default';
import { lastValueFrom } from 'rxjs';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { Verify2faCodeCommand } from '../impl/verify-2fa-code.command';
import { saveSession } from 'src/autemticator/auth/helpers/save-session';

@CommandHandler(Verify2faCodeCommand)
export class VerifyCodeHandler extends Handler<
  Verify2faCodeCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor() {
    super(LOGIN_PROXY_SERVICE_NAME);
  }
  async execute({
    code,
    email,
    session,
  }: Verify2faCodeCommand): Promise<StatusType> {
    const result = await lastValueFrom(
      this.gRpcService.getUser2FaSecret({ login: email }),
    );

    if (!result.secret) {
      throw new BadRequestException();
    }

    const verified = this.verifySecret(code, result.secret);

    if (!verified) {
      throw new BadRequestException('Wrong code');
    }

    session.user_id = result.userId;

    await saveSession(session, this.logger);

    return { status: AuthStatus.login };
  }

  private verifySecret(code: string, secret: string) {
    return authenticator.check(code, secret);
  }
}

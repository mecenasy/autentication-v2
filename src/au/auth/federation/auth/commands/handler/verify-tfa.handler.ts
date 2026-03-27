import { Handler } from 'src/common/handler/handler';
import { CommandHandler } from '@nestjs/cqrs';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { VerifyTfaFederationCommand } from '../impl/verify-tfa.command';
import { LoginProcessCache } from '../../../type/login-process';
import { BadRequestException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { authenticator } from '@otplib/preset-default';
import { AuthStatus } from 'src/au/auth/types/login-status';

@CommandHandler(VerifyTfaFederationCommand)
export class VerifyTfaFederationHandler extends Handler<
  VerifyTfaFederationCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor() {
    super(LOGIN_PROXY_SERVICE_NAME);
  }
  async execute({
    code,
    email,
    token,
  }: VerifyTfaFederationCommand): Promise<StatusType> {
    const loginProcess = await this.cache.getFromCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
    });

    if (loginProcess?.type !== 'login tfa') {
      throw new BadRequestException('Login process not found');
    }

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

    await this.cache.saveInCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
      data: { type: 'login success', userId: loginProcess.userId ?? '' },
    });

    return { status: AuthStatus.login };
  }

  private verifySecret(code: string, secret: string) {
    return authenticator.check(code, secret);
  }
}

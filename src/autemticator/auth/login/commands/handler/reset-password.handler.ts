import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { AuthStatus } from 'src/autemticator/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { ResetPasswordCommand } from '../impl/reset-password.command';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler extends Handler<
  ResetPasswordCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor() {
    super(LOGIN_PROXY_SERVICE_NAME);
  }

  async execute({ token, password }: ResetPasswordCommand) {
    const email = await this.cache.getFromCache<string>({
      identifier: token,
      prefix: 'forgot-password',
    });

    if (!email) {
      throw new BadRequestException('TOKEN_EXPIRED');
    }
    const user = await lastValueFrom(
      this.gRpcService.resetPassword({ email, password }),
    );

    if (user.success) {
      return { status: AuthStatus.resetPassword };
    }

    throw new BadRequestException(user.message);
  }
}

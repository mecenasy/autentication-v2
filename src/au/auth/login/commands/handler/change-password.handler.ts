import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { BadRequestException } from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';
import { ChangePasswordCommand } from '../impl/change-password.command';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { lastValueFrom } from 'rxjs';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler extends Handler<
  ChangePasswordCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor() {
    super(LOGIN_PROXY_SERVICE_NAME);
  }

  async execute({ userId, newPassword, oldPassword }: ChangePasswordCommand) {
    const { message, success } = await lastValueFrom(
      this.gRpcService.changePassword({ userId, newPassword, oldPassword }),
    );

    if (!success) {
      throw new BadRequestException(message);
    }

    return { status: AuthStatus.changePassword };
  }
}

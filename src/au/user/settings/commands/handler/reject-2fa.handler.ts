import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { InternalServerErrorException } from '@nestjs/common';
import { Reject2FaCommand } from '../impl/reject-2fa.command';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import {
  SETTINGS_PROXY_SERVICE_NAME,
  SettingsProxyServiceClient,
} from 'src/proto/user-settings';

@CommandHandler(Reject2FaCommand)
export class Reject2faHandler extends Handler<
  Reject2FaCommand,
  StatusType,
  SettingsProxyServiceClient
> {
  constructor() {
    super(SETTINGS_PROXY_SERVICE_NAME);
  }

  async execute({ id }: Reject2FaCommand): Promise<StatusType> {
    const { status, message } = await lastValueFrom(
      this.gRpcService.reject2Fa({ id }),
    );

    if (message || !status) {
      throw new InternalServerErrorException('Failed to reject 2FA');
    }

    return {
      status: AuthStatus.reject2fa,
    };
  }
}

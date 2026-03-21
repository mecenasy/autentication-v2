import { QueryHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusAuthCommand } from '../impl/status-auth.command';
import { StatusType } from '../../dto/status.type';
import { LoginStatusType } from '../../dto/login-status.tape';

@QueryHandler(StatusAuthCommand)
export class LoginStatusHandler extends Handler<
  StatusAuthCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor() {
    super(LOGIN_PROXY_SERVICE_NAME);
  }

  async execute({ userId }: StatusAuthCommand): Promise<LoginStatusType> {
    const { message, userStatus } = await lastValueFrom(
      this.gRpcService.getLoginStatus({ userId }),
    );

    if (!userId || message || !userStatus) {
      return { status: AuthStatus.logout };
    }

    return {
      status: AuthStatus.login,
      user: {
        id: userId,
        admin: userStatus.admin,
        email: userStatus.email,
        is2faEnabled: userStatus.is2fa,
        isAdaptiveLoginEnabled: userStatus.isAdaptive,
      },
    };
  }
}

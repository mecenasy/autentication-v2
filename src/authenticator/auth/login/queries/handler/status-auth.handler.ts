import { QueryHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';
import { StatusAuthQuery } from '../impl/status-auth.query';
import { StatusType } from '../../dto/status.type';
import { LoginStatusType } from '../../dto/login-status.tape';
import { TypeConfigService } from 'src/configs/types.config.service';
import { SmsConfig } from 'src/authenticator/notify/sms/config/sms.configs';

@QueryHandler(StatusAuthQuery)
export class LoginStatusHandler extends Handler<
  StatusAuthQuery,
  StatusType,
  LoginProxyServiceClient
> {
  constructor(private readonly configService: TypeConfigService) {
    super(LOGIN_PROXY_SERVICE_NAME);
  }

  async execute({ userId }: StatusAuthQuery): Promise<LoginStatusType> {
    if (!userId) {
      return {
        status: AuthStatus.logout,
        phoneId: this.configService.get<SmsConfig>('sms')?.watsappPhoneId,
      };
    }

    let data = await this.cache.getFromCache<LoginStatusType['user']>({
      identifier: userId,
      prefix: 'user-state',
    });

    if (data) {
      return {
        status: AuthStatus.login,
        user: data,
      };
    }

    const { message, userStatus } = await lastValueFrom(
      this.gRpcService.getLoginStatus({ userId }),
    );

    if (message || !userStatus) {
      return {
        status: AuthStatus.logout,
        message: 'User not found',
        phoneId: this.configService.get<SmsConfig>('sms')?.watsappPhoneId,
      };
    }

    data = {
      id: userId,
      admin: userStatus.admin,
      email: userStatus.email,
      is2faEnabled: userStatus.is2fa,
      isAdaptiveLoginEnabled: userStatus.isAdaptive,
    };

    await this.cache.saveInCache<LoginStatusType['user']>({
      identifier: userId,
      prefix: 'user-state',
      EX: 3600,
      data,
    });

    return {
      status: AuthStatus.login,
      user: data,
    };
  }
}

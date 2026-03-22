import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { LoginCommand } from '../impl/login.command';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { OtpService } from 'src/au/auth/otp/otp.service';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { LoginCache } from 'src/au/auth/types/cache-data';
import { SendVerifyCodeEvent } from 'src/au/notify/common/dto/send-verify-code.event';

@CommandHandler(LoginCommand)
export class LoginHandler extends Handler<
  LoginCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor(private readonly otpService: OtpService) {
    super(LOGIN_PROXY_SERVICE_NAME);
  }

  async execute({ email, password }: LoginCommand) {
    const user = await lastValueFrom(
      this.gRpcService.login({ email, password }),
    );

    if (!user.success) {
      return { status: AuthStatus.logout, message: user.message };
    }

    const code = this.otpService.generateOtp();

    await this.cache.saveInCache<LoginCache>({
      identifier: email,
      data: { code, userId: user.userId ?? '' },
    });

    if (user.is2fa) {
      return { status: AuthStatus.tfa };
    }

    this.event.emit(new SendVerifyCodeEvent(user.phone ?? '', email, code));

    return { status: AuthStatus.sms };
  }
}

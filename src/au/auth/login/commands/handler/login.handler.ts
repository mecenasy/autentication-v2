import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { LoginCommand } from '../impl/login.command';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { OtpService } from 'src/au/auth/otp/otp.service';
import { SmsCodeEvent } from '../../../../notify/sms/commands/dto/sms-code.event';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { MailCodeEvent } from '../../../../notify/smtp/dto/mail-code.event';
import { StatusType } from '../../dto/status.type';

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

    const code = this.otpService.generateOtp();

    await this.cache.saveInCache({
      identifier: email,
      data: code,
    });

    if (user.is2fa) {
      return { status: AuthStatus.tfa };
    }

    if (user.phone) {
      this.event.emit(new SmsCodeEvent(user.phone ?? '', code));
    }

    this.event.emit(new MailCodeEvent(email, code));

    return { status: AuthStatus.sms };
  }
}

import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { OtpService } from 'src/autemticator/auth/otp/otp.service';
import { AuthStatus } from 'src/autemticator/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { ForgotPasswordCommand } from '../impl/forgot-password.command';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { SendResetTokenEvent } from 'src/autemticator/notify/common/dto/send-reset-token.event';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler extends Handler<
  ForgotPasswordCommand,
  StatusType,
  UserProxyServiceClient
> {
  constructor(private readonly otpService: OtpService) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute({ email }: ForgotPasswordCommand) {
    const user = await lastValueFrom(this.gRpcService.findUser({ email }));

    if (user) {
      const token = this.otpService.generateToken();

      await this.cache.saveInCache<string>({
        identifier: token,
        data: user.email,
        EX: 600,
        prefix: 'forgot-password',
      });

      this.event.emit(new SendResetTokenEvent(user.email, token));
    }

    return { status: AuthStatus.forgotPassword };
  }
}

import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { LoginCommand } from '../impl/login.command';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { OtpService } from 'src/authenticator/auth/otp/otp.service';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { LoginCache } from 'src/authenticator/auth/types/cache-data';
import { SendVerifyCodeEvent } from 'src/authenticator/notify/common/dto/send-verify-code.event';
import { RiskService } from 'src/authenticator/auth/risk/risk.service';

@CommandHandler(LoginCommand)
export class LoginHandler extends Handler<
  LoginCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor(
    private readonly otpService: OtpService,
    private readonly riskService: RiskService,
  ) {
    super(LOGIN_PROXY_SERVICE_NAME);
  }

  async execute({ email, password, security }: LoginCommand) {
    const user = await lastValueFrom(
      this.gRpcService.login({
        email,
        password,
        fingerprintHash: security.fingerprint,
      }),
    );

    if (!user.success) {
      if (user.userId && user.isAdaptive && user.history) {
        this.riskService.addFailure(user.userId, security);
      }
      return { status: AuthStatus.logout, message: user.message };
    }

    if (user.isAdaptive && user.history) {
      const risk = await this.riskService.calculateRisk(
        user.userId ?? '',
        user.history,
        security,
      );

      if (risk.score <= 40) {
        return { status: AuthStatus.login, score: risk.score };
      }
    }

    if (user.is2fa) {
      return { status: AuthStatus.tfa };
    }

    const code = this.otpService.generateOtp();

    await this.cache.saveInCache<LoginCache>({
      identifier: email,
      data: { code, userId: user.userId ?? '' },
    });

    this.event.emit(new SendVerifyCodeEvent(user.phone ?? '', email, code));

    return { status: AuthStatus.sms };
  }
}

import { Handler } from 'src/common/handler/handler';
import { OtpService } from 'src/autemticator/auth/otp/otp.service';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { LoginFederationCommand } from '../impl/login.command';
import { CommandHandler } from '@nestjs/cqrs';
import { StatusType } from 'src/autemticator/auth/login/dto/status.type';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceClient,
} from 'src/proto/login';
import { AuthStatus } from 'src/autemticator/auth/types/login-status';
import { RiskService } from 'src/autemticator/auth/risk/risk.service';
import { SendVerifyCodeEvent } from 'src/autemticator/notify/common/dto/send-verify-code.event';
import { LoginProcessCache } from '../../../type/login-process';

@CommandHandler(LoginFederationCommand)
export class LoginFederationHandler extends Handler<
  LoginFederationCommand,
  StatusType,
  LoginProxyServiceClient
> {
  constructor(
    private readonly otpService: OtpService,
    private readonly riskService: RiskService,
  ) {
    super(LOGIN_PROXY_SERVICE_NAME);
  }
  async execute({
    email,
    password,
    token,
    security,
  }: LoginFederationCommand): Promise<StatusType> {
    const loginProcess = await this.cache.getFromCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
    });

    if (loginProcess?.type !== 'login start') {
      throw new BadRequestException('Login process not found');
    }

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
      return { status: AuthStatus.logout };
    }

    if (user.isAdaptive && user.history) {
      const risk = await this.riskService.calculateRisk(
        user.userId ?? '',
        user.history,
        security,
      );

      if (risk.score <= 40) {
        await this.cache.saveInCache<LoginProcessCache>({
          identifier: token,
          prefix: 'login-process',
          data: { type: 'login success', email, userId: user.userId ?? '' },
        });
        return { status: AuthStatus.login };
      }
    }

    if (user.is2fa) {
      await this.cache.saveInCache<LoginProcessCache>({
        identifier: token,
        prefix: 'login-process',
        data: { type: 'login tfa', email, userId: user.userId ?? '' },
      });
      return { status: AuthStatus.provider2fa };
    }

    const code = this.otpService.generateOtp();

    await this.cache.saveInCache<LoginProcessCache>({
      identifier: token,
      prefix: 'login-process',
      data: { type: 'login code', code, email, userId: user.userId ?? '' },
    });

    this.event.emit(new SendVerifyCodeEvent(user.phone ?? '', email, code));

    return { status: AuthStatus.providerSms };
  }
}

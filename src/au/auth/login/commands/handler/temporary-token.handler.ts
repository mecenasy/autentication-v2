import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { InternalServerErrorException } from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { TemporaryTokenCommand } from '../impl/temporary-token.command';
import { OtpService } from 'src/au/auth/otp/otp.service';
import { TypeConfigService } from 'src/configs/types.config.service';
import { AppConfig } from 'src/configs/app.configs';

@CommandHandler(TemporaryTokenCommand)
export class TemporarySocialTokenHandler extends Handler<
  TemporaryTokenCommand,
  StatusType,
  UserProxyServiceClient
> {
  constructor(
    private readonly otpService: OtpService,
    private readonly configService: TypeConfigService,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute({ fail, email, response, session }: TemporaryTokenCommand) {
    const token = this.otpService.generateToken();

    if (fail) {
      response.redirect(
        `${this.configService.getOrThrow<AppConfig>('app')?.clientUrl ?? ''}?login=fail`,
      );

      return { status: AuthStatus.logout };
    }

    await this.cache.saveInCache<string>({
      identifier: token,
      prefix: 'verify-token',
      data: email,
      EX: 60,
    });

    await new Promise<void>((resolve, reject) => {
      session.save((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session.'));
          this.logger.error(err);
        } else {
          resolve();
        }
      });
    });

    response.redirect(
      `${this.configService.getOrThrow<AppConfig>('app')?.clientUrl ?? ''}/status?token=${token}`,
    );

    return { status: AuthStatus.login };
  }
}

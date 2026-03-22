import { Handler } from 'src/common/handler/handler';
import { VerifyCodeCommand } from '../impl/verify-code.command';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { CommandHandler } from '@nestjs/cqrs';
import { LoginCache } from 'src/au/auth/types/cache-data';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(VerifyCodeCommand)
export class VerifyCodeHandler extends Handler<
  VerifyCodeCommand,
  StatusType,
  any
> {
  constructor() {
    super();
  }
  async execute({
    code,
    email,
    session,
  }: VerifyCodeCommand): Promise<StatusType> {
    const cache = await this.cache.getFromCache<LoginCache>({
      identifier: email,
    });

    if (cache?.code !== code) {
      return { status: AuthStatus.logout };
    }
    await this.cache.removeFromCache({ identifier: email });

    session.user_id = cache.userId;
    this.logger.log(session);
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

    return { status: AuthStatus.login };
  }
}
